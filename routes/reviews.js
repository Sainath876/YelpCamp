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
const {
    validateReview,
    isLoggedIn,
    isReviewUploader
} = require('../middleware');


router.post('/', validateReview, isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = await new Review(req.body.review);
    review.uploader = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewUploader, catchAsync(async (req, res) => {
    const {
        id,
        reviewId
    } = req.params;
    await Campground.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;