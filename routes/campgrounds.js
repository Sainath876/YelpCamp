const express = require('express');
const router = express.Router();
const {
    campgroundSchema
} = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');

const validateCamp = (req, res, next) => {
    const {
        error
    } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', {
        campgrounds
    });
}))

router.get('/new', (req, res) => {
    res.render('campground/new');
})

router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campground/edit', {
        campground
    });
}))

router.post('/', validateCamp, catchAsync(async (req, res) => {
    const campground = await new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new Camp');
    res.redirect('/campgrounds');
}))

router.put('/:id', validateCamp, catchAsync(async (req, res, next) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    });
    req.flash('info', 'Updated a Camp');
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('Danger', 'Deleted a Camp');
    res.redirect('/campgrounds');
}))

router.get('/:id', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'There is no such Campground');
        res.redirect('/campgrounds');
    }
    res.render('campground/show', {
        campground
    });
}));

module.exports = router;