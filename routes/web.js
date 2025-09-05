const express = require('express');
const router = express.Router();
const dashboard = require('../Controllers/IndexController');
const authController = require('./../Controllers/authController');
const upload = require('./../utils/upload');
router.route('/dashborad',).get(dashboard.index);
router.route('/save').post(dashboard.saveUser);
router.route('/list').get(authController.protect, dashboard.getAllUsers);
router.route('/getUserById/:id').get(dashboard.getUserById);
router.route('/update/:id').post(dashboard.updateUser);
router.route('/dashborad').get(dashboard.index);
router.route('/profile').post(upload.single("image"), dashboard.profile);

/** Auth Controller routes */
router.post('/signup', authController.signup);
router.post('/login', authController.login);
module.exports = router;