var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Movie = mongoose.model('Movie'),
    User = mongoose.model('User'),
    Category = mongoose.model('Category'),
    _ = require('underscore'),
    midware = require('../../public/js/midware');

module.exports = function(app) {
    app.use('/admin', router);
};

// userlist page
router.get('/user/list', function(req, res, next) {
    User.fetch(function(err, users) {
        if (err)
            throw err;

        res.render('pages/userlist', {
            title: 'imooc 用户列表页',
            users: users
        });
    })
});

// admin page
router.get('/movie/new', midware.signinRequired, midware.adminRequired, function(req, res, next) {
    Category.find({}, function(err, categories) {
        res.render('pages/admin', {
            title: 'imooc 后台录入页',
            categories: categories,
            movie: {}
        });
    });
});

// admin update movie
router.get('/movie/update/:id', midware.signinRequired, midware.adminRequired, function(req, res, next) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function(err, movie) {
            Category.find({}, function(err, categories) {
                res.render('pages/admin', {
                    title: 'imooc 后台更新页',
                    movie: movie,
                    categories: categories
                });
            });
        });
    }
});

// admin post movie
router.post('/movie', midware.signinRequired, midware.adminRequired, midware.savePoster, function(req, res, next) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if (req.poster) {
        movieObj.poster = req.poster;
    }

    if (id) {
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
        _movie = new Movie(movieObj);
        var categoryId = movieObj.category;
        var categoryName = movieObj.categoryName;

        _movie.save(function(err, movie) {
            if (err)
                throw err;

            if (categoryId) {
                Category.findById(categoryId, function(err, category) {
                    category.movies.push(movie._id);

                    category.save(function(err) {
                        res.redirect('/movie/' + movie._id);
                    });
                });
            } else if(categoryName) {
                var category = new Category({
                    name: categoryName,
                    movies: [movie._id]
                });

                category.save(function(err) {
                    movie.category = _movie._id;
                    movie.save(function(err) {
                        res.redirect('/movie/' + movie._id);
                    });
                });
            }
        });
    }
});

// list page
router.get('/movie/list', midware.signinRequired, midware.adminRequired, function(req, res, next) {
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
router.delete('/movie/list', midware.signinRequired, midware.adminRequired, function(req, res, next) {
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

// admin page
router.get('/category/new', midware.signinRequired, midware.adminRequired, function (req, res, next) {
    res.render('pages/category_admin', {
        title: 'imooc 后台分类页',
        category: {}
    });
});

// admin post category
router.post('/category', midware.signinRequired, midware.adminRequired, function (req, res, next) {
    var _category = req.body.category;
    var category = new Category(_category);

    category.save(function(err, category) {
        if (err)
        throw err;

        res.redirect('/admin/category/list');
    });
});

// categorylist page
router.get('/category/list', midware.signinRequired, midware.adminRequired, function (req, res, next) {
    Category.fetch(function(err, categories) {
        if (err)
            throw err;

        res.render('pages/categorylist', {
            title: 'imooc 分类列表页',
            categories: categories
        });
    });
});
