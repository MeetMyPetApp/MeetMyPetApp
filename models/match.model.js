const mongoose = require('mongoose');

require('./owner.model');

const matchSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
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

const Match = mongoose.model('Like', matchSchema);

module.exports = Match;
