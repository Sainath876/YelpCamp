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
const {
    storage
} = require('../cloudinary');
const multer = require('multer');
const upload = multer({
    storage
})


router.route('/')
    .get(catchAsync(campgrounds.campgroundIndex))
    .post(isLoggedIn, upload.array('image'), validateCamp, catchAsync(campgrounds.postNewCamp))
// .post(upload.single('image'), (req, res) => {
//     res.send('It somehow worked');
// })

router.get('/new', isLoggedIn, campgrounds.renderNewCamp)

router.get('/:id/edit', isLoggedIn, isUploader, catchAsync(campgrounds.editCamp))

router.route('/:id')
    .get(catchAsync(campgrounds.showCamp))
    .put(isLoggedIn, isUploader, upload.array('image'), validateCamp, catchAsync(campgrounds.updateCamp))
    .delete(isLoggedIn, isUploader, catchAsync(campgrounds.deleteCamp))

module.exports = router;