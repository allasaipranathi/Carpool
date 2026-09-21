const express = require('express');
const router = express.Router();
const {
  createRating,
  getUserRatings,
} = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRating);
router.get('/user/:userId', getUserRatings);

module.exports = router;
