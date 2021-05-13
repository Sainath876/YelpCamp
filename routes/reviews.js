const express = require('express');
const router = express.Router({
    mergeParams: true
});
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {
    reviewSchema
} = require('../schemas.js');
const Review = require('../models/review');
const review = require('../controllers/reviews');
const {
    validateReview,
    isLoggedIn,
    isReviewUploader
} = require('../middleware');


router.post('/', validateReview, isLoggedIn, catchAsync(review.newReview))

router.delete('/:reviewId', isLoggedIn, isReviewUploader, catchAsync(review.deleteReview))

module.exports = router;