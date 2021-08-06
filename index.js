const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const Product = require('./models/product');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json
app.use(methodOverride('_method'));


app.listen(3000, () =>{
    console.log('Listening on Port 3000') 
});