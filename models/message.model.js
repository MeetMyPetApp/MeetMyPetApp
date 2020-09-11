const mongoose = require('mongoose');

require('./user.model');
require('./chat.model');

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      maxlength: 500
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    status: {
      type: String, 
      enum: ['read','unread'],
      default: 'unread'
    }
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;