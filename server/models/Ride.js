const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    from: {
      type: String,
      required: [true, 'Please provide origin location'],
      trim: true,
    },
    to: {
      type: String,
      required: [true, 'Please provide destination location'],
      trim: true,
    },
    pickupPoint: {
      type: String,
      trim: true,
      default: '',
    },
    dropPoint: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: String,
      required: [true, 'Please provide ride date (YYYY-MM-DD)'],
    },
    departureTime: {
      type: String,
      required: [true, 'Please provide departure time'],
    },
    arrivalTime: {
      type: String,
      trim: true,
      default: '',
    },
    availableSeats: {
      type: Number,
      required: [true, 'Please provide available seats count'],
      min: [0, 'Available seats cannot be negative'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Please provide total seats count'],
      min: [1, 'Total seats must be at least 1'],
    },
    vehicleType: {
      type: String,
      required: [true, 'Please specify vehicle type'],
      enum: ['Car', 'Bike', 'Auto', 'Other'],
      default: 'Car',
    },
    vehicleModel: {
      type: String,
      required: [true, 'Please specify vehicle model'],
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Please provide vehicle registration number'],
      trim: true,
    },
    pricePerPassenger: {
      type: Number,
      required: [true, 'Please specify price per passenger'],
      min: [0, 'Price cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    passengers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        booking: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Booking',
        },
        seats: {
          type: Number,
          default: 1,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    currentLocation: {
      lat: { type: Number, default: 16.3067 },
      lng: { type: Number, default: 80.4365 },
      address: { type: String, default: 'Laxmipuram Junction, Guntur' },
      checkpointIndex: { type: Number, default: 0 },
      progressPercent: { type: Number, default: 15 },
      etaMinutes: { type: Number, default: 25 },
      speedKmH: { type: Number, default: 42 },
      lastUpdated: { type: Date, default: Date.now },
    },
    waypoints: [
      {
        name: { type: String },
        lat: { type: Number },
        lng: { type: Number },
        reached: { type: Boolean, default: false },
      },
    ],
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient route & date queries
rideSchema.index({ from: 'text', to: 'text' });
rideSchema.index({ date: 1, status: 1 });

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
