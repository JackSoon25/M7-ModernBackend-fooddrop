const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const app = express();
app.use(expressLayouts);
// enable form submission via browser. Adopt extended:ture, to call qs library which support Nested Data 
app.use(express.urlencoded({ extended: true }));
// tell Express that EJS is adopted here
app.set('view engine', 'ejs');
// tell EJS which layout to see
app.set('layout', 'layout/base');

// rename router
const { router: cuisineRouter } = require('./cuisineRouter');
const { router: userRouter } = require('./userRouter');

// link to MariaDB via db.js
const {connection} = require('./db');
// call different routers for vendors, users, offers, and cuisines
// app.use('/vendor', vendorRouter);
app.use('/user', userRouter);
// app.use('/offer', offerRouter);
app.use('/cuisine', cuisineRouter);




// Home route
app.get('/', function(req, res) {
    const todayDate = new Date().toLocaleDateString("en-GB");
    res.render('home', {
        "todayDate": todayDate
    });
});

app.listen(3000, function() {
    console.log('Server started.');
});
