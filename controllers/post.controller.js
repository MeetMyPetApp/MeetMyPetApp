const Post = require('../models/post.model');
const User = require("../models/user.model");
const Match = require('../models/match.model');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');

module.exports.showFeedPage = (req, res, next) => {

    Match.find({
            'users': req.currentUser.id
        })
        .then(matches => {

            const matchIds = matches.reduce((acc, cur) => {
                //all posts without current user posts:
                /* const filteredMatch = cur.users.filter(m => m !== req.currentUser.id)
                acc.push(filteredMatch[0]._id) */
                acc.push(cur.users[0], cur.users[1])
                return acc
            }, []);

            Post.find().where('user').in(matchIds)
                .sort({
                    createdAt: -1
                })
                .populate('user')
                .populate('likes')
                .populate('comments')
                .then(posts => {
                    //console.log('POSTS: ', posts);
                    /*  const test = posts.forEach( p => {
                         if (p.user._id == req.currentUser.id) {
                             p['owner'] = true;
                             console.log(p)
                         }
                     } ) */
                    const currentuser = req.currentUser.id;
                    console.log(currentuser);
                    res.render('feed', {
                        posts,
                        currentuser
                    })
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))

}

module.exports.showPostDetails = (req, res, next) => {
    Post.findById(req.params.id)
        .populate('user')
        .populate('likes')
        .populate({
            path: 'comments',
            options: {
                sort: {
                    createdAt: -1
                }
            },
            populate: 'user'
        })
        .then(post => {
            res.render('posts/post', {
                post
            })
        })
        .catch(err => next(err))
}

module.exports.createPost = (req, res, next) => {
    const params = {
        body: req.body.body,
        user: req.currentUser.id,
        visibility: 'public'
    }

    const post = new Post(params)

    post.save()
        .then(() => {
            res.redirect('/')
        })
}


module.exports.showEditPost = (req, res, next) => {
    Post.findById(req.params.id)
        .populate("user")
        .then(post => {
            console.log(post);
            res.render("posts/editpost", {
                post
            })
        })
}

module.exports.updatePost = (req, res, next) => {

    const params = {
        body: req.body.body,
        visibility: "public",
        user: req.currentUser.id
    };

    if (req.file) {
        params.image = req.file.path
    }


    Post.findByIdAndUpdate(req.params.id, params, {
        runValidators: true,
        new: true
        })
        .then(() => {
            res.redirect(`/post/${req.params.id}`)
        })
        .catch(err => next(err))

}

module.exports.deletePost = (req, res, next) => {
    Post.findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect(`/user/${req.currentUser.id}/profilefeed`)
        })
        .catch(err => next(err))
}


module.exports.createNewComment = (req, res, next) => {
    const postId = req.params.id;
    const commentParams = {
        body: req.body.comment,
        user: req.currentUser.id,
        post: postId
    }

    const comment = new Comment(commentParams)

    comment.save()
        .then(() => {
            res.redirect(`/post/${postId}`)
        })
        .catch(err => next(err))
}

module.exports.deleteComment = (req, res, next) => {
    Comment.findById(req.params.id)
        .then(comment => {
            if (comment.user.toString() === req.currentUser._id.toString()) {
                Comment.findByIdAndDelete(comment._id)
                    .then(() => {
                        res.redirect(`/post/${postId}`)
                    })
                    .catch(next)
            } else {
                res.redirect(`/post/${postId}`)
            }
        })
        .catch(next)
}

module.exports.like = (req, res, next) => {
    const user = req.currentUser.id;
    const post = req.params.id;
    const params = {
        user,
        post
    };

    Like.findOne(params)
        .then(like => {
            if (like) {
                Like.findByIdAndRemove(like._id)
                    .then(() => {
                        res.json({
                            like: -1
                        });
                    })
                    .catch(err => next(err));
            } else {
                const newLike = new Like(params);

                newLike.save()
                    .then(() => {
                        res.json({
                            like: 1
                        });
                    })
                    .catch(err => next(err));
            }
        })
        .catch(err => next(err));
}