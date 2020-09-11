const mongoose = require('mongoose');

require('./user.model');
const Post = require('./post.model');

const matchSchema = new mongoose.Schema(
  {
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    status: {
      type: String, 
      enum : ['pending', 'accepted', 'denied'], 
      default: 'pending' 
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  { timestamps: true }
);

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
