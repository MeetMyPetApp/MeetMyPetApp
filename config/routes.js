const express = require('express');
const router = express.Router();
const multer = require('multer');
const usersController = require('../controllers/user.controller');
const commentController = require('../controllers/user.controller');
const sessionMiddleware = require('../middlewares/session.middleware');
const upload = require('../config/multer.config');

const passport = require('passport');

router.get('/signup', sessionMiddleware.isNotAuthenticated, usersController.showSignupPage); 
router.post('/signup', sessionMiddleware.isNotAuthenticated, upload.single('avatar'), usersController.createUser);
router.get('/activate/:token', sessionMiddleware.isNotAuthenticated, usersController.activateUser);
router.get('/login', sessionMiddleware.isNotAuthenticated, usersController.showLoginPage);
router.post('/login', sessionMiddleware.isNotAuthenticated, usersController.doLogin);
router.get('/auth/slack', sessionMiddleware.isNotAuthenticated, usersController.loginWithSlack);
router.get('/auth/google', sessionMiddleware.isNotAuthenticated, usersController.loginWithGmail);
router.get('/auth/google/callback', sessionMiddleware.isNotAuthenticated, usersController.getLoginWithGmail);
router.get('/logout', sessionMiddleware.isAuthenticated, usersController.logout);


router.get('/', (req, res, next) => {
    res.render('index');
});

module.exports = router;


