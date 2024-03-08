const express = require("express");
const router = express.Router();
const {
  booking,
  getBookings,
  deleteBooking,
  updateBooking,
  getAllBookings,
  getBookingInfo,
  adminCancelBooking,
} = require("../Controllers/Booking");

router.post("/bookings", booking);
router.get("/bookings", getBookings);
router.delete("/bookings/:id", deleteBooking);
router.put("/bookings/:id", updateBooking);
router.get("/allbookings", getAllBookings);
router.get("/booking-info/:id", getBookingInfo);
router.delete("/adminCancelBooking/:id", adminCancelBooking);

module.exports = router;
