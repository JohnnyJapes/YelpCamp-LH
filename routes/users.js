const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn, validateUserInfo} = require('../middleware');
const users = require('../controllers/users')

//user registration page
router.get('/register', users.renderRegister)

//User creation
router.post('/register', validateUserInfo, users.createUser)

//log in page
router.get('/login', users.renderLogin);

//User login route
router.post('/login', passport.authenticate('local',
     { failureRedirect: '/login',
        failureFlash: true,
        //successRedirect: '/campgrounds',

    }), users.login)

//user logout route
router.get('/logout', isLoggedIn, users.logout)

module.exports = router;