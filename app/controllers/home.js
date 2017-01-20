var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Movie = mongoose.model('Movie');

module.exports = function (app) {
    app.use('/', router);
};

// index page
router.get('/', function (req, res, next) {
    Movie.find(function (err, movies) {
        if (err) throw err;

        res.render('page/index', {
            title: 'imooc 首页',
            movies: movies
        });
    });
});

// detail page
router.get('/movie/:id', function (req, res, next) {
    var id = req.params.id;

    Movie.findById(id, function (err, movie) {
        if (err) throw err;

        res.render('page/detail', {
            title: 'imooc ' + movie.title,
            movie: movie
        });
    });
});

// admin page
router.get('/admin/movie', function (req, res, next) {
    res.render('page/admin', {
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
router.get('/admin/update/:id', function (req, res, next) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('page/admin', {
                title: 'imooc 后台更新页',
                movie: movie
            });
        });
    }
});

// admin post movie
router.post('/admin/movie/new', function (req, res, next) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;

    if (id !== 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) throw err;

            _movie = _.extend(movie, movieObj);
            _movie.save(function (err, movie) {
                if (err) throw err;

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

        _movie.save(function (err, movie) {
            if (err) throw err;

            res.redirect('/movie/' + movie._id);
        });
    }
});

// list page
router.get('/admin/list', function (req, res, next) {
    Movie.fetch(function (err, movies) {
        if (err) throw err;

        res.render('page/list', {
            title: 'imooc 列表页',
            movies: movies
        });
    });
})

// list delete movie
router.delete('/admin/list', function (req, res, next) {
    var id = req.query.id;

    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) throw err;

            res.json({success: 1});
        });
    }
})
