const mongoose = require('mongoose');

require('./user.model');
require('./post.model');

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      maxlength: 600
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
