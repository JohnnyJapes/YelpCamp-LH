//requirements
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const Joi = require('joi');
const {campgroundSchema} = require('./schemas/schemas')
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError');
const catchAsync = require('./utils/catchAsync')
//create model using campground schema
const Campground = require('./models/campground');

app.engine('ejs', ejsMate); //ejs-mate setup
//set views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//set up parsing for data types
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
//app.use(express.json()) // for parsing application/json
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
//set up method override so we can use PATCH, PUT, DELETE routes
app.use(methodOverride('_method'));

//connect mongoose, basic error handling, useCreateIndex:true to avoid deprecation warnings from MongoDB
//local host and single DB for now
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(function(){
        console.log("Mongo Connection open")
    })
    .catch(err => {
    console.log("Mongo connection error");
    console.log(err);
});

//listener fuction to catch errors on connection
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

function validateCampground(req, res, next){
    const {error} = campgroundSchema.validate(req.body);
    if(error){ 
        const msg = error.details.map(er => er.message).join (',');
        throw new ExpressError(msg, 400);
    }
    else next();
};



app.listen(3000, () =>{
    console.log('Listening on Port 3000') 
});
//homepage route
app.get('/', (req, res) => {
    res.render('home');
});
//New route
app.get('/campgrounds/new',(req, res) => {
    res.render("campgrounds/new");
});
//index route
app.get('/campgrounds', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({}).exec()
    .then((campgrounds)=> {
        res.render('campgrounds/index', {campgrounds});
    })
}));

//Show/Details route
app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    console.log("Show Route");
    // try{
    const {id} = req.params;
    console.log(id);
    
    const campground = await Campground.findById(id)
    .then(function(campground){
        if(!campground) throw new ExpressError("Page not Found", 404);
        else
        res.render('campgrounds/show', {campground});
    })
})
);
//edit route
app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).exec()
    .then(function(campground){
        if(!campground) throw new ExpressError("Page not Found", 404);
        else
        res.render('campgrounds/edit', {campground});
    })
}));

//create route
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
    

     await Campground.insertMany(req.body.campground)
    .then((camp)=>{
        console.log(camp);
        res.redirect(`/campgrounds/${camp[0]._id}`)
    })
}));
//Update route
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next) => {
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
//delete
app.delete('/campgrounds/:id', catchAsync(async (req, res,next) => {
    console.log("delete");
    const {id} = req.params;
    console.log(id);
    const campground = await Campground.findByIdAndDelete(id).exec()
    .then((campground)=>{
        if(!campground) throw new ExpressError("Page not Found", 404);
        else
        res.redirect(`/campgrounds`)
    })   
}))



//route to throw error and trigger error page
app.get('/debugError',(req, res, next) => {
    
    throw new ExpressError();
})
app.all('*', (req, res, next)=>{
    throw new ExpressError("Page not Found", 404);
})

const handleValidationErr = err => {
    //console.dir(err);
    //In a real app, we would do a lot more here...
    //console.log("return object start ----------------------");
    return new ExpressError(`Validation Failed...${err.message}`, 400)
}

app.use((err, req, res, next) => {
    console.log(err.name);
    if (err.name === 'ValidationError') err = handleValidationErr(err);
    next(err);
})


//basic custom error handling
app.use((err, req, res, next) => {
    if (!err.status) err.status = 500;
    if (!err.message) err.message = 'Something went wrong';
    console.dir(err);
    res.render('error', {err})
})