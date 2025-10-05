const express = require("express");
const auth = require("../middlewares/auth");
const { isManager } = require("../middlewares/role");
const {
  getBookings,
  updateBookingByAdmin,
  createBooking,
  getUserBookings,
  getTripHistory,
  getFareEstimate,
  getTripSummary,
  cancelBooking,
  addFeedback,
  updateBookingDetails
} = require("../controllers/bookingController");
const router = express.Router();
router.post("/create", createBooking);
router.use(auth);
router.get("/user/:userId", getUserBookings); 
router.get("/history", getTripHistory); // ✅ Trip history (paginated)
router.get("/summary/:bookingId", getTripSummary); // ✅ Trip summary
router.patch("/update/:id", updateBookingDetails); // ✅ Update notes / medical info
router.patch("/cancel/:id", cancelBooking); // ✅ Cancel booking
router.post("/feedback/:id", addFeedback); 
router.post("/fare-estimate", getFareEstimate); 
router.get("/booking", isManager, getBookings);
router.patch("/updatebooking/:id", isManager, updateBookingByAdmin);
module.exports = router;
