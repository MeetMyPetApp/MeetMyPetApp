const express = require('express');
const router = express.Router();
const multer = require('multer');
const usersController = require('../controllers/user.controller');
const commentController = require('../controllers/comment.controller');
const sessionMiddleware = require('../middlewares/session.middleware');
const upload = require('../config/multer.config');

const passport = require('passport');

router.get('/', sessionMiddleware.isAuthenticated);

module.exports = router;


