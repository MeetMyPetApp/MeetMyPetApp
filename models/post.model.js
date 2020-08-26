const mongoose = require('mongoose');

require('./owner.model');
require('./post.model');
require('./like.model');
require('./comment.model');

const postSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      maxlength: 500
    },
    image: String,
    visibility: {
        type: String, 
        enum : ['private','public'], 
        default: 'public' 
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
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