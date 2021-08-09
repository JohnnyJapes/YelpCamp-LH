const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

//set views directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//set up parsing for data types
//app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
//app.use(express.json()) // for parsing application/json
//set up method override so we can use PATCH, PUT, DELETE routes
app.use(methodOverride('_method'));

//connect mongoose, basic error handling
mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(function(){
    console.log("Mongo Connection open")
})
.catch(err => {
    console.log("Mongo error");
    console.log(err);
  });


app.listen(3000, () =>{
    console.log('Listening on Port 3000') 
});