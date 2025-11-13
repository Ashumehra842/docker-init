const express = require("express");
const router = express.Router();
const dashboard = require("../Controllers/IndexController");
const authController = require("./../Controllers/authController");
const upload = require("./../utils/upload");
const userController = require('./../Controllers/UserController');
const tourController = require('./../controllers/tourController');
const reviewController = require('./../Controllers/reviewController');


router.route("/dashborad").get(dashboard.index);
router.route("/save").post(dashboard.saveUser);
router.route("/list").get(authController.protect, dashboard.getAllUsers);
router.route("/getUserById/:id").get(dashboard.getUserById);
router.route("/update/:id").post(dashboard.updateUser);
router.route("/dashborad").get(dashboard.index);
router.route("/profile").post(upload.single("image"), dashboard.profile);
router.post(
  "/delete/:id",
  authController.protect,
  authController.restrictTo("admin"),
  authController.deleteUser
);
/** Auth Controller routes */
router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);

router.patch("/resetPassword/:token", authController.resetPassword);
router.patch("/updateMyPassword", authController.protect, authController.updatePassword);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);


// Tour Routes

router
  .route('/tours')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/tours/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

router.post('/createReview', authController.protect, authController.restrictTo('admin'), reviewController.createReview);
router.get('/getReview', authController.protect, authController.restrictTo('admin'), reviewController.getReview)
module.exports = router;
