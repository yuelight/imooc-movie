var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Movie = mongoose.model('Movie'),
    Comment = mongoose.model('Comment'),
    Category = mongoose.model('Category');

module.exports = function(app) {
    app.use('/', router);
};

// index page
router.get('/', function(req, res, next) {
    Category
        .find({})
        .populate({path: 'movies', options: {limit: 5}})
        .exec(function (err, categories) {
            if (err)
                throw err;

            res.render('pages/index', {
                title: 'imooc 首页',
                categories: categories
            });
        });
});

// show signup
router.get('/signup', function (req, res, next) {
    res.render('pages/signup', {title: '注册页面'});
});

// show signin
router.get('/signin', function (req, res, next) {
    res.render('pages/signin', {title: '登录页面'});
});

// logout
router.get('/logout', function(req, res, next) {
    delete req.session.user;

    res.redirect('/');
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
