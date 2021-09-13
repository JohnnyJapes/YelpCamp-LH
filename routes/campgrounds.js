const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const multer = require('multer')
const {storage} = require('../cloudinary/index')
const upload = multer({storage})

//new campground page
router.get('/new',isLoggedIn, campgrounds.renderNew);

router.route('/')
    //index route
    .get( campgrounds.renderIndex)
    //create new campground route
    .post(isLoggedIn, upload.array('image'), validateCampground,  campgrounds.createNew);

//campground details routes
router.route('/:id')
    //render show/details route
    .get(campgrounds.renderDetails)
    //update route
    .put(isLoggedIn, isAuthor, validateCampground, campgrounds.update)
    //delete route
    .delete(isLoggedIn, isAuthor, campgrounds.delete);

//edit route
router.get('/:id/edit',isLoggedIn, isAuthor, campgrounds.renderEdit);

module.exports = router;
