const Joi = require('joi');


module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.object({
            city: Joi.string().required(),
            state: Joi.string().required()
        }).required(),
        // image: Joi.string().required(),
        description: Joi.string().required(),
        geometry: Joi.object()
    }).required(),
    file: Joi.object({
        path: Joi.string(),
        filename: Joi.string(),
    }),
    images: Joi.object()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(0).max(5)
    }).required()
});

module.exports.userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
})