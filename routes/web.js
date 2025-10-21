const express = require("express");
const router = express.Router();
const dashboard = require("../Controllers/IndexController");
const authController = require("./../Controllers/authController");
const upload = require("./../utils/upload");

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
  authController.restrictedTo("admin"),
  authController.deleteUser
);
/** Auth Controller routes */
router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);

router.patch("/resetPassword/:token", authController.resetPassword); 
router.patch("/updatePassword", authController.updatePassword);
module.exports = router;
