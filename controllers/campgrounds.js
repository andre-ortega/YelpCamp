const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const { cloudinary } = require('../cloudinary');

// File where we are exporting specific functions
module.exports.index = async (req, res) => {
    campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {

    geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));

    // this should be error handled to check for any bad inputs, however, it is no
    campground.geometry = geoData.body.features[0].geometry;

    // req.user._id is added automatically, covered in auth, for campground/author association
    campground.author = req.user._id;

    // console.log(req.body);
    await campground.save();
    // console.log(campground);
    req.flash('success', 'Successfully made a new campground!')

    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    // populate the authors of every review as well as the author of the campground itself
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    //console.log(campground);
    if(!campground){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    // Find the campground
    const campground = await Campground.findById(id);
    // Ensure its existence, otherwise redirect
    if(!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    // Send the form
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async(req, res) => {
    const { id } = req.params;
    //console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map( f => ({ url: f.path, filename: f.filename }));
    // Spread operator! :D
    campground.images.push(...imgs);

    // If this property is specified...
    if(req.body.deleteImages) {
        // Destroy images within cloudinary
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        // update our campground, pull from the images array all images where the filename is in the deleteImages array
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}});
        //console.log(campground);
    }

    await campground.save();
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req,res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}
