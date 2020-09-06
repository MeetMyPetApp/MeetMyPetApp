const mongoose = require('mongoose');

require('./user.model');
const Like = require('./like.model');
const Comment = require('./comment.model');

const postSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      maxlength: 1000
    },
    image: String,
    visibility: {
        type: String, 
        enum : ['private','public'], 
        default: 'public' 
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  { timestamps: true }
);

postSchema.virtual('likes', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'post',
    justOne: false,
});

postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    justOne: false,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;