var fs = require('fs');
var path = require('path');

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

// midware for movie
function savePoster(req, res, next) {
    var posterData = req.files.uploadPoster;
    var filePath = posterData.path;
    var originalFilename = posterData.originalFilename;

    if (originalFilename) {
        fs.readFile(filePath, function (err, data) {
            var timestamp = Date.now();
            var type = posterData.type.split('/')[1];
            var poster = timestamp + '.' + type;
            var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);

            fs.writeFile(newPath, data, function (err) {
                req.poster = poster;
                next();
            });
        });
    } else {
        next();
    }
}

module.exports = {
    signinRequired,
    adminRequired,
    savePoster
}
