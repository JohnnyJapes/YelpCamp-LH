//require mongoose for schema usage
const mongoose = require('mongoose');
//shortcut so I don't have to type mongoose.Schema everytime
const Schema = mongoose.Schema;


const reviewSchema = new Schema({

    body: {
        type: String   
    },
    rating: {
        type: Number
    }
})

module.exports = mongoose.model('Review', reviewSchema);