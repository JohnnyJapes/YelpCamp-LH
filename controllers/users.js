const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync')
//create models using schema
const User= require('../models/user');

//render user registration page
module.exports.renderRegister = catchAsync(async function(req, res, next){
    //Check if user is already logged in
     if (req.isAuthenticated()) {
         return res.redirect('/campgrounds');
     }
     res.render('users/register')
 });
//render user login page
module.exports.renderLogin = (req, res) => {
    //Check if user is already logged in
    if (req.isAuthenticated()) {
        return res.redirect('/campgrounds');
    }
    res.render('users/login')           
};
//new user creation
module.exports.createUser = catchAsync(async function(req, res, next){
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
});
//user login
module.exports.login = function(req, res, next){
    req.flash('success', 'Successfully Logged in')
    if (req.session.returnTo){
        var destination = req.session.returnTo;
        delete req.session.returnTo;
    }
    else{
        var destination = '/campgrounds'
    }
    res.redirect(destination)
};
//user logout
module.exports.logout = function(req, res, next){
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
};