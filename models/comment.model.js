const mongoose = require('mongoose');

require('./owner.model');
require('./post.model');

const commentSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      maxlength: 300
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

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
