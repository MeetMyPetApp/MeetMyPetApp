const mongoose = require('mongoose');

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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
    },
    available: Boolean //available for match
  },
  { timestamps: true }
);

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;