const express = require('express');
const router = express.Router({mergeParams: true});
const {isLoggedIn, isAuthor, validateReview} = require('../middleware');
const reviews = require('../controllers/reviews')



//create route - REVIEW
router.post('/',isLoggedIn, validateReview, reviews.createReview);

//Delete - Review
router.delete('/:reviewId', isLoggedIn, isAuthor, reviews.deleteReview)

module.exports = router;