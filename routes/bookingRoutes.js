const express = require("express");
const app = express();
const bookingController = require("../Controllers/bookingController");
const authController = require("../Controllers/authController");
const Booking = require("../models/bookingModel");

const router = express.Router();
app.use(authController.protect);
app.use(authController.restrictTo("admin", "lead-guide"));

router
  .route("/")
  .post(bookingController.createBooking)
  .get(bookingController.getAllBooking);

router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

router.get("/checkout-session/:tourID", bookingController.getCheckoutSession);
module.exports = router;
