const express = require('express');
const router = express.Router();
const { bookSlot, cancelBooking, getMyBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// All booking routes are protected
router.post('/book/:slotId', protect, bookSlot);
router.put('/cancel/:bookingId', protect, cancelBooking);
router.get('/my', protect, getMyBookings);

module.exports = router;
