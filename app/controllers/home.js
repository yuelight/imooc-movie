var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Movie = mongoose.model('Movie'),
    User = mongoose.model('User'),
    Comment = mongoose.model('Comment');

module.exports = function(app) {
    app.use('/', router);
};

// index page
router.get('/', function(req, res, next) {
    console.log(req.session.user);

    Movie.find(function(err, movies) {
        if (err)
            throw err;

        res.render('pages/index', {
            title: 'imooc 首页',
            movies: movies
        });
    });
});

// signup
router.post('/user/signup', function(req, res, next) {
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

// show signup
router.get('/signup', function showSignup(req, res, next) {
    res.render('pages/signup', {title: '注册页面'});
});

// signin
router.post('/user/signin', function(req, res, next) {
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

// show signin
router.get('/signin', function showSignin(req, res, next) {
    res.render('pages/signin', {title: '登录页面'});
});

// logout
router.get('/logout', function(req, res, next) {
    delete req.session.user;

    res.redirect('/');
});

// userlist page
router.get('/admin/user/list', function(req, res, next) {
    User.fetch(function(err, users) {
        if (err)
            throw err;

        res.render('pages/userlist', {
            title: 'imooc 用户列表页',
            users: users
        });
    })
});

// detail page
router.get('/movie/:id', function(req, res, next) {
    var id = req.params.id;

    Movie.findById(id, function(err, movie) {
        if (err)
            throw err;

        Comment
            .find({movie: id})
            .populate('from', 'name')
            .populate('reply.from reply.to', 'name')
            .exec(function (err, comments) {
                res.render('pages/detail', {
                    title: 'imooc ' + movie.title,
                    movie: movie,
                    comments: comments
                });
            })
    });
});

// admin page
router.get('/admin/movie/new', signinRequired, adminRequired, function(req, res, next) {
    res.render('pages/admin', {
        title: 'imooc 后台录入页',
        movie: {
            title: '',
            doctor: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    });
});

// admin update movie
router.get('/admin/movie/update/:id', signinRequired, adminRequired, function(req, res, next) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function(err, movie) {
            res.render('pages/admin', {
                title: 'imooc 后台更新页',
                movie: movie
            });
        });
    }
});

// admin post movie
router.post('/admin/movie', signinRequired, adminRequired, function(req, res, next) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if (id !== 'undefined') {
        Movie.findById(id, function(err, movie) {
            if (err)
                throw err;

            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if (err)
                    throw err;

                res.redirect('/movie/' + movie._id);
            });
        })
    } else {
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });

        _movie.save(function(err, movie) {
            if (err)
                throw err;

            res.redirect('/movie/' + movie._id);
        });
    }
});

// list page
router.get('/admin/movie/list', signinRequired, adminRequired, function(req, res, next) {
    Movie.fetch(function(err, movies) {
        if (err)
            throw err;

        res.render('pages/list', {
            title: 'imooc 列表页',
            movies: movies
        });
    });
});

// list delete movie
router.delete('/admin/movie/list', signinRequired, adminRequired, function(req, res, next) {
    var id = req.query.id;

    if (id) {
        Movie.remove({
            _id: id
        }, function(err, movie) {
            if (err)
                throw err;

            res.json({success: 1});
        });
    }
});

router.post('/user/comment', signinRequired, function(req, res, next) {
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

// midware for user
function signinRequired(req, res, next) {
    var user = req.session.user;

    if (!user) {
        return res.redirect('/signin');
    }

    next();
}

function adminRequired(req, res, next) {
    var user = req.session.user;

    if (user.role <= 10) {
        return res.redirect('/signin');
    }

    next();
}
