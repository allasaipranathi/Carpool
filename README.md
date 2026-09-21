# 🚗 CarPool Connect

> **Smart, Secure & Sustainable Peer-to-Peer Carpooling for College Students and Working Professionals.**

CarPool Connect is a full-stack web application designed for students and corporate employees who travel along similar daily routes. Users can offer empty vehicle seats, search for matching commutes, request seats with automated route scoring, safely track emergencies, split fuel expenses, and rate fellow community members.

---

## 🚀 Key Features

- **🔐 Verified Authentication & Role Access:**
  - Role-based accounts for **College Students** (College name, Department, Year of study) and **Office Employees** (Company name, Department).
  - Secure password encryption with `bcryptjs` and stateless JWT authorization.
  - Role separation with `user` and `admin` permissions.

- **🗺️ Intelligent Route Matching & Discovery:**
  - Instant route match percentage score calculated based on source, destination, travel date, and departure hours.
  - Multi-parameter filtering by vehicle type, seat availability, and custom sorting (Best Match, Lowest Price, Highest Rating).

- **💺 Dynamic Booking & Seat Lifecycle:**
  - One-click seat join requests with live contribution price calculation.
  - Driver request management (Accept/Decline) with automated atomic seat count updates.
  - Prevention of self-booking, duplicate requests, or race-condition overbooking.

- **⭐ Community Rating & Reviews:**
  - 5-star ratings and written reviews after trip completions.
  - Real-time recalculation of user average ratings and total completed trip counters.

- **🚨 Safety & Emergency Contact Integration:**
  - Profile-level emergency contact setup (Name, Relationship, Phone).
  - One-tap emergency contact dialer on active trip dashboards.

- **🔗 1-Click Trip Sharing:**
  - Formats and copies a complete trip itinerary reference link to clipboard with one click.

- **🔔 In-App Notifications & Badges:**
  - Live alerts for new join requests, ride approvals, trip cancellations, and review reminders with unread counters.

- **🛡️ Comprehensive Admin Dashboard:**
  - Real-time telemetry (Total Users, Total Rides, Active Rides, Completed Trips, Cancelled Trips, Total Bookings).
  - Searchable user moderation (one-click activation/deactivation).
  - Platform-wide ride moderation and cancellation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM v6, Axios, Lucide React Icons |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, CORS, dotenv |
| **Database** | MongoDB & Mongoose ORM |
| **Deployment** | Vercel (Frontend), Render (Backend), MongoDB Atlas (Cloud DB) |

---

## 📂 Project Structure

```text
carpool-connect/
│
├── client/                      # React Frontend Application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── RideCard.jsx
│   │   │   ├── RideSearch.jsx
│   │   │   ├── UserCard.jsx
│   │   │   ├── RatingStars.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ConfirmationModal.jsx
│   │   │   ├── EmergencyModal.jsx
│   │   │   ├── ShareTripModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/               # Application Route Pages
│   │   │   ├── Landing.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── FindRide.jsx
│   │   │   ├── OfferRide.jsx
│   │   │   ├── RideDetails.jsx
│   │   │   ├── MyTrips.jsx
│   │   │   ├── MyRides.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Admin.jsx
│   │   │   └── NotFound.jsx
│   │   ├── context/             # Global State
│   │   │   ├── AuthContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── services/
│   │   │   └── api.js           # Central Axios HTTP Client
│   │   ├── App.jsx              # Router & Route declarations
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Express REST API Server
│   ├── config/
│   │   └── db.js                # MongoDB Mongoose Connection
│   ├── controllers/             # Business Logic Controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── rideController.js
│   │   ├── bookingController.js
│   │   ├── ratingController.js
│   │   ├── notificationController.js
│   │   └── adminController.js
│   ├── models/                  # Mongoose Schemas
│   │   ├── User.js
│   │   ├── Ride.js
│   │   ├── Booking.js
│   │   ├── Rating.js
│   │   └── Notification.js
│   ├── routes/                  # Express Routers
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── rideRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── ratingRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── adminMiddleware.js
│   │   └── errorMiddleware.js
│   ├── seed.js                  # Database demo seeder
│   ├── server.js                # Express App Entrypoint
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/carpool_connect
JWT_SECRET=carpool_connect_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Seed demo users and sample rides
node seed.js

# Start the server
npm run dev   # or npm start
```
*Backend runs on `http://localhost:5000` with confirmation `MongoDB connected successfully`.*

### 3. Frontend Setup
```bash
# In a separate terminal, navigate to client directory
cd client

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 👥 Demo Test Accounts

All demo accounts share the password: `Password123!`

| Role | Email | User Type | Details |
|---|---|---|---|
| **College Student** | `sai@carpool.com` | College Student | Vignan University, Guntur (3rd Year CSE) |
| **Office Employee** | `rohit@carpool.com` | Office Employee | Tech Mahindra, Vijayawada |
| **College Student** | `priya@carpool.com` | College Student | KL University, Vaddeswaram |
| **Office Employee** | `rahul@carpool.com` | Office Employee | HCL Technologies, Vijayawada |
| **Platform Admin** | `admin@carpool.com` | Office Employee | Platform Operations (Access to `/admin`) |

---

## 📡 REST API Reference

### 🔐 Authentication
- `POST /api/auth/register` - Create new student or employee account
- `POST /api/auth/login` - Authenticate and receive JWT token
- `GET /api/auth/me` - Get currently authenticated user *(Protected)*
- `PUT /api/auth/change-password` - Update account password *(Protected)*

### 👤 Users & Profile
- `GET /api/users/profile` - Get detailed user profile *(Protected)*
- `PUT /api/users/profile` - Update profile & affiliation info *(Protected)*
- `PUT /api/users/emergency-contact` - Set emergency contact info *(Protected)*

### 🚗 Rides
- `POST /api/rides` - Publish a new carpool ride *(Protected)*
- `GET /api/rides` - Search matching rides with route scoring *(Public/Protected)*
- `GET /api/rides/:id` - Get full ride itinerary & passengers *(Public/Protected)*
- `PUT /api/rides/:id` - Update ride specifications *(Driver only)*
- `PUT /api/rides/:id/cancel` - Cancel a scheduled ride *(Driver/Admin)*
- `PUT /api/rides/:id/complete` - Conclude ride and trigger ratings *(Driver only)*
- `GET /api/rides/my/offered` - Get all rides offered by user *(Protected)*

### 🎫 Bookings & Requests
- `POST /api/bookings` - Submit a ride join request *(Protected)*
- `GET /api/bookings/my` - Get passenger travel bookings *(Protected)*
- `GET /api/bookings/ride/:rideId` - Get requests for driver ride *(Driver only)*
- `PUT /api/bookings/:id/accept` - Accept request & decrement seats *(Driver only)*
- `PUT /api/bookings/:id/reject` - Decline request *(Driver only)*
- `PUT /api/bookings/:id/cancel` - Cancel confirmed booking *(Protected)*

### ⭐ Ratings & Reviews
- `POST /api/ratings` - Submit peer rating & review *(Protected)*
- `GET /api/ratings/user/:userId` - Get user's rating history *(Public/Protected)*

### 🔔 Notifications
- `GET /api/notifications` - Get all user alerts *(Protected)*
- `GET /api/notifications/unread-count` - Get unread count *(Protected)*
- `PUT /api/notifications/:id/read` - Mark single alert as read *(Protected)*
- `PUT /api/notifications/read-all` - Mark all alerts as read *(Protected)*

### 🛡️ Admin Moderation
- `GET /api/admin/dashboard` - Platform statistics & metrics *(Admin only)*
- `GET /api/admin/users` - Search & manage users *(Admin only)*
- `PUT /api/admin/users/:id/deactivate` - Toggle user active status *(Admin only)*
- `GET /api/admin/rides` - View all platform rides *(Admin only)*
- `DELETE /api/admin/rides/:id` - Moderation cancel ride *(Admin only)*

---

## ☁️ Deployment Instructions

### 1. MongoDB Atlas Setup
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and allow network access (`0.0.0.0/0`).
3. Copy your connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/carpool_connect?retryWrites=true&w=majority`.

### 2. Backend Deployment to Render
1. Push your repository to GitHub.
2. Log in to [Render](https://render.com/) and create a **New Web Service**.
3. Connect your repository and configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables in Render:
   - `PORT`: `5000`
   - `MONGODB_URI`: `<Your MongoDB Atlas URI>`
   - `JWT_SECRET`: `<Your Production Secret>`
   - `CLIENT_URL`: `<Your Vercel Frontend URL>`
   - `NODE_ENV`: `production`

### 3. Frontend Deployment to Vercel
1. Log in to [Vercel](https://vercel.com/) and import your GitHub repository.
2. Configure:
   - **Root Directory:** `client`
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add Environment Variable in Vercel:
   - `VITE_API_BASE_URL`: `https://<your-render-backend-url>.onrender.com/api`
4. Deploy!

---

## 🔮 Future Enhancements
- Live GPS tracking with Mapbox / Google Maps SDK.
- Integrated UPI payments & digital in-app escrow.
- Real-time WebSockets co-passenger chat.
- Campus ID card OCR auto-verification.
