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

// search
router.get('/results', function (req, res, next) {
    var catId = req.query.cat;
    var page = parseInt(req.query.p, 10) || 0;
    var q = req.query.q;
    var count = 2;
    var index = page * count;

    if (catId) {
        Category.find({_id: catId}).populate({
            path: 'movies',
            select: 'title poster'
        }).exec(function(err, categories) {
            if (err)
            throw err;

            var category = categories[0] || {};
            var movies = category.movies || {};
            var results = movies.slice(index, index + count);

            res.render('pages/result', {
                title: 'imooc 结果列表页',
                keyword: category.name,
                currentPage: (page + 1),
                query: 'cat=' + catId,
                totalPage: Math.ceil(movies.length / count),
                movies: results
            });
        });
    } else {
        Movie
            .find({title: new RegExp(q + '.*', 'i')})
            .exec(function (err, movies) {
                if (err)
                throw err;

                var results = movies.slice(index, index + count);

                res.render('pages/result', {
                    title: 'imooc 结果列表页',
                    keyword: q,
                    currentPage: (page + 1),
                    query: 'q=' + q,
                    totalPage: Math.ceil(movies.length / count),
                    movies: results
                });
            });
    }
});
