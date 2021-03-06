if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

//requirements
const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const Joi = require('joi');
const {campgroundSchema, reviewSchema} = require('./schemas/schemas')
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError');
const catchAsync = require('./utils/catchAsync')
const session = require('express-session'); 
const flash = require('connect-flash')
const cloudinary = require('cloudinary').v2;
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const MongoStore = require('connect-mongo')
//passport
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
//create model using campground schema
const Campground = require('./models/campground');
const Review = require('./models/review');
//router files
const campgroundRoutes = require ('./routes/campgrounds');
const reviewRoutes = require ('./routes/reviews')
const userRoutes = require('./routes/users')
// requires the model with Passport-Local Mongoose plugged in
const User = require('./models/user');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'// process.env.DB_URL

app.engine('ejs', ejsMate); //ejs-mate setup
//set views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


  
//connect mongoose, basic error handling, useCreateIndex:true to avoid deprecation warnings from MongoDB
//local host and single DB for now
//mongoose.connect('mongodb://localhost:27017/yelp-camp', {
mongoose.connect(dbUrl, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
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


// const store = new MongoStore({
//     url: dbUrl,
//     secret: 'secretwordshouldbesupersecret',
//     touchAfter: 24 * 3600
// });

// store.on("error", function (e) {
//     console.log("Session Store Error", e)
// })
//Session configuration
const sessionConfig = {
    name: 'campSes',
    secret: 'secretwordshouldbesupersecret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: dbUrl,
        
        secret: 'secretwordshouldbesupersecret',
        touchAfter: 24 * 3600
      }),
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //calculation is for ms in a week
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        //secure: true
    }
}

//session setup
app.use(session(sessionConfig));

app.use(flash());

app.use(
    helmet()
  );
  const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dxmydkp0v/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "http://res.cloudinary.com/dxmydkp0v/",
                "https://images.unsplash.com/",
                "https://source.unsplash.com/collection/483251",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


//set up parsing for data types
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//app.use(express.json()) // for parsing application/json
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

//set up method override so we can use PATCH, PUT, DELETE routes
app.use(methodOverride('_method'));

//set up directory for scripts and the like
app.use(express.static(path.join(__dirname, 'public')))

//sanitize input to prevent mongo injection
app.use(mongoSanitize())

// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//local variable for flash success middleware, exposes these variables to ejs
app.use((req, res, next) => {
    if (!['/login', '/register', '/', '/logout', '/favicon.ico'].includes(req.originalUrl) && !(new RegExp('review').test(req.originalUrl))) {
        console.log('index')
        console.log(req.originalUrl);
        req.session.returnTo = req.originalUrl;
    }
    console.log(req.session);
    //console.log(req.user)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    //local for cloudinary. Primarily for image display
    res.locals.cloudinary = cloudinary;
    next();
})
app.listen(process.env.PORT || 3000, () =>{
    console.log('Listening on Port ' + process.env.PORT) 
});


//homepage route
app.get('/', (req, res) => {
    res.render('home');
});
app.use('/favicon.ico', express.static('favicon.ico'))
//user route
app.use('/', userRoutes)
//route for reviews
app.use('/campgrounds/:id/reviews', reviewRoutes)
//route for campgrounds
app.use('/campgrounds', campgroundRoutes)


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