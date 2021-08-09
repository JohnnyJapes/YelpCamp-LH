//requirements
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
//create model using campground schema
const Campground = require('./models/campground');


//set views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//set up parsing for data types
//app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
//app.use(express.json()) // for parsing application/json
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


app.listen(3000, () =>{
    console.log('Listening on Port 3000') 
});
//homepage route
app.get('/', (req, res) => {
    res.render('home');
})

//index route
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({}).exec()
    .catch(err =>{
        console.log(err);
        res.redirect('/');
    });
    res.render('campgrounds/index', {campgrounds});
})

//Show/Details route
app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).exec()
    .catch(err =>{
        console.log(err);
        res.redirect('/campgrounds');
    });
    res.render('campgrounds/show', {campground});
})