const mongoose = require('mongoose');

require('./message.model');

const chatSchema = new mongoose.Schema(
    {
        members: [ owner._id, owner._id ],
    },
    { timestamps: true }
);

postSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'chat',
    justOne: false,
});


const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;