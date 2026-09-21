const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updateEmergencyContact,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/emergency-contact', protect, updateEmergencyContact);

module.exports = router;
