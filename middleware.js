module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('Danger', 'Must be signed in');
        res.redirect('/login');
    } else {
        next()
    }
}