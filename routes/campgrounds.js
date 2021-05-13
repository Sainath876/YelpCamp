const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {
    isLoggedIn,
    validateCamp,
    isUploader
} = require('../middleware');


router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', {
        campgrounds
    });
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campground/new');
})

router.get('/:id/edit', isLoggedIn, isUploader, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'There is no such Campground');
        res.redirect('/campgrounds');
    }
    res.render('campground/edit', {
        campground
    });
}))

router.post('/', isLoggedIn, validateCamp, catchAsync(async (req, res) => {
    const campground = await new Campground(req.body.campground);
    campground.uploader = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new Camp');
    res.redirect('/campgrounds');
}))

router.put('/:id', isLoggedIn, validateCamp, isUploader, catchAsync(async (req, res, next) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    });
    req.flash('info', 'Updated a Camp');
    res.redirect(`/campgrounds/${campground.id}`);
}))

router.delete('/:id', isLoggedIn, isUploader, catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('Danger', 'Deleted a Camp');
    res.redirect('/campgrounds');
}))

router.get('/:id', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'uploader'
        }
    }).populate('uploader');
    console.log(campground);
    if (!campground) {
        req.flash('error', 'There is no such Campground');
        res.redirect('/campgrounds');
    }
    res.render('campground/show', {
        campground
    });
}));

module.exports = router;