var path = require('path'),
        rootPath = path.normalize(__dirname + '/..'),
        env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        root: rootPath,
        app: {
            name: 'imooc-movie'
        },
        port: process.env.PORT || 3000,
        db: 'mongodb://localhost/imooc-movie'
    },

    test: {
        root: rootPath,
        app: {
            name: 'imooc-movie'
        },
        port: process.env.PORT || 3000,
        db: 'mongodb://localhost/imooc-movie-test'
    },

    production: {
        root: rootPath,
        app: {
            name: 'imooc-movie'
        },
        port: process.env.PORT || 3000,
        db: 'mongodb://localhost/imooc-movie-production'
    }
};

module.exports = config[env];
