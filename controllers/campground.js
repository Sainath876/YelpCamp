const Campground = require('../models/campground');
const {
    cloudinary
} = require('../cloudinary');

module.exports.campgroundIndex = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', {
        campgrounds
    });
};

module.exports.renderNewCamp = (req, res) => {
    res.render('campground/new');
};

module.exports.editCamp = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'There is no such Campground');
        res.redirect('/campgrounds');
    }
    res.render('campground/edit', {
        campground
    });
};

module.exports.postNewCamp = async (req, res) => {
    const campground = await new Campground(req.body.campground);
    campground.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))
    campground.uploader = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new Camp');
    res.redirect('/campgrounds');
};

module.exports.updateCamp = async (req, res, next) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    });
    const imgs = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }));
    campground.images.push(...imgs);
    campground.save();
    if (req.body.deleteimgs) {
        for (let filename of req.body.deleteimgs) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({
            $pull: {
                images: {
                    filename: {
                        $in: req.body.deleteimgs
                    }
                }
            }
        })
    }
    req.flash('info', 'Updated a Camp');
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.deleteCamp = async (req, res) => {
    const {
        id
    } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('Danger', 'Deleted a Camp');
    res.redirect('/campgrounds');
};

module.exports.showCamp = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'uploader'
        }
    }).populate('uploader');
    if (!campground) {
        req.flash('error', 'There is no such Campground');
        res.redirect('/campgrounds');
    }
    res.render('campground/show', {
        campground
    });
};