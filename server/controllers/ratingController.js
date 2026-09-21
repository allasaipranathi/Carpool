const Rating = require('../models/Rating');
const Ride = require('../models/Ride');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Submit a rating and review for driver or passenger
// @route   POST /api/ratings
// @access  Private
const createRating = async (req, res, next) => {
  try {
    const { rideId, toUserId, rating, review, role } = req.body;

    if (!rideId || !toUserId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Ride ID, recipient user ID, and numeric rating (1-5) are required.',
      });
    }

    const ratingVal = Number(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 1 and 5.',
      });
    }

    if (toUserId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot rate yourself.',
      });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    // Check duplicate rating
    const existingRating = await Rating.findOne({
      ride: ride._id,
      fromUser: req.user._id,
      toUser: toUserId,
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a rating for this user on this ride.',
      });
    }

    const newRating = await Rating.create({
      ride: ride._id,
      fromUser: req.user._id,
      toUser: toUserId,
      role: role || (ride.driver.toString() === toUserId.toString() ? 'driver' : 'passenger'),
      rating: ratingVal,
      review: (review || '').trim(),
    });

    // Recalculate target user's average rating
    const allUserRatings = await Rating.find({ toUser: toUserId });
    const totalCount = allUserRatings.length;
    const totalSum = allUserRatings.reduce((acc, curr) => acc + curr.rating, 0);
    const newAverage = Number((totalSum / totalCount).toFixed(1));

    await User.findByIdAndUpdate(toUserId, {
      rating: newAverage,
      totalRatings: totalCount,
    });

    // Send notification
    await Notification.create({
      recipient: toUserId,
      sender: req.user._id,
      type: 'rating_received',
      title: 'New Rating Received ⭐',
      message: `${req.user.fullName} rated you ${ratingVal} stars: "${(review || 'Great trip!').slice(0, 50)}"`,
      relatedRide: ride._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Rating submitted successfully!',
      data: newRating,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all ratings for a user
// @route   GET /api/ratings/user/:userId
// @access  Public / Private
const getUserRatings = async (req, res, next) => {
  try {
    const ratings = await Rating.find({ toUser: req.params.userId })
      .populate('fromUser', 'fullName profileImage userType rating')
      .populate('ride', 'from to date')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRating,
  getUserRatings,
};
