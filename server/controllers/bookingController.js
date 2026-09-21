const Booking = require('../models/Booking');
const Ride = require('../models/Ride');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create a new ride booking / join request
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { rideId, seatsBooked = 1, pickupPoint, dropPoint, notes } = req.body;

    if (!rideId) {
      return res.status(400).json({
        success: false,
        message: 'Ride ID is required.',
      });
    }

    const seats = parseInt(seatsBooked, 10);
    if (isNaN(seats) || seats < 1) {
      return res.status(400).json({
        success: false,
        message: 'Please book at least 1 seat.',
      });
    }

    const ride = await Ride.findById(rideId).populate('driver', 'fullName email phone');
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    if (ride.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: `Cannot book a ride that is ${ride.status}.`,
      });
    }

    // Prevent driver booking their own ride
    if (ride.driver._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book a seat on your own offered ride.',
      });
    }

    // Check available seats
    if (ride.availableSeats < seats) {
      return res.status(400).json({
        success: false,
        message: `Only ${ride.availableSeats} seat(s) remaining on this ride.`,
      });
    }

    // Prevent duplicate active booking
    const existingBooking = await Booking.findOne({
      ride: ride._id,
      passenger: req.user._id,
      status: { $in: ['pending', 'accepted'] },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: `You already have an active request (${existingBooking.status}) for this ride.`,
      });
    }

    const totalPrice = (ride.pricePerPassenger || 0) * seats;

    const booking = await Booking.create({
      ride: ride._id,
      passenger: req.user._id,
      driver: ride.driver._id,
      seatsBooked: seats,
      totalPrice,
      pickupPoint: (pickupPoint || ride.pickupPoint || '').trim(),
      dropPoint: (dropPoint || ride.dropPoint || '').trim(),
      notes: (notes || '').trim(),
      status: 'pending',
    });

    // Notify the driver
    await Notification.create({
      recipient: ride.driver._id,
      sender: req.user._id,
      type: 'request_received',
      title: 'New Ride Request 🚗',
      message: `${req.user.fullName} requested ${seats} seat(s) for your trip from ${ride.from} to ${ride.to} on ${ride.date}.`,
      relatedRide: ride._id,
      relatedBooking: booking._id,
    });

    return res.status(201).json({
      success: true,
      message: 'Join request sent to driver! You will be notified once accepted.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings made by logged-in user (passenger trips)
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ passenger: req.user._id })
      .populate({
        path: 'ride',
        populate: {
          path: 'driver',
          select: 'fullName email phone rating totalTrips userType collegeName companyName profileImage emergencyContact',
        },
      })
      .populate('driver', 'fullName email phone rating userType profileImage')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for a specific ride (for driver management)
// @route   GET /api/bookings/ride/:rideId
// @access  Private (Driver only)
const getRideBookings = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    if (ride.driver.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view requests for this ride.',
      });
    }

    const bookings = await Booking.find({ ride: req.params.rideId })
      .populate('passenger', 'fullName email phone rating totalTrips userType collegeName companyName department profileImage')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept a ride booking request
// @route   PUT /api/bookings/:id/accept
// @access  Private (Driver only)
const acceptBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('passenger', 'fullName email phone')
      .populate('ride');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking request not found.',
      });
    }

    const ride = booking.ride;
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Associated ride not found.',
      });
    }

    if (ride.driver.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage this request.',
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Booking is already ${booking.status}.`,
      });
    }

    if (ride.availableSeats < booking.seatsBooked) {
      return res.status(400).json({
        success: false,
        message: `Not enough available seats (${ride.availableSeats} remaining) to accept this request for ${booking.seatsBooked} seat(s).`,
      });
    }

    // Decrement available seats and record passenger
    ride.availableSeats -= booking.seatsBooked;
    ride.passengers.push({
      user: booking.passenger._id,
      booking: booking._id,
      seats: booking.seatsBooked,
      joinedAt: new Date(),
    });
    await ride.save();

    booking.status = 'accepted';
    booking.acceptedAt = new Date();
    await booking.save();

    // Notify passenger
    await Notification.create({
      recipient: booking.passenger._id,
      sender: req.user._id,
      type: 'request_accepted',
      title: 'Booking Confirmed! 🚗🎉',
      message: `Your ride request for ${ride.from} → ${ride.to} on ${ride.date} was accepted by ${req.user.fullName}!`,
      relatedRide: ride._id,
      relatedBooking: booking._id,
    });

    return res.status(200).json({
      success: true,
      message: 'Booking accepted! Seats updated.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a ride booking request
// @route   PUT /api/bookings/:id/reject
// @access  Private (Driver only)
const rejectBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('ride');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking request not found.',
      });
    }

    const ride = booking.ride;
    if (ride.driver.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage this request.',
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Booking is already ${booking.status}.`,
      });
    }

    booking.status = 'rejected';
    await booking.save();

    // Notify passenger
    await Notification.create({
      recipient: booking.passenger,
      sender: req.user._id,
      type: 'request_rejected',
      title: 'Ride Request Declined',
      message: `Your ride request for ${ride.from} → ${ride.to} on ${ride.date} was declined by the driver.`,
      relatedRide: ride._id,
      relatedBooking: booking._id,
    });

    return res.status(200).json({
      success: true,
      message: 'Booking request rejected.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Passenger / Driver / Admin)
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('ride');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    const isPassenger = booking.passenger.toString() === req.user._id.toString();
    const isDriver = booking.driver.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPassenger && !isDriver && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking.',
      });
    }

    if (['cancelled', 'completed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking that is already ${booking.status}.`,
      });
    }

    const wasAccepted = booking.status === 'accepted';
    booking.status = 'cancelled';
    await booking.save();

    // If it was accepted, restore seats on the ride
    if (wasAccepted && booking.ride) {
      const ride = await Ride.findById(booking.ride._id);
      if (ride) {
        ride.availableSeats = Math.min(ride.totalSeats, ride.availableSeats + booking.seatsBooked);
        ride.passengers = ride.passengers.filter(
          (p) => p.booking?.toString() !== booking._id.toString()
        );
        await ride.save();
      }
    }

    // Notify other party
    const notifyRecipient = isPassenger ? booking.driver : booking.passenger;
    const notifyTitle = isPassenger ? 'Passenger Cancelled Booking' : 'Booking Cancelled by Driver';
    const notifyMsg = isPassenger
      ? `${req.user.fullName} cancelled their booking for ${booking.seatsBooked} seat(s).`
      : `Your booking was cancelled by the driver.`;

    await Notification.create({
      recipient: notifyRecipient,
      sender: req.user._id,
      type: 'ride_cancelled',
      title: notifyTitle,
      message: notifyMsg,
      relatedRide: booking.ride?._id,
      relatedBooking: booking._id,
    });

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getRideBookings,
  acceptBooking,
  rejectBooking,
  cancelBooking,
};
