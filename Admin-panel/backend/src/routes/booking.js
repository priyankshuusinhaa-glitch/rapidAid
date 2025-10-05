const express = require("express");
const auth = require("../middlewares/auth");
const { isManager } = require("../middlewares/role");
const {
  createBooking,
  getUserBookings,
  getTripHistory,
  getFareEstimate,
  getTripSummary,
  cancelBooking,
  addFeedback,
  updateBookingDetails,
  getBookings,
  updateBookingByAdmin,
  getBookingStats
} = require("../controllers/bookingController");
const router = express.Router();

// ───────────────────────────────
//  PUBLIC ROUTES
// ───────────────────────────────

// Create a new booking (no auth needed)
router.post("/create", createBooking);
router.post("/fare-estimate", getFareEstimate);
//  AUTHENTICATED USER ROUTES
// ───────────────────────────────
router.use(auth);
router.get("/user/:userId", getUserBookings);
router.get("/history", getTripHistory);
router.get("/summary/:bookingId", getTripSummary);
router.patch("/update/:id", updateBookingDetails);
router.patch("/cancel/:id", cancelBooking);
router.post("/feedback/:id", addFeedback);
router.get("/all", isManager, getBookings);
router.patch("/admin/update/:id", isManager, updateBookingByAdmin);
router.get("/stats", isManager, getBookingStats);

module.exports = router;
