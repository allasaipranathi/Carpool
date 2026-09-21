const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const {
      fullName,
      phone,
      collegeName,
      department,
      yearOfStudy,
      companyName,
      profileImage,
    } = req.body;

    if (fullName) user.fullName = fullName.trim();
    if (phone) user.phone = phone.trim();
    if (collegeName !== undefined) user.collegeName = collegeName.trim();
    if (department !== undefined) user.department = department.trim();
    if (yearOfStudy !== undefined) user.yearOfStudy = yearOfStudy.trim();
    if (companyName !== undefined) user.companyName = companyName.trim();
    if (profileImage !== undefined) user.profileImage = profileImage;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user emergency contact
// @route   PUT /api/users/emergency-contact
// @access  Private
const updateEmergencyContact = async (req, res, next) => {
  try {
    const { name, relationship, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide contact name and phone number.',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.emergencyContact = {
      name: name.trim(),
      relationship: (relationship || '').trim(),
      phone: phone.trim(),
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Emergency contact updated successfully.',
      data: user.emergencyContact,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateEmergencyContact,
};
