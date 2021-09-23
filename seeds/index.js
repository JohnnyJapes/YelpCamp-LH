//requirements
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
//create model using campground schema
const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({accessToken:process.env.MAPBOX_TOKEN})

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
    for (let i = 0; i < 400; i++) {
        const random1000 = Math.floor(Math.random()*1000 +1);
        const random100 = parseFloat((Math.random()*99 +1).toFixed(2));
        const temp = new Campground({
            title:`${descriptors[Math.floor(Math.random()*descriptors.length)]} ${
                places[Math.floor(Math.random()*places.length)]}`,
            location: {city:cities[random1000].city, state:cities[random1000].state}, 
            geometry: {type:"Point", coordinates: [cities[random1000].longitude, cities[random1000].latitude]},
            image: [{url: "https://res.cloudinary.com/dxmydkp0v/image/upload/v1631294769/YelpCamp/bzlbo6t96d7je4evom4k.jpg", filename:"YelpCamp/bzlbo6t96d7je4evom4k.jpg"},
                    {url:"https://res.cloudinary.com/dxmydkp0v/image/upload/v1631562810/YelpCamp/ioegbjwcjvs1vdqz91eh.png", filename:"YelpCamp/ioegbjwcjvs1vdqz91eh.png"}
                    ],
            description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus, ullam? Sapiente temporibus ea debitis enim autem blanditiis at, beatae neque rem distinctio harum adipisci placeat facere repellendus mollitia eos. Nobis?",
            price: random100,
            author: '613fb47f92f9253a15833a6d'});
        await temp.save();    
    }
};
//run to seed fake data
seedDB().then(function(){
    mongoose.connection.close();
});