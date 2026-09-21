const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getRideBookings,
  acceptBooking,
  rejectBooking,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/ride/:rideId', protect, getRideBookings);
router.put('/:id/accept', protect, acceptBooking);
router.put('/:id/reject', protect, rejectBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
