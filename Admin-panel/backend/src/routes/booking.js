const express = require("express");
const auth = require("../middlewares/auth");
const { isManager } = require("../middlewares/role");
const { getBookings, updateBookingByAdmin, createBooking, getUserBookings } = require("../controllers/bookingController");

const router = express.Router();

// Public route for users to create bookings
router.post("/create", createBooking);

// Protected routes for admin management
router.use(auth);
router.get("/user/:userId", getUserBookings); // Users can view their own bookings
router.get("/booking" , isManager , getBookings);
router.patch("/updatebooking/:id" , isManager , updateBookingByAdmin);

module.exports = router;





