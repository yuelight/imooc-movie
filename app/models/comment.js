var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

// 数据模型
var CommentSchema = new Schema({
    movie: {
        type: ObjectId,
        ref: 'Movie'
    },
    from: {
        type: ObjectId,
        ref: 'User'
    },
    reply: [
        {
            from: {
                type: ObjectId,
                ref: 'User'
            },
            to: {
                type: ObjectId,
                ref: 'User'
            },
            content: String
        }
    ],
    to: {
        type: ObjectId,
        ref: 'User'
    },
    content: String,
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
CommentSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }

    // 调用next将存储流程走下去
    next();
});

CommentSchema.statics = {
    fetch: function(cb) {
        return this.find({}).sort('meta.updateAt').exec(cb);
    },
    findById: function(id, cb) {
        return this.findOne({_id: id}).exec(cb);
    }
};

mongoose.model('Comment', CommentSchema);
