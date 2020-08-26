const mongoose = require('mongoose');

require('./owner.model');
require('./chat.model');

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      maxlength: 400
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    }
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;