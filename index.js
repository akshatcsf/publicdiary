const express = require('express');
const mongoURI = require("./config/mongoURI");
const mongoose = require('mongoose');
const router = require("./controller/routes");
const cookieParser = require('cookie-parser');
const expressSession = require("express-session")
const csruf = require('csurf');
const passport = require('passport');
const flash = require('connect-flash');
const app = express();
const path = require('path');

mongoose.connect(
    mongoURI,
    {
        useNewUrlParser: true, useUnifiedTopology: true,
        useFindAndModify: true, useCreateIndex: true
    }).then(() => {
        console.log('connected !!');
    }).catch((err) => {
        console.log('something wrong' + err);
    });


app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname + '/static'));

app.set("view engine", "ejs");
app.set("views", __dirname + '/views');

app.use(cookieParser("randomKey"));

app.use(
    expressSession({
        secret: "randomKey",
        resave: true,
        saveUninitialized: true,
        maxAge: 24 * 60 * 60 * 1000,
    })
);
app.use(express.static('public'));
app.use(csruf());
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    next();
});
app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`started server at ${PORT}`);
})