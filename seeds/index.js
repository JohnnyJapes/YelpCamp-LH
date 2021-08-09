//requirements
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
//create model using campground schema
const Campground = require('../models/campground');

//connect mongoose, basic error handling, useCreateIndex:true to avoid deprecation warnings from MongoDB
//local host and single DB for now
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(function(){
        console.log("Mongo Connection open")
    })
    .catch(err => {
    console.log("Mongo connection error");
    console.log(err);
});

//listener fuction to catch errors on connection
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

const seedDB = async () => {
    //empty Database
    await Campground.deleteMany({})
    .catch( err => {
        console.log(err);
    });
    //loop to seed fake data
    for (let i = 0; i < 60; i++) {
        const random1000 = Math.floor(Math.random()*1000 +1);
        const temp = new Campground({
            title:`${descriptors[Math.floor(Math.random()*descriptors.length)]} ${
                places[Math.floor(Math.random()*places.length)]}`,
            location:`${cities[random1000].city}, ${cities[random1000].state}`});
        await temp.save();    
    }
};
//run to seed fake data
seedDB().then(function(){
    mongoose.connection.close();
});