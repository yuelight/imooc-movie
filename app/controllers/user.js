var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Comment = mongoose.model('Comment'),
    midware = require('../../public/js/midware');

module.exports = function(app) {
    app.use('/user', router);
};

// signup
router.post('/signup', function(req, res, next) {
    var _user = req.body.user;

    User.findOne({
        name: _user.name
    }, function(err, user) {
        if (err)
            throw err;

        if (user)
            return res.redirect('/');
        else {
            user = new User(_user);

            user.save(function(err, user) {
                if (err)
                    throw err;

                res.redirect('/');
            });
        }
    });
});

// signin
router.post('/signin', function(req, res, next) {
    var _user = req.body.user;
    var name = _user.name;
    var password = _user.password;

    User.findOne({
        name: name
    }, function(err, user) {
        if (err)
            throw err;

        if (!user)
            return res.redirect('/signup');

        user.comparePassword(password, function(err, isMatch) {
            if (err)
                throw err;

            if (isMatch) {
                req.session.user = user;
                return res.redirect('/');
            } else {
                return res.redirect('/signin');
                console.log('Password is not matched');
            }
        });
    });
});

// comment save
router.post('/comment', midware.signinRequired, function(req, res, next) {
    var _comment = req.body.comment;
    var movieId = _comment.movie;

    if (_comment.cid) {
        Comment.findById(_comment.cid, function(err, comment) {
            var reply = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content
            }

            comment.reply.push(reply);

            comment.save(function(err, data) {
                if (err)
                    throw err;

                res.redirect('/movie/' + movieId);
            })
        });
    } else {
        var comment = new Comment(_comment);

        comment.save(function(err, comment) {
            if (err)
                throw err;

            res.redirect('/movie/' + movieId);
        });
    }
});
