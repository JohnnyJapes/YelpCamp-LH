//require mongoose for schema usage
const mongoose = require('mongoose');
const review = require('./review');
//shortcut so I don't have to type mongoose.Schema everytime
const Schema = mongoose.Schema;

const opts = {toJSON: {virtuals: true}}

const campgroundSchema = new Schema({

    title:{
        type: String,
    },
    price:{
        type: Number,
        min: 0,
        required: true
    },
    geometry:{
        type: {
            type:String,
            enum: ['Point'], // 'geometry.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }

    },
    description:{
        type: String  
    },
    location:{
        city: String,
        state: String
    },
    image:[
        {
            url: String,
            filename: String
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: 
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    
    

}, opts);

//Delete all asociated reviews after A campground is Deleted
campgroundSchema.post('findOneAndDelete', async function(camp){
    if (camp.reviews.length){
        const res = await review.deleteMany({_id: {$in: camp.reivews}});
        console.log(res);
    }
})
campgroundSchema.virtual('properties.title').get(function() {
    return this.title;
})
campgroundSchema.virtual('properties.id').get(function() {
    return this._id;
})
//export module so model can be used in other files
module.exports = mongoose.model('Campground', campgroundSchema);