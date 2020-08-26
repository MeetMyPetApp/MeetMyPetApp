const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

require('./pet.model');
require('./chat.model');
require('./match.model');

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const generateRandomToken = () => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 25; i++) {
    token += characters[Math.floor(Math.random() * characters.length)];
  }
  return token;
}

const ownerSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name needs at least 2 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_PATTERN, "Email is invalid"],
    },
    ownername: {
      type: String,
      required: [true, "ownername is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
      minlength: [8, "password min length is 8"]
    },
    status: {
      type: String, 
      enum : ['Pet looking for pet','Owner looking for friends', 'Owner looking for soulmate', 'Owner expanding network', 'Hey, I am using MeetMyPet'], 
      default: 'Hey, I am using MeetMyPet' 
    },
    bio: {
      type: String,
      maxlength: 300
    },
    activation: {
      active: {
        type: Boolean,
        default: false
      },
      token: {
        type: String,
        default: generateRandomToken
      }
    },
    social: {
      slack: String,
      google: String
    },
    googleID: String
  },
  { timestamps: true }
);

ownerSchema.virtual('pets', {
  ref: 'Pet',
  localField: '_id',
  foreignField: 'owner',
  justOne: false,
});

ownerSchema.virtual('chats', {
  ref: 'Chat',
  localField: '_id',
  foreignField: 'sender',
  justOne: false,
});

ownerSchema.virtual('matches', {
  ref: 'Match',
  localField: '_id',
  foreignField: 'sender',
  justOne: false,
});

ownerSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 10).then((hash) => {
      this.password = hash;
      next();
    });
  } else {
    next();
  }
})

ownerSchema.post('remove', function (next) {
  Promise.all([
    Project.deleteMany({ author: this._id }),
    Like.deleteMany({ user: this._id }),
    Comment.deleteMany({ user: this._id })
  ])
    .then(next)
})

ownerSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
}

const Owner = mongoose.model("Owner", ownerSchema);

module.exports = Owner;
