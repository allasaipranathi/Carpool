const User = require('../models/User');
const Ride = require('../models/Ride');
const Booking = require('../models/Booking');

// @desc    Get admin dashboard metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRides = await Ride.countDocuments();
    const activeRides = await Ride.countDocuments({ status: { $in: ['scheduled', 'ongoing'] } });
    const completedTrips = await Ride.countDocuments({ status: 'completed' });
    const cancelledTrips = await Ride.countDocuments({ status: 'cancelled' });
    const totalBookings = await Booking.countDocuments();
    const acceptedBookings = await Booking.countDocuments({ status: 'accepted' });

    // Recent activity
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentRides = await Ride.find()
      .populate('driver', 'fullName email userType')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalRides,
        activeRides,
        completedTrips,
        cancelledTrips,
        totalBookings,
        acceptedBookings,
        recentUsers,
        recentRides,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for admin management
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { search, userType, role } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    if (userType) query.userType = userType;
    if (role) query.role = role;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status (deactivate / reactivate)
// @route   PUT /api/admin/users/:id/deactivate
// @access  Private/Admin
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate an admin account.',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all platform rides for moderation
// @route   GET /api/admin/rides
// @access  Private/Admin
const getAllRides = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const rides = await Ride.find(query)
      .populate('driver', 'fullName email phone rating userType')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: rides.length,
      data: rides,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel inappropriate ride
// @route   DELETE /api/admin/rides/:id
// @access  Private/Admin
const adminCancelRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    ride.status = 'cancelled';
    await ride.save();

    // Cancel all bookings
    await Booking.updateMany(
      { ride: ride._id, status: { $in: ['pending', 'accepted'] } },
      { $set: { status: 'cancelled' } }
    );

    return res.status(200).json({
      success: true,
      message: 'Ride cancelled by administrator.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAllRides,
  adminCancelRide,
};
