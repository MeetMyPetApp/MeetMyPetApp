const mongoose = require('mongoose');

require('./user.model');

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    breed: {
        type: String,
        lowercase: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    available: Boolean //available for match
  },
  { timestamps: true }
);

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;