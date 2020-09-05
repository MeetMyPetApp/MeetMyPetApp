const express = require('express');
const router = express.Router();
const multer = require('multer');
const usersController = require('../controllers/user.controller');
const petsController = require('../controllers/pet.controller');
const commentController = require('../controllers/user.controller');
const sessionMiddleware = require('../middlewares/session.middleware');
const upload = require('../config/multer.config');

const passport = require('passport');

router.get('/signup', sessionMiddleware.isNotAuthenticated, usersController.showSignupPage); 
router.post('/signup', sessionMiddleware.isNotAuthenticated, upload.single('avatar'), usersController.createUser);
router.get('/activate/:token', sessionMiddleware.isNotAuthenticated, usersController.activateUser);
router.get('/auth/slack', sessionMiddleware.isNotAuthenticated, usersController.loginWithSlack);
router.get('/auth/google', sessionMiddleware.isNotAuthenticated, usersController.loginWithGmail);
router.get('/auth/google/callback', sessionMiddleware.isNotAuthenticated, usersController.getLoginWithGmail);
router.get('/login', sessionMiddleware.isNotAuthenticated, usersController.showLoginPage);
router.post('/login', sessionMiddleware.isNotAuthenticated, usersController.doLogin);
router.get('/logout', sessionMiddleware.isAuthenticated, usersController.logout);

//router.get('/user/:id/edit', usersController.showEditProfileForm)
router.get('/user/:id/edit', sessionMiddleware.isAuthenticated, usersController.showEditProfileForm)
router.post('/user/:id/edit', sessionMiddleware.isAuthenticated, upload.single('avatar'),usersController.updateUser)
router.get('/user/:id', sessionMiddleware.isAuthenticated, usersController.showUserProfilePage)
router.get('/user/:id/delete', sessionMiddleware.isAuthenticated, usersController.deleteUser)

router.get('/user/:id/addNewPet', sessionMiddleware.isAuthenticated, petsController.showAddPetPage)
router.post('/pets/addNewPet', sessionMiddleware.isAuthenticated, upload.single('avatar'), petsController.createPet);
router.get('/pet/:id/editPet', sessionMiddleware.isAuthenticated, petsController.showEditPetForm)
router.post('/pet/:id/editPet', sessionMiddleware.isAuthenticated, upload.single('avatar'),  petsController.updatePet)
router.get('/user/:id/pets', sessionMiddleware.isAuthenticated, petsController.showPetProfilePage)
router.get('/pet/:id/deletePet', sessionMiddleware.isAuthenticated, petsController.deletePet)


router.get('/', sessionMiddleware.isAuthenticated, usersController.showFeedPage);

module.exports = router;


