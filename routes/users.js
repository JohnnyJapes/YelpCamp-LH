const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync')
const Joi = require('joi');
const {userSchema} = require('../schemas/schemas')
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
    res.render('users/register')
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

module.exports = router;