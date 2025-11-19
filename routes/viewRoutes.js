const express = require('express');
const router = express.Router();
const viewsController = require('./../Controllers/viewsController');

router.route('/').get(viewsController.getOverview);
router.route('/tour').get(viewsController.getTour);

module.exports = router;