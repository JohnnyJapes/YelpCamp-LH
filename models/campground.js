//require mongoose for schema usage
const mongoose = require('mongoose');
//shortcut so I don't have to type mongoose.Schema everytime
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({

    title:{
        type: String,
    },
    price:{
        type: Number,
        min: 0,
        required: true
    },
    description:{
        type: String  
    },
    location:{
        city: String,
        state: String
    },
    image:{
        type: String
    }
    /* score:{
        type: Number
    },
    state:{
        type: String
    },
    city:{
        type: String
    },
    reviews:{
        type: Number
    } */
    

});
//export module so model can be used in other files
module.exports = mongoose.model('Campground', campgroundSchema);