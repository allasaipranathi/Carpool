const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      userType,
      collegeName,
      department,
      yearOfStudy,
      companyName,
      profileImage,
    } = req.body;

    if (!fullName || !email || !phone || !password || !userType) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.',
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    if (!['College Student', 'Office Employee'].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type specified.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered.',
      });
    }

    const userData = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password,
      userType,
      collegeName: userType === 'College Student' ? (collegeName || '').trim() : '',
      department: (department || '').trim(),
      yearOfStudy: userType === 'College Student' ? (yearOfStudy || '').trim() : '',
      companyName: userType === 'Office Employee' ? (companyName || '').trim() : '',
      profileImage: profileImage || '',
      rating: 5.0,
      totalRatings: 0,
      totalTrips: 0,
      role: 'user',
    };

    const user = await User.create(userData);
    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        collegeName: user.collegeName,
        department: user.department,
        yearOfStudy: user.yearOfStudy,
        companyName: user.companyName,
        profileImage: user.profileImage,
        rating: user.rating,
        totalRatings: user.totalRatings,
        totalTrips: user.totalTrips,
        emergencyContact: user.emergencyContact,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        collegeName: user.collegeName,
        department: user.department,
        yearOfStudy: user.yearOfStudy,
        companyName: user.companyName,
        profileImage: user.profileImage,
        rating: user.rating,
        totalRatings: user.totalRatings,
        totalTrips: user.totalTrips,
        emergencyContact: user.emergencyContact,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.',
      });
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match.',
      });
    }

    const user = await User.findById(req.user._id);

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.',
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  changePassword,
};
