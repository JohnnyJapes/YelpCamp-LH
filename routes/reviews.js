const express = require('express');
const router = express.Router({mergeParams: true});
const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync')
const Joi = require('joi');
const {reviewSchema} = require('../schemas/schemas')
//create model using schema
const Campground = require('../models/campground');
const Review = require('../models/review');

//Function to validate review data using Joi
function validateReview(req, res, next){
    const {error} = reviewSchema.validate(req.body);
    if(error){ 
        const msg = error.details.map(er => er.message).join (',');
        throw new ExpressError(msg, 400);
    }
    else next();
};


//create route - REVIEW
router.post('/', validateReview, catchAsync(async (req, res, next) => {
    const {id} = req.params;
    console.log(id);
    const campground = await Campground.findById(id);
    console.log(campground);
    const review = await new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save()
    .then((rev)=>{
        console.log(rev);
        //appends messages to top of redirect page
        req.flash('success', 'Successfully made a new review');
        res.redirect(`/campgrounds/${id}`)
    })
}));

//Delete - Review
router.delete('/:reviewId', catchAsync(async (req, res,next) => {
    console.log("delete review");
    const {id, reviewId} = req.params;
    console.log(id, reviewId);
    //$pull is an operator in mongo, it removes any matches
    await Campground.findByIdAndUpdate(id, {$pull: { reviews: reviewId}})
    const review = await Review.findByIdAndDelete(reviewId).exec()
    .then((review)=>{
        if(!review) throw new ExpressError("Page not Found", 404);
        else{
            //appends messages to top of redirect page
            req.flash('success', 'Successfully deleted review');
            res.redirect(`/campgrounds/${id}`)
        }
    })   
}))

module.exports = router;