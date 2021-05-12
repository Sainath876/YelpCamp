const express = require('express');
const router = express.Router();
const user = require('../models/newUser');

router.get('/register', (req, res) => {
    res.render('campground/register');
})

router.post('/register', (req, res) => {
    res.send(req.body);
})

module.exports = router;