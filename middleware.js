const Review = require("./models/review");
const Campground = require('./models/campground');
const ExpressError = require("./utils/expressError");

module.exports.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    else{
        req.flash('error', 'You are not logged in');
        if (req.session){
            req.session.returnTo = req.originalUrl || req.url;
        }
        
        res.redirect('/login')
    }
}

module.exports.isAuthor = async function(req, res, next){
    const {id, reviewId} = req.params;
    if(reviewId){
        const review = await Review.findById(reviewId)
        .catch((err)=>{
            next(err);
        });
        if(review.author.equals(req.user._id)) return next();
        else next(new ExpressError('Not authorized', 403));
    }
    else if(id){
        const campground = await Campground.findById(id).populate('author')
        .catch((err)=>{
            next(err);
        })
            
        if (campground.author.equals(req.user._id)) return next();
        else {
            next(new ExpressError('Not authorized', 403));
        }
    }
    else next(new ExpressError('Not authorized', 403));
}