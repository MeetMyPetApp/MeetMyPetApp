const mongoose = require('mongoose');

require('./user.model');

const matchSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String, 
        enum : ['no request yet','pending', 'accepted', 'denied'], 
        default: 'no request yet' 
    }
  },
  { timestamps: true }
);

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
