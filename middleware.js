const {
    campgroundSchema,
    reviewSchema
} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('Danger', 'Must be signed in');
        res.redirect('/login');
    } else {
        next()
    }
}


module.exports.validateCamp = (req, res, next) => {
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

module.exports.validateReview = (req, res, next) => {
    const {
        error
    } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


module.exports.isUploader = async (req, res, next) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.uploader.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


module.exports.isReviewUploader = async (req, res, next) => {
    const {
        id,
        reviewId
    } = req.params;
    const review = await Review.findByIdAndUpdate(reviewId);
    if (!review.uploader.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}