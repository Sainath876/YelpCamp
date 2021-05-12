const express = require('express');
const app = express();
const path = require('path');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/newUser');
const {
    urlencoded
} = require('express');
// const {
//     campgroundSchema,
//     reviewSchema
// } = require('./schemas.js');
// const Campground = require('./models/campground');
// const Review = require('./models/review');


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

const userRoutes = require('./routes/user');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.engine('ejs', ejsMate);


app.use(urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


const sessionConfig = {
    secret: 'Thisshouldbeasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 60 * 60 * 24 * 7 * 100,
        maxAge: 60 * 60 * 24 * 7 * 100
    }
}
app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.flashNew = req.flash('success');
    res.locals.flashDelete = req.flash('Danger');
    res.locals.flashUpdate = req.flash('info');
    res.locals.flashError = req.flash('error');
    next();
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);


app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

app.use((err, req, res, next) => {
    if (!err.message) err.message = "Something went wrong";
    res.render('error', {
        err
    });
})

app.listen(3000, () => {
    console.log("Connected to server port 3000");
});