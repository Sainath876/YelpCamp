const express = require('express');
const app = express();
const path = require('path');
const {
    campgroundSchema
} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const {
    urlencoded
} = require('express');
const {
    findById
} = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database Connected');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);

app.use(methodOverride('_method'));
app.use(urlencoded({
    extended: true
}));

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

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index', {
        campgrounds
    });
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campground/new');
})

app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campground/edit', {
        campground
    });
}))

app.post('/campgrounds', validateCamp, catchAsync(async (req, res) => {
    const campground = await new Campground(req.body.campground);
    await campground.save();
    res.redirect('/campgrounds');
}))

app.put('/campgrounds/:id', validateCamp, catchAsync(async (req, res, next) => {
    const {
        id
    } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    });
    res.redirect(`/campgrounds/${id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campground/show', {
        campground
    });
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    const {
        statusCode = 500
    } = err;
    if (!err.message) err.message = "Something went wrong";
    res.render('error', {
        err
    });
})

app.listen(3000, () => {
    console.log("Connected to server port 3000");
});