const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync')
const Joi = require('joi');
const {campgroundSchema} = require('../schemas/schemas')
//create model using campground schema
const Campground = require('../models/campground');


//function to validate campground data using Joi
function validateCampground(req, res, next){
    const {error} = campgroundSchema.validate(req.body);
    if(error){ 
        const msg = error.details.map(er => er.message).join (',');
        throw new ExpressError(msg, 400);
    }
    else next();
};



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
        req.flash('success', 'Successfully made a new campground');
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
        else
        res.redirect(`/campgrounds/${campground._id}`)
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
        else
        res.redirect(`/campgrounds`)
    })   
}));




module.exports = router;
