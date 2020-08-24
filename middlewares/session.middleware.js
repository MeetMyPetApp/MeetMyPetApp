const Owner = require('../models/owner.model')

module.exports.isAuthenticated = (req, res, next) => {
  Owner.findById(req.session.ownerId)
    .then(owner => {
      if (owner) {
        req.currentOwner = owner;
        res.locals.currentOwner = owner; 
        next()
      } else {
        res.redirect('/login')
      }
    })
    .catch(next);
}

module.exports.isNotAuthenticated = (req, res, next) => {
  Owner.findById(req.session.ownerId)
    .then((owner) => {
      if (owner) {
        res.redirect('/projects');
      } else {
        next();
      }
    })
    .catch(next);
};
