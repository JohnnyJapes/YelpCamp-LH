//require mongoose for schema usage
const mongoose = require('mongoose');
//shortcut so I don't have to type mongoose.Schema everytime
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({

    title:{
        type: String,
    },
    price:{
        type: Number
    },
    description:{
        type: String  
    },
    location:{
        type: String
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