const User = require("../models/user.model");
const Message = require('../models/message.model');
const Chat = require("../models/chat.model");

module.exports.showChatList = (req, res, next) => {

    Chat.find({
            'members': req.currentUser.id
        })
        .populate({path: "members", match: {'_id': {$ne: req.currentUser.id}}})
        .then( chats => {

            res.render('chats/allchats', { chats })
        })
        .catch(err => next(err))
}


module.exports.showChat = (req, res, next) => {
    const { id } = req.params;

    Chat.findById(id)
        .populate('users')
        .populate({
            path: 'messages',
            options: {
                sort: {
                    createdAt: -1
                }
            }/* ,
            populate: 'user' */
        })
        .then( chat => {
            console.log('Viewing chat');
            /* if (chat.users.includes(req.currentUser.id)) {
                
            } */
            res.render('chats/chatroom', { chat })
        })
        .catch(err => next(err))
}

