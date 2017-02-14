// midware for user
function signinRequired(req, res, next) {
    var user = req.session.user;

    if (!user) {
        return res.redirect('/signin');
    }

    next();
}

// midware for admin
function adminRequired(req, res, next) {
    var user = req.session.user;

    if (user.role <= 10) {
        return res.redirect('/signin');
    }

    next();
}

module.exports = {
    signinRequired,
    adminRequired
}
