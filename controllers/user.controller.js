const mongoose = require('mongoose');
const User = require('../models/user.model');
//const Pets = require('../models/pet.model');
const nodemailer = require('../config/mailer.config');
const passport = require('passport');
const Match = require('../models/match.model');
const Post = require('../models/post.model');
const Like = require('../models/like.model');
const Comment = require('../models/comment.model');

const {
    post
} = require('../config/routes');

module.exports.showSignupPage = (req, res, next) => {
    res.render('users/userform')
}

module.exports.showLoginPage = (req, res, next) => {
    res.render('users/login')
}

module.exports.doLogin = (req, res, next) => {
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user) {
                user.checkPassword(req.body.password)
                    .then(match => {
                        if (match) {
                            if (user.activation.active) {
                                req.session.userId = user._id;
                                res.redirect('/');
                            } else {
                                res.render('users/login', {
                                    error: {
                                        validation: {
                                            message: 'Your account is not active, check your email!'
                                        }
                                    }
                                })
                            }
                        } else {
                            res.render('users/login', {
                                error: {
                                    email: {
                                        message: 'user not found'
                                    }
                                }
                            })
                        }
                    })
            } else {
                res.render("users/login", {
                    error: {
                        email: {
                            message: "user not found",
                        },
                    },
                });
            }
        })
        .catch(next)
}

module.exports.loginWithSlack = (req, res, next) => {
    const passportSlackController = passport.authenticate('slack', (error, user) => {
        if (error) {
            next(error);
        } else {
            req.session.userId = user._id;
            res.redirect('/');
        }
    })

    passportSlackController(req, res, next);
}

module.exports.loginWithGmail = (req, res, next) => {
    const passportGoogleLogin = passport.authenticate('google', {
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
        ]
    })
    passportGoogleLogin(req, res, next)
}

module.exports.getLoginWithGmail = (req, res, next) => {
    const passportGoogleController = passport.authenticate('google', {
        scope: ['profile', 'email']
    }, (error, user) => {
        if (error) {
            next(error);
        } else {
            req.session.userId = user._id;
            res.redirect('/');
        }
    })
    passportGoogleController(req, res, next)
}


module.exports.createUser = (req, res, next) => {
    const userParams = req.body;
    userParams.avatar = req.file ? req.file.path : undefined;
    const user = new User(userParams);
    console.log(user);

    user.save()
        .then(user => {
            nodemailer.sendValidationEmail(user.email, user.activation.token, user.name);
            res.render('users/login', {
                message: 'Check your email for activation'
            })
        })
        .catch((error) => {
            console.log(error.message);
            console.log(error.errors);
            console.log(JSON.stringify(error));
            if (error instanceof mongoose.Error.ValidationError) {
                res.render("users/userform", {
                    error: error.errors,
                    user
                });
            } else if (error.code === 11000) { // error when duplicated user
                res.render("users/userform", {
                    user,
                    error: {
                        email: {
                            message: 'user already exists'
                        }
                    }
                });
            } else {
                next(error);
            }
        })
        .catch(next)
}

module.exports.activateUser = (req, res, next) => {
    User.findOne({
            "activation.token": req.params.token
        })
        .then(user => {
            if (user) {
                user.activation.active = true;
                user.save()
                    .then(() => {
                        res.render('users/login', {
                            message: 'Your account has been activated. You can log in now.'
                        })
                    })
                    .catch(err => next(err))
            } else {
                res.render('users/login', {
                    error: {
                        validation: {
                            message: 'Invalid link'
                        }
                    }
                })
            }
        })
        .catch(err => next(err))
}

module.exports.logout = (req, res, next) => {
    req.session.destroy()

    res.redirect('/login')
}

module.exports.showUserProfilePage = (req, res, next) => {
    const {
        id
    } = req.params;
    const currentuser = req.currentUser;

    console.log('currentuser', currentuser);
    User.findById(id)
        .populate({
            path: 'posts',
            options: {
                sort: {
                    createdAt: -1
                }
            },
            populate: ['comments', 'likes', 'user']
        })
        .then(user => {
            res.render('users/user', {
                user,
                currentuser
            })
        })
        .catch(err => next(err))
}

module.exports.showEditProfileForm = (req, res, next) => {

    User.findById(req.params.id)
        .then(user => {
            res.render('users/edituserform', {
                user
            })
        })
        .catch(err => next(err))
}


module.exports.updateUser = (req, res, next) => {
    const userParams = req.body;

    if (req.file) {
        userParams.avatar = req.file.path;
    }

    console.log('UserParams', userParams);

    User.findByIdAndUpdate(req.params.id, userParams, {
            runValidators: true,
            new: true
        })
        .then(user => {
            if (user) {
                console.log('User', user);
                res.redirect(`/user/${user._id}`)
            } else {
                res.redirect('/login')
            }
        })
        .catch(err => next(err))
}

module.exports.deleteUser = (req, res, next) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => {
            req.currentUser.remove()
                .then(() => {
                    req.session.destroy()
                    res.redirect('/login')
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))
}

module.exports.showExternalProfile = (req, res, next) => {
    const {
        id
    } = req.params

    Post.find({
            user: id
        })
        .populate('user')
        .populate('likes')
        .populate('comments')
        .then(posts => {
            console.log(posts);
            Like.find({
                    'user': id
                })
                .populate({
                    path: 'posts',
                    populate: {
                        path: 'user'
                    }
                })
                .then(likes => {
                    Match.find({
                        "users": {
                            $in: [id]
                        },
                        status: "accepted"
                    })
                    .then(matches => {
                         res.render('users/externaluserprofile', {
                            posts,
                            likes,
                            matches
                        })
                    })
                    
                })
                .catch(error => console.log(error))
        })
        .catch(error => console.log(error))
}


module.exports.showNetwork = (req, res, next) => {

    Match.find({ 'users': { $in: [req.currentUser.id] } })
        .then(matches => {

            const matchIds = matches.reduce((acc, cur) => {
                acc.push(cur.users[0], cur.users[1])
                return acc
            }, []);

            User.find().where('_id').nin(matchIds)
                .populate('matches')
                .then(users => {
                    res.render('network/generalnetwork', {
                        users
                    })
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))
}

module.exports.showMatches = (req, res, next) => {

    Match.find({
            $or: [{
                    users: {
                        $in: [req.currentUser.id]
                    },
                    status: 'accepted'
                },
                {
                    users: {
                        $in: [req.currentUser.id]
                    },
                    status: {
                        $eq: 'pending'
                    },
                    requester: {
                        $ne: req.currentUser.id
                    }
                }
            ]
        })
        .populate('users')
        .sort([['status', -1]])
        .then(matches => {
            const users = matches
                .map(m => {
                    return {
                        data: m.users.find(e => e._id.toString() !== req.currentUser.id.toString()),
                        showBtn: m.status === 'pending',
                        match: m._id
                    }
                })


            res.render('network/mynetwork', {
                users
            })

        })
        .catch(err => next(err))
}

module.exports.createMatch = (req, res, next) => {
    const params = {
        users: [req.params.id, req.params.contact],
        status: 'pending',
        requester: req.params.id
    }

    const match = new Match(params)

    match.save()
        .then(() => {
            res.redirect(`/user/${req.params.id}/network`)
        })
        .catch(err => next(err))

}

module.exports.matchAccepted = (req, res, next) => {
    Match.findByIdAndUpdate(req.params.id, {
            'status': 'accepted'
        }, {
            runValidators: true,
            new: true
        })
        .then(() => {
            res.json({
                ok: true
            })
        })
        .catch(err => next(err))
}

module.exports.matchDenied = (req, res, next) => {
    Match.findByIdAndUpdate(req.params.id, {
            'status': 'denied'
        }, {
            runValidators: true,
            new: true
        })
        .then(() => {
            res.redirect(`/user/${req.currentUser.id}/matches`)
        })
        .catch(err => next(err))
}