const User = require("../models/user.model");
const Message = require('../models/message.model');
const Chat = require("../models/chat.model");
const Match = require("../models/match.model");

module.exports.showChatList = (req, res, next) => {

    /* const chats = [];
    const allMatchIds = [];

    Match.find({'users': { $in: [req.currentUser.id]}, status: 'accepted'}) 
        .populate({path: 'users', match: {'_id': {$ne: req.currentUser.id}}})
        .then( matches => {

            matches.forEach( m => {
                allMatchIds.push(m.users[0]._id)
            })

            for (let i = 0 ; i < allMatchIds.length; i++) {
                Chat.find({ 'members': { $in: allMatchIds }})
                    .then( chat => {
                        chats.push(chat)
                        res.json(chats[0].length.toString())
                    })
            }
            
        })  */

    


    //5f5c9a99bcb239783fef7c4e USER TEST
    
    //5f5cbb4e5f803e187eff3628  CHAT
    Chat.find({ 'members': { $in: [req.currentUser.id] }}) 
        .populate({path: "members", match: {'_id': {$ne: req.currentUser.id}}})
        .then( chats => {

            const userIdsWithActiveChats = [];
            chats.forEach( c => userIdsWithActiveChats.push(c.members[0]._id))
          
            Match.find({'users': { $in: [req.currentUser.id]}, status: 'accepted'}).where('users').nin(userIdsWithActiveChats)
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
            }
        })
        .then( chat => {
            res.render('chats/chatroom', { chat })
        })
        .catch(err => next(err))
}

module.exports.createChat = (req, res, next) => {
    const params = {
        members: [ req.params.userid, req.currentUser.id ]
    };
    
    const chat = new Chat(params)

    chat.save()
        .then( c => res.redirect(`/chat/${c._id}`))
        .catch(err => next(err))
}

module.exports.createMessage = (req, res, next) => {
    const params = {
        message: req.body.message,
        sender: req.currentUser.id,
        chat: req.params.id,
        status: 'unread'
    }

    const message = new Message(params)

    message.save()
        .then( () => {
            res.redirect(`/chat/${req.params.id}`)
        })
        .catch(err => next(err))
}

