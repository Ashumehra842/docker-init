const express = require('express');
const router = express.Router();
const viewsController = require('./../Controllers/viewsController');
const authController = require('./../Controllers/authController');


router.get('/',authController.isLoggedIn, viewsController.getOverview);
router.route('/tour/:slug').get(authController.isLoggedIn,viewsController.getTour);

router.route('/login').get(authController.isLoggedIn, viewsController.getLoginForm);
router.route('/logout').get(authController.isLoggedIn, viewsController.logout);
router.route('/me').get(authController.isLoggedIn, viewsController.getAccount);
router.route('/submit-user-data').post( authController.protect, viewsController.updateUserData);

module.exports = router;