const mongoose = require('mongoose');

require('./message.model');
require('./chat.model');
require('./user.model');

const chatSchema = new mongoose.Schema(
    {
        members: [ 
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            }
        ]
    },
    { timestamps: true }
);

chatSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'chat',
    justOne: false,
});


const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;