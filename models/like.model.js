const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { timestamps: true }
);

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
