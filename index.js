//requirements
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
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
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({}).exec()
    .catch(err =>{
        console.log(err);
        res.redirect('/');
    });
    res.render('campgrounds/index', {campgrounds});
});

//Show/Details route
app.get('/campgrounds/:id', async (req, res) => {
    console.log("Show Route");
    const {id} = req.params;
    console.log(id);
    const campground = await Campground.findById(id).exec()
    .catch(err =>{
        console.log(err);
        res.redirect('/campgrounds');
    });
    res.render('campgrounds/show', {campground});
});
//edit route
app.get('/campgrounds/:id/edit', async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).exec()
    .catch(err =>{
        console.log(err);
        res.redirect('/campgrounds');
    });
    res.render('campgrounds/edit', {campground});
});
//create route
app.post('/campgrounds', async (req, res) => {
    const {title, price, description, city, state, image} = req.body.campground;
    //console.log (req.body.campground);
    const location = city+", "+state;
    //console.log(location);
     await Campground.insertMany({title, price, description, location, image })
    .then((product)=>{
        console.log(product);
        res.redirect(`/campgrounds/${product[0]._id}`)
    })
    .catch(e =>{
        console.log(e);
        res.redirect('/campgrounds');
    });
    //res.redirect('/campgrounds/');

});
//Update route
app.put('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const {title, price, description, city, state, image} = req.body.campground;
    const location = city+", "+state;
    const product = await Campground.findByIdAndUpdate(id, {title, price, description, location, image }, {new: true, runValidators: true} ).exec()
    .then((product)=>{
        console.log(product);
        res.redirect(`/campgrounds/${product._id}`)
    })
    .catch(e =>{
        console.log(e);
        res.redirect('/campgrounds');
    });
    
});
//delete
app.delete('/campgrounds/:id', async (req, res) => {
    console.log("delete");
    const {id} = req.params;
    const product = await Campground.findByIdAndDelete(id).exec()
    .catch(e =>{
        console.log(e);
        res.redirect('/campgrounds');
    });
    res.redirect(`/campgrounds`)
})