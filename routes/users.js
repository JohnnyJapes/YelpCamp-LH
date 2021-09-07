const express = require('express');
const router = express.Router();
const passport = require('passport');
const {isLoggedIn, validateUserInfo} = require('../middleware');
const users = require('../controllers/users')


router.route('/register')
    //user registration page
    .get(users.renderRegister)
    //User creation
    .post(validateUserInfo, users.createUser);

router.route('/login')
    //log in page
    .get(users.renderLogin)
    //User login route
    .post(passport.authenticate('local',
        { failureRedirect: '/login',
            failureFlash: true,
            //successRedirect: '/campgrounds',

        }), users.login)

//user logout route
router.get('/logout', isLoggedIn, users.logout)

module.exports = router;