const express = require('express');
const router = express.Router();
const dashboard = require('../Controllers/IndexController');
router.route('/dashborad', ).get(dashboard.index);
router.route('/save').post(dashboard.saveUser);
router.route('/list').get(dashboard.getAllUsers);
router.route('/getUserById/:id').get(dashboard.getUserById);
router.route('/update/:id').post(dashboard.updateUser);
router.route('/dashborad', ).get(dashboard.index);



module.exports = router;