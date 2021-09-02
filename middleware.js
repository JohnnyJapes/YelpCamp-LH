const Review = require("./models/review");
const Campground = require('./models/campground');
const ExpressError = require("./utils/expressError");
const {campgroundSchema, reviewSchema, userSchema} = require('./schemas/schemas')

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

//function to validate campground data using Joi
module.exports.validateCampground = function(req, res, next){
    const {error} = campgroundSchema.validate(req.body);
    if(error){ 
        const msg = error.details.map(er => er.message).join (',');
        throw new ExpressError(msg, 400);
    }
    else next();
};
//Function to validate review data using Joi
module.exports.validateReview = function(req, res, next){
    const {error} = reviewSchema.validate(req.body);
    if(error){ 
        const msg = error.details.map(er => er.message).join (',');
        throw new ExpressError(msg, 400);
    }
    else next();
};
//function to validate user data using Joi
module.exports.validateUserInfo = function(req, res, next){
    const {error} = userSchema.validate(req.body);
    if(error){
        const msg = error.details.map(er => er.message).join (',');
        throw new ExpressError(msg, 400);

    }
    else next();
}
