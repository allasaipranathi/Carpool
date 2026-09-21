const Ride = require('../models/Ride');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Calculate route match percentage
const calculateMatchScore = (ride, queryFrom, queryTo, queryDate, queryTime) => {
  let score = 50; // base potential match

  const norm = (str) => (str || '').toLowerCase().trim();
  const rFrom = norm(ride.from);
  const rTo = norm(ride.to);
  const qFrom = norm(queryFrom);
  const qTo = norm(queryTo);

  if (qFrom) {
    if (rFrom === qFrom) score += 25;
    else if (rFrom.includes(qFrom) || qFrom.includes(rFrom)) score += 15;
  }

  if (qTo) {
    if (rTo === qTo) score += 25;
    else if (rTo.includes(qTo) || qTo.includes(rTo)) score += 15;
  }

  if (queryDate && ride.date === queryDate) {
    score += 15;
  }

  if (queryTime && ride.departureTime) {
    // Check time closeness
    const [qH, qM] = queryTime.split(':').map(Number);
    const [rH, rM] = ride.departureTime.split(':').map(Number);
    if (!isNaN(qH) && !isNaN(rH)) {
      const diffMinutes = Math.abs((qH * 60 + (qM || 0)) - (rH * 60 + (rM || 0)));
      if (diffMinutes <= 30) score += 10;
      else if (diffMinutes <= 60) score += 5;
    }
  }

  if (ride.availableSeats > 0) score += 5;

  return Math.min(score, 99);
};

// @desc    Create a new ride
// @route   POST /api/rides
// @access  Private
const createRide = async (req, res, next) => {
  try {
    const {
      from,
      to,
      pickupPoint,
      dropPoint,
      date,
      departureTime,
      arrivalTime,
      availableSeats,
      vehicleType,
      vehicleModel,
      vehicleNumber,
      pricePerPassenger,
      description,
    } = req.body;

    if (!from || !to || !date || !departureTime || !availableSeats || !vehicleModel || !vehicleNumber || pricePerPassenger === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required ride details.',
      });
    }

    const seats = parseInt(availableSeats, 10);
    if (isNaN(seats) || seats < 1) {
      return res.status(400).json({
        success: false,
        message: 'Available seats must be at least 1.',
      });
    }

    const price = parseFloat(pricePerPassenger);
    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative.',
      });
    }

    // Check if date is in past
    const rideDateObj = new Date(`${date}T23:59:59`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (rideDateObj < today) {
      return res.status(400).json({
        success: false,
        message: 'Ride date cannot be in the past.',
      });
    }

    const ride = await Ride.create({
      driver: req.user._id,
      from: from.trim(),
      to: to.trim(),
      pickupPoint: (pickupPoint || '').trim(),
      dropPoint: (dropPoint || '').trim(),
      date,
      departureTime,
      arrivalTime: (arrivalTime || '').trim(),
      availableSeats: seats,
      totalSeats: seats,
      vehicleType: vehicleType || 'Car',
      vehicleModel: vehicleModel.trim(),
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      pricePerPassenger: price,
      description: (description || '').trim(),
      status: 'scheduled',
    });

    const populatedRide = await Ride.findById(ride._id).populate(
      'driver',
      'fullName email phone rating totalTrips userType collegeName companyName profileImage'
    );

    return res.status(201).json({
      success: true,
      message: 'Ride created successfully!',
      data: populatedRide,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all matching rides with filters and scoring
// @route   GET /api/rides
// @access  Public / Private
const getRides = async (req, res, next) => {
  try {
    const {
      from,
      to,
      date,
      time,
      seats,
      vehicleType,
      minPrice,
      maxPrice,
      sortBy,
      status = 'scheduled',
    } = req.query;

    const query = {
      status,
      availableSeats: { $gt: 0 },
    };

    if (from) {
      query.from = { $regex: from.trim(), $options: 'i' };
    }

    if (to) {
      query.to = { $regex: to.trim(), $options: 'i' };
    }

    if (date) {
      query.date = date;
    }

    if (seats) {
      query.availableSeats = { $gte: parseInt(seats, 10) };
    }

    if (vehicleType && vehicleType !== 'All') {
      query.vehicleType = vehicleType;
    }

    if (minPrice || maxPrice) {
      query.pricePerPassenger = {};
      if (minPrice) query.pricePerPassenger.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerPassenger.$lte = parseFloat(maxPrice);
    }

    let rides = await Ride.find(query)
      .populate(
        'driver',
        'fullName email phone rating totalTrips userType collegeName companyName profileImage'
      )
      .sort({ date: 1, departureTime: 1 })
      .lean();

    // Attach match score to each ride
    rides = rides.map((ride) => {
      const matchScore = calculateMatchScore(ride, from, to, date, time);
      return {
        ...ride,
        matchScore,
      };
    });

    // Custom sorting
    if (sortBy === 'price_low') {
      rides.sort((a, b) => a.pricePerPassenger - b.pricePerPassenger);
    } else if (sortBy === 'price_high') {
      rides.sort((a, b) => b.pricePerPassenger - a.pricePerPassenger);
    } else if (sortBy === 'rating_high') {
      rides.sort((a, b) => (b.driver?.rating || 5) - (a.driver?.rating || 5));
    } else if (sortBy === 'seats_high') {
      rides.sort((a, b) => b.availableSeats - a.availableSeats);
    } else if (sortBy === 'match_score') {
      rides.sort((a, b) => b.matchScore - a.matchScore);
    }

    return res.status(200).json({
      success: true,
      count: rides.length,
      data: rides,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ride details by ID
// @route   GET /api/rides/:id
// @access  Public / Private
const getRideById = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate(
        'driver',
        'fullName email phone rating totalRatings totalTrips userType collegeName companyName department profileImage'
      )
      .populate('passengers.user', 'fullName email phone userType profileImage');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: ride,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ride details
// @route   PUT /api/rides/:id
// @access  Private (Driver only)
const updateRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    if (ride.driver.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this ride.',
      });
    }

    if (['completed', 'cancelled'].includes(ride.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot update a ${ride.status} ride.`,
      });
    }

    const {
      pickupPoint,
      dropPoint,
      departureTime,
      arrivalTime,
      vehicleModel,
      vehicleNumber,
      pricePerPassenger,
      description,
    } = req.body;

    if (pickupPoint !== undefined) ride.pickupPoint = pickupPoint.trim();
    if (dropPoint !== undefined) ride.dropPoint = dropPoint.trim();
    if (departureTime) ride.departureTime = departureTime;
    if (arrivalTime !== undefined) ride.arrivalTime = arrivalTime.trim();
    if (vehicleModel) ride.vehicleModel = vehicleModel.trim();
    if (vehicleNumber) ride.vehicleNumber = vehicleNumber.trim().toUpperCase();
    if (pricePerPassenger !== undefined) ride.pricePerPassenger = parseFloat(pricePerPassenger);
    if (description !== undefined) ride.description = description.trim();

    const updatedRide = await ride.save();

    return res.status(200).json({
      success: true,
      message: 'Ride details updated successfully.',
      data: updatedRide,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a ride
// @route   PUT /api/rides/:id/cancel
// @access  Private (Driver / Admin)
const cancelRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    if (ride.driver.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this ride.',
      });
    }

    if (ride.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This ride is already cancelled.',
      });
    }

    ride.status = 'cancelled';
    await ride.save();

    // Cancel all active bookings for this ride
    const bookings = await Booking.find({
      ride: ride._id,
      status: { $in: ['pending', 'accepted'] },
    });

    for (const booking of bookings) {
      booking.status = 'cancelled';
      await booking.save();

      // Notify passenger
      await Notification.create({
        recipient: booking.passenger,
        sender: req.user._id,
        type: 'ride_cancelled',
        title: 'Ride Cancelled',
        message: `The ride from ${ride.from} to ${ride.to} scheduled on ${ride.date} was cancelled by the driver.`,
        relatedRide: ride._id,
        relatedBooking: booking._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Ride and associated bookings cancelled successfully.',
      data: ride,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark ride completed
// @route   PUT /api/rides/:id/complete
// @access  Private (Driver only)
const completeRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    if (ride.driver.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this ride.',
      });
    }

    if (ride.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'This ride has already been completed.',
      });
    }

    ride.status = 'completed';
    await ride.save();

    // Increment driver's total trips
    await User.findByIdAndUpdate(ride.driver, { $inc: { totalTrips: 1 } });

    // Mark accepted bookings as completed and increment passenger trips
    const acceptedBookings = await Booking.find({
      ride: ride._id,
      status: 'accepted',
    });

    for (const booking of acceptedBookings) {
      booking.status = 'completed';
      booking.completedAt = new Date();
      await booking.save();

      await User.findByIdAndUpdate(booking.passenger, { $inc: { totalTrips: 1 } });

      // Notify passenger with rate reminder
      await Notification.create({
        recipient: booking.passenger,
        sender: req.user._id,
        type: 'ride_completed',
        title: 'Trip Completed 🎉',
        message: `Your ride from ${ride.from} to ${ride.to} is marked complete. Please rate your driver!`,
        relatedRide: ride._id,
        relatedBooking: booking._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Ride marked completed successfully.',
      data: ride,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rides offered by the logged-in user
// @route   GET /api/rides/my/offered
// @access  Private
const getMyOfferedRides = async (req, res, next) => {
  try {
    const rides = await Ride.find({ driver: req.user._id })
      .populate('passengers.user', 'fullName email phone userType profileImage rating')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: rides,
    });
  } catch (error) {
    next(error);
  }
};

// Geocoding dictionary helper for sample/standard cities
const getCityCoords = (cityName, fallbackLat = 16.3067, fallbackLng = 80.4365) => {
  const map = {
    'guntur': { lat: 16.3067, lng: 80.4365, label: 'Guntur' },
    'vijayawada': { lat: 16.5062, lng: 80.6480, label: 'Vijayawada' },
    'tenali': { lat: 16.2435, lng: 80.6400, label: 'Tenali' },
    'amaravati': { lat: 16.5417, lng: 80.5158, label: 'Amaravati' },
    'hyderabad': { lat: 17.3850, lng: 78.4867, label: 'Hyderabad' },
    'visakhapatnam': { lat: 17.6868, lng: 83.2185, label: 'Visakhapatnam' },
    'vizag': { lat: 17.6868, lng: 83.2185, label: 'Visakhapatnam' },
    'tirupati': { lat: 13.6288, lng: 79.4192, label: 'Tirupati' },
    'chennai': { lat: 13.0827, lng: 80.2707, label: 'Chennai' },
    'bangalore': { lat: 12.9716, lng: 77.5946, label: 'Bangalore' },
    'bengaluru': { lat: 12.9716, lng: 77.5946, label: 'Bangalore' },
  };

  const key = (cityName || '').toLowerCase().trim();
  for (const [name, coords] of Object.entries(map)) {
    if (key.includes(name)) return coords;
  }
  return { lat: fallbackLat, lng: fallbackLng, label: cityName || 'Location' };
};

// @desc    Get real-time tracking data & GPS waypoints for a ride
// @route   GET /api/rides/:id/live-tracking
// @access  Public / Private
const getLiveTracking = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('driver', 'fullName phone rating profileImage userType')
      .populate('passengers.user', 'fullName phone');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    const originCoords = getCityCoords(ride.from, 16.3067, 80.4365);
    const destCoords = getCityCoords(ride.to, 16.5062, 80.6480);

    // Calculate interpolated waypoints
    const numWaypoints = 5;
    const waypoints = [];
    for (let i = 0; i <= numWaypoints; i++) {
      const ratio = i / numWaypoints;
      const lat = originCoords.lat + (destCoords.lat - originCoords.lat) * ratio;
      const lng = originCoords.lng + (destCoords.lng - originCoords.lng) * ratio;
      let label = `Checkpoint ${i}`;
      if (i === 0) label = `Origin: ${ride.pickupPoint || ride.from}`;
      else if (i === 1) label = 'Highway Junction Entry';
      else if (i === 2) label = 'Midway Toll Plaza / Express Route';
      else if (i === 3) label = 'City Bypass Interchange';
      else if (i === 4) label = 'Outer Ring Road Approach';
      else if (i === 5) label = `Destination: ${ride.dropPoint || ride.to}`;

      const reached = (ride.currentLocation?.progressPercent || 20) >= (ratio * 100);
      waypoints.push({ index: i, name: label, lat, lng, reached });
    }

    // Interpolate current vehicle coordinates based on progressPercent
    const currentProgress = (ride.currentLocation?.progressPercent || 35) / 100;
    const currentLat = originCoords.lat + (destCoords.lat - originCoords.lat) * currentProgress;
    const currentLng = originCoords.lng + (destCoords.lng - originCoords.lng) * currentProgress;

    // Remaining time calculation
    const totalEstMinutes = 45;
    const remainingMinutes = Math.max(2, Math.round(totalEstMinutes * (1 - currentProgress)));
    const remainingDistanceKm = Math.max(0.5, (38 * (1 - currentProgress)).toFixed(1));

    const trackingData = {
      rideId: ride._id,
      from: ride.from,
      to: ride.to,
      pickupPoint: ride.pickupPoint,
      dropPoint: ride.dropPoint,
      status: ride.status,
      driver: ride.driver,
      vehicle: {
        type: ride.vehicleType,
        model: ride.vehicleModel,
        number: ride.vehicleNumber,
      },
      origin: originCoords,
      destination: destCoords,
      currentPosition: {
        lat: currentLat,
        lng: currentLng,
        address: ride.currentLocation?.address || `En route to ${ride.to}`,
        progressPercent: Math.round(currentProgress * 100),
        speedKmH: ride.currentLocation?.speedKmH || 48,
        etaMinutes: remainingMinutes,
        remainingDistanceKm,
        lastUpdated: ride.currentLocation?.lastUpdated || new Date(),
      },
      waypoints,
    };

    return res.status(200).json({
      success: true,
      data: trackingData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update driver real-time position / advance progress
// @route   PUT /api/rides/:id/live-tracking
// @access  Private (Driver only)
const updateLiveLocation = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    if (ride.driver.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update GPS for this ride.',
      });
    }

    const { progressPercent, speedKmH, address } = req.body;

    if (!ride.currentLocation) ride.currentLocation = {};
    if (progressPercent !== undefined) {
      ride.currentLocation.progressPercent = Math.min(100, Math.max(0, Number(progressPercent)));
    }
    if (speedKmH !== undefined) ride.currentLocation.speedKmH = Number(speedKmH);
    if (address !== undefined) ride.currentLocation.address = address.trim();
    ride.currentLocation.lastUpdated = new Date();

    if (ride.currentLocation.progressPercent >= 100) {
      ride.status = 'completed';
    } else if (ride.currentLocation.progressPercent > 0 && ride.status === 'scheduled') {
      ride.status = 'ongoing';
    }

    await ride.save();

    return res.status(200).json({
      success: true,
      message: 'Live tracking location updated.',
      data: ride.currentLocation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRide,
  getRides,
  getRideById,
  updateRide,
  cancelRide,
  completeRide,
  getMyOfferedRides,
  getLiveTracking,
  updateLiveLocation,
};

