var mongoose = require('mongoose');
    Schema = mongoose.Schema;
    bcrypt = require('bcrypt');

var SALT_WORK_FACTOR = 10;

// 数据模型
var UserSchema = new Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

// 保存前执行的相关逻辑
UserSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(this.password, salt, function(err, hash) {
            if (err) return next(err);

            this.password = hash;
            next();
        });
    });
    next();
});

UserSchema.statics = {
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function(id, cb) {
        return this
            .findOne({
                _id: id
            })
            .exec(cb);
    }
};

mongoose.model('User', UserSchema);
