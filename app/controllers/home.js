var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Movie = mongoose.model('Movie');

module.exports = function(app) {
    app.use('/', router);
};

// index page
router.get('/', function(req, res, next) {
    res.render('page/index', {
        title: 'imooc 首页',
        movies: movies
    });
});

// detail page
router.get('/movie/:id', function(req, res, next) {
    res.render('page/detail', {
        title: 'imooc 详情页',
        movie: movie
    });
});

// admin page
router.get('/', function(req, res, next) {
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
router.get('/admin/update/:id', function(req, res, next) {
    res.render('page/admiin', {
        title: 'imooc 后台更新页',
        movie: movie
    });
});

// list page
router.get('/admin/list', function(req, res, next) {
    res.render('page/list', {
        title: 'imooc 列表页',
        movies: movies
    });
});
