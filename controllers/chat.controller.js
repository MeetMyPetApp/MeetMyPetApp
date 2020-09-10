const User = require("../models/user.model");
const Message = require('../models/message.model');
const Chat = require("../models/chat.model");
const Match = require("../models/match.model");

module.exports.showChatList = (req, res, next) => {

    Chat.find({ 'members': req.currentUser.id })
        .populate({path: "members", match: {'_id': {$ne: req.currentUser.id}}})
        .then( chats => {

            const userIdsWithActiveChats = [];
            chats.forEach( c => userIdsWithActiveChats.push(c.members[0]._id))
          
            Match.find().where('users').nin(userIdsWithActiveChats)
                .populate({path: 'users', match: {'_id': {$ne: req.currentUser.id}}})
                .then( matches => {

                    res.render('chats/allchats', { chats , matches})
                }) 
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

module.exports.createChat = (req, res, next) => {
    const members = [ req.params.userid, req.currentUser.id ];
    
    const chat = new Chat(members)

    chat.save()
        .then( c => res.redirect(`/chat/${c._id}`))
        .catch(err => next(err))
}

