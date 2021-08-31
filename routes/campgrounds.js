const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync')
const Joi = require('joi');
const {campgroundSchema, userSchema} = require('../schemas/schemas')
//create model using campground schema
const Campground = require('../models/campground');
const User = require('../models/user');


//function to validate campground data using Joi
function validateCampground(req, res, next){
    const {error} = campgroundSchema.validate(req.body);
    if(error){ 
        const msg = error.details.map(er => er.message).join (',');
        throw new ExpressError(msg, 400);
    }
    else next();
};
function validateUserInfo(req, res, next){
    const {error} = userSchema.validate(req.body);
    if(error){
        const msg = error.details.map(er => er.message).join (',');
        throw new ExpressError(msg, 400);

    }
    else next();
}


router.get('/new',(req, res) => {
    res.render("campgrounds/new");
});
//index route
router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({}).exec()
    .then((campgrounds)=> {
        res.render('campgrounds/index', {campgrounds});
    })
}));

//user registration
router.get('/register', catchAsync(async function(req, res, next){
    res.render('campgrounds/register')
}))

router.post('/register', validateUserInfo, catchAsync(async function(req, res, next){
    const {username, password, email} = req.body;
    tempUser = new User({username, email})
    User.register(tempUser, password, function(err) {
        if (err) {
          console.log('error while user register!', err);
          req.flash('failure', 'failed to register');
          return next(err);
        }
        req.flash('success', 'Successfully registered');
        console.log('user registered!');
    
        res.redirect('/campgrounds');
      })
}))

//Show/Details route
router.get('/:id', catchAsync(async (req, res, next) => {
    console.log("Show Route");
    // try{
    const {id} = req.params;
    console.log(id);
    
    const campground = await Campground.findById(id).populate('reviews')
    .then(function(campground){
        if(!campground) throw new ExpressError("Page not Found", 404);
        else
        res.render('campgrounds/show', {campground});
    })
})
);
//edit route
router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).exec()
    .then(function(campground){
        if(!campground) throw new ExpressError("Page not Found", 404);
        else
        res.render('campgrounds/edit', {campground});
    })
}));

//create route - Campground
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    
    
     await Campground.insertMany(req.body.campground)
    .then((camp)=>{
        console.log(camp);
        
        req.flash('success', 'Successfully made a new campground'); //appends messages to top of redirect page
        res.redirect(`/campgrounds/${camp[0]._id}`)
    })
}));
//Update route
router.put('/:id', validateCampground, catchAsync(async (req, res, next) => {
    //if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    const {id} = req.params;
    //const {title, price, description, city, state, image} = req.body.campground;
    //const location = city+", "+state;
    //const location = {city, state};
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {new: true, runValidators: true} ).exec()
    .then((campground)=>{
        if(!campground) throw new ExpressError("Invalid Campground Data", 400);
        else{
            //appends messages to top of redirect page
            req.flash('success', 'Successfully updated campground');
            res.redirect(`/campgrounds/${campground._id}`)
        }
    })
}));
//delete - Campground
router.delete('/:id', catchAsync(async (req, res,next) => {
    console.log("delete");
    const {id} = req.params;
    console.log(id);
    const campground = await Campground.findByIdAndDelete(id).exec()
    .then((campground)=>{
        if(!campground) throw new ExpressError("Page not Found", 404);
        else{
            //appends messages to top of redirect page
            req.flash('success', 'Successfully deleted campground');
            res.redirect(`/campgrounds`)
        }
    })   
}));




module.exports = router;
