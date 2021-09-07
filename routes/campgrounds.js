const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')

//new campground page
router.get('/new',isLoggedIn, campgrounds.renderNew);
//index route
router.get('/', campgrounds.renderIndex);


//Show/Details route
router.get('/:id', campgrounds.renderDetails);

//edit route
router.get('/:id/edit',isLoggedIn, isAuthor, campgrounds.renderEdit);

//create route - Campground
router.post('/', isLoggedIn, validateCampground, campgrounds.createNew);

//Update route
router.put('/:id', isLoggedIn, isAuthor, validateCampground, campgrounds.update);

//delete - Campground
router.delete('/:id', isLoggedIn, isAuthor, campgrounds.delete);


module.exports = router;
