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

// link to MariaDB
const { createPool } = require('mysql2/promise');
// create a connection pool
const connection = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

app.get('/', function(req, res) {
    const todayDate = new Date().toLocaleDateString("en-GB");
    res.render('home', {
        "todayDate": todayDate
    });
});

app.listen(3000, function() {
    console.log('Server started.');
});
