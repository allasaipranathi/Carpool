const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAllRides,
  adminCancelRide,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// All admin routes require authentication and admin role
router.use(protect, requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/deactivate', toggleUserStatus);
router.get('/rides', getAllRides);
router.delete('/rides/:id', adminCancelRide);

module.exports = router;
