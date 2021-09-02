const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync')
const Joi = require('joi');
const {userSchema} = require('../schemas/schemas')
const passport = require('passport');
//create model using campground schema
const Campground = require('../models/campground');
const User = require('../models/user');


//function to validate user data using Joi
function validateUserInfo(req, res, next){
    const {error} = userSchema.validate(req.body);
    if(error){
        const msg = error.details.map(er => er.message).join (',');
        throw new ExpressError(msg, 400);

    }
    else next();
}

//user registration
router.get('/register', catchAsync(async function(req, res, next){
   //Check if user is already logged in
    if (req.isAuthenticated()) {
        return res.redirect('/campgrounds');
    }
    res.render('users/register')
}))
//User creation
router.post('/register', validateUserInfo, catchAsync(async function(req, res, next){
    const {username, password, email} = req.body;
    const tempUser = new User({username, email})
    try{
       const registeredUser = await User.register(tempUser, password) 
       req.flash('success', 'Successfully registered');
        console.log('user registered!');
        if (registeredUser){
            console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) return next();
            else res.redirect('/campgrounds');
         });
         }
    }
    catch(err){
            
              console.log('error during registration!', err);
              req.flash('error', err.message);
              res.redirect('/register')
              //return next(err);
            
          
    }
    
      
      
    
}))
//log in page
router.get('/login', (req, res) => {
    //Check if user is already logged in
    if (req.isAuthenticated()) {
        return res.redirect('/campgrounds');
    }
    res.render('users/login')           
})
//User login 
router.post('/login', passport.authenticate('local',
     { failureRedirect: '/login',
        failureFlash: true,
        //successRedirect: '/campgrounds',

    }), 
    function(req, res, next){
        req.flash('success', 'Successfully Logged in')
        if (req.session.returnTo){
            var destination = req.session.returnTo;
            delete req.session.returnTo;
        }
        else{
            var destination = '/campgrounds'
        }
        res.redirect(destination)
        
        

})

router.post('/login', catchAsync(async function(req, res, next){
    const {username, password} = req.body;
    const userLogin = await User.findByUsername({username});
    await userLogin.authenticate(password)
        .then()
}))

router.get('/logout', function(req, res, next){
    req.logout();
    const editRe = new RegExp('\/campgrounds\/.*\/edit')
    const filterRe = /\/campgrounds\/.*(?=\/)/
    if (editRe.test(req.session.returnTo)){
        var returnTo = req.session.returnTo;
        var found = returnTo.match(filterRe);
        var destination = found[0];
    }
    else if (req.session.returnTo !== '/campgrounds/new') var destination = req.session.returnTo;
    else { var destination = '/campgrounds'}
    res.redirect(destination);
})

module.exports = router;