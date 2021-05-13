const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campground');

const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {
    isLoggedIn,
    validateCamp,
    isUploader
} = require('../middleware');


router.route('/')
    .get(catchAsync(campgrounds.campgroundIndex))
    .post(isLoggedIn, validateCamp, catchAsync(campgrounds.postNewCamp))

router.get('/new', isLoggedIn, campgrounds.renderNewCamp)

router.get('/:id/edit', isLoggedIn, isUploader, catchAsync(campgrounds.editCamp))

router.route('/:id')
    .get(catchAsync(campgrounds.showCamp))
    .put(isLoggedIn, validateCamp, isUploader, catchAsync(campgrounds.updateCamp))
    .delete(isLoggedIn, isUploader, catchAsync(campgrounds.deleteCamp))

module.exports = router;