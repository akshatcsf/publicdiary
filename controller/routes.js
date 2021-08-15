const express = require('express');
const users = require('../model/user.js');
const router = express.Router();
var bcrypt = require('bcryptjs')
const passport = require("passport");
require('./passportLocal')(passport);

router.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.set(
            "cache-Control",
            "no-cache,private,no-store,must-revalidate,post-check=0,pre-check=0"
        );
        res.render("index", { logged: true });
    } else {
        res.render("index");
    }
});

router.get("/signup", (req, res) => {
    res.render('signup', { csrfToken: req.csrfToken() });
});
router.get("/login", (req, res) => {
    res.render('login', { csrfToken: req.csrfToken() });
});
router.get("/profile", (req, res) => {
    res.render('profile');
});

router.post('/signup', async (req, res) => {
    const { email, username, password, confirmpassword } = req.body;

    if (!email || !username || !password || !confirmpassword) {
        res.render("signup", { csrfToken: req.csrfToken(), err: "All fields required!!" });
    }
    else if (password != confirmpassword) {
        res.render('signup', {
            csrfToken: req.csrfToken(),
            err: "Passwords Should Match !!",
        });
    }
    else {
        var userData = await users.findOne({ $or: [{ email: email }, { username: username }] });
        if (userData) {
            res.render("signup", { csrfToken: req.csrfToken(), err: "User Already Exist!!" });
        }
        else {
            var salt = await bcrypt.genSalt(12);
            var hash = await bcrypt.hash(password, salt);

            await users({
                email: email,
                username: username,
                password: hash
            }).save();

            res.redirect('/login');
        }
    }

});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: "/unshared",
        failureFlash: true,
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logOut();
    req.session.destroy((err) => {
        res.redirect("/");
    })
})
//for unshared page
router.use("/unshared", require("./unsharedRoutes"));

module.exports = router;