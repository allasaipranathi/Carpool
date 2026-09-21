const express = require('express');
const router = express.Router();
const {
  createRide,
  getRides,
  getRideById,
  updateRide,
  cancelRide,
  completeRide,
  getMyOfferedRides,
  getLiveTracking,
  updateLiveLocation,
} = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createRide)
  .get(getRides);

router.get('/my/offered', protect, getMyOfferedRides);
router.get('/:id', getRideById);
router.get('/:id/live-tracking', getLiveTracking);
router.put('/:id/live-tracking', protect, updateLiveLocation);
router.put('/:id', protect, updateRide);
router.put('/:id/cancel', protect, cancelRide);
router.put('/:id/complete', protect, completeRide);

module.exports = router;
