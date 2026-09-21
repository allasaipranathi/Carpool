const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Ride = require('./models/Ride');
const Booking = require('./models/Booking');
const Rating = require('./models/Rating');
const Notification = require('./models/Notification');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/carpool_connect');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Ride.deleteMany({});
    await Booking.deleteMany({});
    await Rating.deleteMany({});
    await Notification.deleteMany({});
    console.log('Cleared existing database records.');

    // Common password for demo accounts
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123!', salt);

    // Create Demo Users
    const users = await User.insertMany([
      {
        fullName: 'Sai Pranathi',
        email: 'sai@carpool.com',
        phone: '+91 9876543210',
        password: hashedPassword,
        userType: 'College Student',
        collegeName: 'Vignan University, Guntur',
        department: 'Computer Science & Engineering',
        yearOfStudy: '3rd Year',
        rating: 4.9,
        totalRatings: 18,
        totalTrips: 14,
        emergencyContact: {
          name: 'Ravi Kumar (Father)',
          relationship: 'Parent',
          phone: '+91 9876500001',
        },
        role: 'user',
        isActive: true,
      },
      {
        fullName: 'Rohit Varma',
        email: 'rohit@carpool.com',
        phone: '+91 9876543211',
        password: hashedPassword,
        userType: 'Office Employee',
        companyName: 'Tech Mahindra, Vijayawada',
        department: 'Software Engineering',
        rating: 4.8,
        totalRatings: 26,
        totalTrips: 22,
        emergencyContact: {
          name: 'Sunita Varma (Spouse)',
          relationship: 'Spouse',
          phone: '+91 9876500002',
        },
        role: 'user',
        isActive: true,
      },
      {
        fullName: 'Priya Sharma',
        email: 'priya@carpool.com',
        phone: '+91 9876543212',
        password: hashedPassword,
        userType: 'College Student',
        collegeName: 'KL University, Vaddeswaram',
        department: 'Electronics & Communication',
        yearOfStudy: '4th Year',
        rating: 4.9,
        totalRatings: 12,
        totalTrips: 9,
        emergencyContact: {
          name: 'Anjali Sharma (Mother)',
          relationship: 'Parent',
          phone: '+91 9876500003',
        },
        role: 'user',
        isActive: true,
      },
      {
        fullName: 'Rahul Reddy',
        email: 'rahul@carpool.com',
        phone: '+91 9876543213',
        password: hashedPassword,
        userType: 'Office Employee',
        companyName: 'HCL Technologies, Vijayawada',
        department: 'Cloud Infrastructure',
        rating: 4.7,
        totalRatings: 15,
        totalTrips: 11,
        emergencyContact: {
          name: 'Suresh Reddy (Brother)',
          relationship: 'Sibling',
          phone: '+91 9876500004',
        },
        role: 'user',
        isActive: true,
      },
      {
        fullName: 'Platform Admin',
        email: 'admin@carpool.com',
        phone: '+91 9999988888',
        password: hashedPassword,
        userType: 'Office Employee',
        companyName: 'CarPool Connect HQ',
        department: 'Platform Operations',
        rating: 5.0,
        totalRatings: 5,
        totalTrips: 4,
        emergencyContact: {
          name: 'Support Line',
          relationship: 'Corporate',
          phone: '+91 9999900000',
        },
        role: 'admin',
        isActive: true,
      },
    ]);

    const [sai, rohit, priya, rahul, admin] = users;

    // Tomorrow's date formatted as YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    const dayAfterStr = dayAfter.toISOString().split('T')[0];

    // Create Sample Rides
    const rides = await Ride.insertMany([
      {
        driver: rohit._id,
        from: 'Guntur',
        to: 'Vijayawada',
        pickupPoint: 'Laxmipuram Junction / Bus Stand',
        dropPoint: 'Benz Circle / Tech Mahindra Campus',
        date: dateStr,
        departureTime: '08:00',
        arrivalTime: '08:50',
        availableSeats: 3,
        totalSeats: 4,
        vehicleType: 'Car',
        vehicleModel: 'Hyundai Creta (White)',
        vehicleNumber: 'AP 07 BK 4521',
        pricePerPassenger: 100,
        description: 'Daily office commute. AC available, clean car, music friendly.',
        status: 'scheduled',
      },
      {
        driver: rahul._id,
        from: 'Guntur',
        to: 'Vijayawada',
        pickupPoint: 'NTR Stadium / Collector Office',
        dropPoint: 'Autonagar / HCL Tech Gate 2',
        date: dateStr,
        departureTime: '08:15',
        arrivalTime: '09:05',
        availableSeats: 2,
        totalSeats: 3,
        vehicleType: 'Car',
        vehicleModel: 'Maruti Suzuki Baleno (Grey)',
        vehicleNumber: 'AP 07 CQ 8823',
        pricePerPassenger: 90,
        description: 'Morning commute via National Highway. No smoking.',
        status: 'scheduled',
      },
      {
        driver: sai._id,
        from: 'Guntur',
        to: 'Tenali',
        pickupPoint: 'Arundelpet 3rd Line',
        dropPoint: 'Tenali Railway Station / Main Market',
        date: dateStr,
        departureTime: '09:30',
        arrivalTime: '10:05',
        availableSeats: 3,
        totalSeats: 4,
        vehicleType: 'Car',
        vehicleModel: 'Tata Nexon (Blue)',
        vehicleNumber: 'AP 07 DF 1092',
        pricePerPassenger: 60,
        description: 'College student group carpool. Happy to drop along main road.',
        status: 'scheduled',
      },
      {
        driver: priya._id,
        from: 'Vijayawada',
        to: 'Guntur',
        pickupPoint: 'MG Road / Trendset Mall',
        dropPoint: 'Vignan College Campus / Gujjanagundla',
        date: dayAfterStr,
        departureTime: '08:30',
        arrivalTime: '09:20',
        availableSeats: 3,
        totalSeats: 3,
        vehicleType: 'Car',
        vehicleModel: 'Honda City (Silver)',
        vehicleNumber: 'AP 16 EZ 9931',
        pricePerPassenger: 110,
        description: 'College morning commute. Safe and quiet drive.',
        status: 'scheduled',
      },
      {
        driver: rohit._id,
        from: 'Guntur',
        to: 'Amaravati',
        pickupPoint: 'Gorantla Inner Ring Road',
        dropPoint: 'Secretariat Gate / Velagapudi',
        date: dayAfterStr,
        departureTime: '08:45',
        arrivalTime: '09:35',
        availableSeats: 3,
        totalSeats: 4,
        vehicleType: 'Car',
        vehicleModel: 'Hyundai Creta',
        vehicleNumber: 'AP 07 BK 4521',
        pricePerPassenger: 120,
        description: 'Comfortable ride with AC for government & corporate employees.',
        status: 'scheduled',
      },
    ]);

    // Create Sample Booking (Sai requested a seat on Rohit's ride)
    const sampleBooking = await Booking.create({
      ride: rides[0]._id,
      passenger: sai._id,
      driver: rohit._id,
      seatsBooked: 1,
      totalPrice: 100,
      pickupPoint: 'Laxmipuram Junction',
      dropPoint: 'Benz Circle',
      notes: 'Will be waiting near the ICICI ATM.',
      status: 'pending',
    });

    // Create Notification for Rohit
    await Notification.create({
      recipient: rohit._id,
      sender: sai._id,
      type: 'request_received',
      title: 'New Ride Request 🚗',
      message: 'Sai Pranathi requested 1 seat for your trip from Guntur to Vijayawada.',
      relatedRide: rides[0]._id,
      relatedBooking: sampleBooking._id,
    });

    console.log('Database seeded successfully with 5 users, 5 active rides, and sample booking.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
