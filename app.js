//express
const express = require('express');
const app = express();
require('dotenv').config();
const authRoutes = require('./src/routes/authRoutes');
const paletteRoutes = require('./src/routes/paletteRoutes');
const errorRoutes = require('./src/routes/404Routes');

//session
const session = require('express-session');

//DB imports
const mongoose = require('mongoose');

//Middleware imports
const cookieParser = require('cookie-parser');

//DB connection and starting server
const dbURI = process.env.MONGODB_CONNECT_URL;
mongoose.connect(dbURI)
.then((result) => {
    app.listen(process.env.PORT || 3000);
})
.catch((error) => {
    console.error('Error:', error);
});

//view engine
app.set('view engine', 'ejs');
const path = require('path');
const req = require('express/lib/request');
app.set('views', 'src/views');

//middleware
app.use(express.static('src/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false}));

//ROUTERS

//AUTH
app.use(authRoutes);

//USER MAIN PAGE
app.use(paletteRoutes);

//CSRF ERROR
app.use(function (err, req, res, next) {
    if (err.code == 'EBADCSRFTOKEN') {
        console.log(err);
        res.status(403)
        res.redirect('error-message');
    }
});

//ERROR
app.use(errorRoutes);