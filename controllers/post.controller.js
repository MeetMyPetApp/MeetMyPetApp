const Post = require('../models/post.model');
const Match = require('../models/match.model');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');

module.exports.showFeedPage = (req, res, next) => {

    Match.find({ 'users': req.currentUser.id})
        .then(matches => {

            const matchIds = matches.reduce((acc, cur) => {
                //all posts without current user posts:
                /* const filteredMatch = cur.users.filter(m => m !== req.currentUser.id)
                acc.push(filteredMatch[0]._id) */
                acc.push(cur.users[0], cur.users[1])
                return acc
            }, []);

            Post.find().where('user').in(matchIds)
                .sort({ createdAt: -1 })
                .populate('user')
                .populate('likes')
                .populate('comments')
                .then( posts => {
                    //console.log('POSTS: ', posts);
                   /*  const test = posts.forEach( p => {
                        if (p.user._id == req.currentUser.id) {
                            p['owner'] = true;
                            console.log(p)
                        }
                    } ) */
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
  
