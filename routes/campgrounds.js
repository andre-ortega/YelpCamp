const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
//const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds');
//const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');
const multer = require('multer');
// This is in an index.js and node knows to look for that
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    // This will catch trash data being sent from the newCampgrounds form
    .post(isLoggedIn, upload.array('avatar'), validateCampground, catchAsync(campgrounds.createCampground));
    // Multer middleware
//    .post(upload.single('avatar'), (req, res) => {
//        console.log(req.file, req.body);
//        res.send("IT WORKED");
//    })

// Authenticated
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// using middleware function to restrict users from accessing edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
