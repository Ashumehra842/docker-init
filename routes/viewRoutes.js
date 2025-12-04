const express = require('express');
const router = express.Router();
const viewsController = require('./../Controllers/viewsController');
const authController = require('./../Controllers/authController');


router.get('/',authController.isLoggedIn, viewsController.getOverview);
router.route('/tour/:slug').get(authController.isLoggedIn,viewsController.getTour);

router.route('/login').get(authController.isLoggedIn, viewsController.getLoginForm);
router.route('/logout').get(authController.isLoggedIn, viewsController.logout);

module.exports = router;