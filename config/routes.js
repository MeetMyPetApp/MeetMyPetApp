const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/user.controller');
const commentController = require('../controllers/user.controller');
const sessionMiddleware = require('../middlewares/session.middleware');
const upload = require('../config/multer.config');

const passport = require('passport');

router.get('/', userController.showLogin);

module.exports = router;


