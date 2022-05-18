
if(process.env.NODE_ENV !== "PRODUCTION" ) {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const MongoStore = require('connect-mongo');

const userRoutes = require('./routes/user');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, {
    useNewUrlParser: true, 
    useUnifiedTopology: true })
        .then(() => {
            console.log("Mongo connected.")
        })
        .catch(err => {
            console.log("NO RESPONSE - MONGO");
            console.log(err)
});

const app = express();

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// body parser
app.use(express.urlencoded({ extended: true }));
// Override POST methods to allow for DELETE, PATCH, etc, choosing _method as the string that we want to use
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'topsecretbeepboop';

/*
const store = {
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
};

store.on("error", function(e) {
    console.log("SESSION STORE ERROR", e )
});
*/

const sessionConfig = {
    secret,

    store: MongoStore.create({
        mongoUrl: dbUrl,
        secret:'topsecretbeepboop',
        touchAfter: 24 * 60 * 60
    }),
    name: 'session',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 + 60 * 60 * 24 * 7
    }
}


app.use(session(sessionConfig));
app.use(flash());
// automatically use all eleven

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];

const styleSrcUrls = [
    "https://cdn.jsdelivr.net",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];

const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];

const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/draymonds/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.query);
    // Show us what is stored in the session after each page load
    //console.log(req.session);

    // this will tell us if a user is signed in, allowing us to update navbar links
    res.locals.currentUser = req.user;

    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// defined static resource for bootstrap
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));

app.get('/fakeUser', async( req, res) => {
    const user = new User({ email: 'drega@gmail.com', username: 'drega' });
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

//app.get('/makecampground', async (req, res) => {
//    const camp = new Campground({title: 'My Backyard', description: 'cheap camping!' });
//    await camp.save();
//    res.send(camp);
//});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no! Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
