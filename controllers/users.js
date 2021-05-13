const User = require('../models/newUser');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res) => {
    try {
        const {
            email,
            username,
            password
        } = req.body;
        const user = new User({
            username,
            email
        });
        const regUser = await User.register(user, password);
        req.login(regUser, err => {
            if (err) return next();
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        })

    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('/register');
    }
}

module.exports.login = (req, res) => {
    const redirectTo = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    req.flash('success', 'Welcome back!');
    res.redirect(redirectTo);
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.logout = (req, res) => {
    req.logOut();
    req.flash('success', 'GoodBye');
    res.redirect('/campgrounds');
}