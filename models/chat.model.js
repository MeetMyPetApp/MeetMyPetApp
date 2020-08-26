const mongoose = require('mongoose');

require('./message.model');
require('./chat.model');

const chatSchema = new mongoose.Schema(
    {
        members: [ 
            {
                owner: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Owner',
                    required: true,
                }
            },
            {
                owner: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Owner',
                    required: true,
                }
            }
        ]
        //members: [ owner._id, owner._id ],
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