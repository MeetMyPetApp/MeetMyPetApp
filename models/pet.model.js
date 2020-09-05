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
    avatar: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gallery: [String],
    bio: {
      type: String,
      maxlength: 600
    },
    available: {
      type: String, 
      enum: ['Available','Not available'],
      default: 'Not available'
    }
  },
  { timestamps: true }
);

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;