const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync')
//create model using campground schema
const Campground = require('../models/campground');

//Render Campground index page
module.exports.renderIndex = catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({}).exec()
    .then((campgrounds)=> {
        res.render('campgrounds/index', {campgrounds});
    })
});
//render Campground details HTML page
module.exports.renderDetails = catchAsync(async (req, res, next) => {
    console.log("Show Route");
    // try{
    const {id} = req.params;
    console.log(id);
    
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    .then(function(campground){
        if(!campground) throw new ExpressError("Page not Found", 404);
        else{
           // console.log(campground)
            res.render('campgrounds/show', {campground});
        }
        
    })
});
//render New campground HTML page
module.exports.renderNew = (req, res) => {
    res.render("campgrounds/new");
};
//render Campground edit HTML page
module.exports.renderEdit = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).exec()
    .then(function(campground){
        if(!campground) throw new ExpressError("Page not Found", 404);
        else
        res.render('campgrounds/edit', {campground});
    })
});
//create method - Campground, creates new campground document and inserts it into the database
module.exports.createNew = catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    
    req.body.campground.author = req.user._id;
     await Campground.insertMany(req.body.campground)
    .then((camp)=>{
        console.log(camp);
        
        req.flash('success', 'Successfully made a new campground'); //appends messages to top of redirect page
        res.redirect(`/campgrounds/${camp[0]._id}`)
    })
});
//update method, updates existing campground document based on id
module.exports.update = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {new: true, runValidators: true} ).exec()
    .then((campground)=>{
        if(!campground) throw new ExpressError("Invalid Campground Data", 400);
        else{
            //appends messages to top of redirect page
            req.flash('success', 'Successfully updated campground');
            res.redirect(`/campgrounds/${campground._id}`)
        }
    })
});
//delete method, deletes existing campground document based off id
module.exports.delete = catchAsync(async (req, res,next) => {
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
});