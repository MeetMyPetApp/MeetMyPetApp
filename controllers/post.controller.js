const Post = require('../models/post.model');
const Match = require('../models/match.model');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');

module.exports.showFeedPage = (req, res, next) => {

    Match.find({ 'users': req.currentUser.id})
        .then(matches => {

            const matchIds = matches.reduce((acc, cur) => {
                const filteredMatch = cur.users.filter(m => m !== req.currentUser.id)
                acc.push(filteredMatch[0]._id)
                return acc
            }, []);

            Post.find().where('user').in(matchIds)
                .sort({ createdAt: -1 })
                .populate('user')
                .populate('likes')
                .populate('comments')
                .then( posts => {
                    res.render('feed', { posts })
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))
    
}

module.exports.showPostDetails = (req, res, next) => {
    Post.findById( req.params.id )
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
        .then( post => {
            res.render('posts/post', { post })
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
        .then( () => {
            res.redirect(`/post/${postId}`)
        })
        .catch(err => next(err))
}

module.exports.like = (req, res, next) => {
    const user = req.currentUser.id;
    const post = req.params.id;
    const params = { user , post };
  
    Like.findOne(params)
      .then(like => {
        if (like) {
          Like.findByIdAndRemove(like._id)
            .then(() => {
                res.redirect('/')
            })
            .catch(err => next(err));
        } else {
          const newLike = new Like(params);
          newLike.save()
            .then(() => {
                res.redirect('/')
            })
            .catch(err => next(err));;
        }
      })
      .catch(err => next(err));
  }
  
