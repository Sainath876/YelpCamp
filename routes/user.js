const express = require('express');
const router = express.Router();
const User = require('../models/newUser');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const {
            email,
            username,
            password
        } = req.body;
        const user = new User({
            username,
            email
        });
        const regUser = await User.register(user, password);
        req.login(regUser, err => {
            if (err) return next();
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        })

    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), (req, res) => {
    const redirectTo = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    req.flash('success', 'Welcome back!');
    res.redirect(redirectTo);
})

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'GoodBye');
    res.redirect('/campgrounds');
})

module.exports = router;