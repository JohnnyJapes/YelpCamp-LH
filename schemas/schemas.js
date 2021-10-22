const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages:{
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate (value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
})
const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        location: Joi.object({
            city: Joi.string().required().escapeHTML(),
            state: Joi.string().required().escapeHTML()
        }).required(),
        // image: Joi.string().required(),
        description: Joi.string().required().escapeHTML(),
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
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().required().min(0).max(5)
    }).required()
});

module.exports.userSchema = Joi.object({
    username: Joi.string().required().escapeHTML(),
    email: Joi.string().required().escapeHTML(),
    password: Joi.string().required()
})
