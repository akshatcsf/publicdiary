const express = require('express');
const router = express.Router();

const unshared = require('../model/unshared');
var moment = require('moment');

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.set(
            "cache-Control",
            "no-cache,private,no-store,must-revalidate,post-check=0,pre-check=0"
        );
        next();
    }
    else {
        res.redirect("/login");
    }
}

router.get("/", checkAuth, (req, res) => {
    unshared.find({ email: req.user.email }, (err, data) => {
        if (err) throw err;
        if (data) {
            res.render('unshared', { csrfToken: req.csrfToken(), data: data, moment: moment });
        }
    });
});
router.post('/add', checkAuth, (req, res) => {
    const { title, description } = req.body;
    //add to db
    unshared({
        email: req.user.email,
        title: title,
        description: description,
    }).save((err, data) => {
        res.redirect("/unshared");
    });
});
module.exports = router;