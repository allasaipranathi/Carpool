import axios from 'axios';

// Resolve API base URL with fallback to local development backend on port 5000
const rawBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const cleanBase = rawBase.replace(/\/+$/, '');
const API_BASE_URL = cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('carpool_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthPath = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthPath) {
        localStorage.removeItem('carpool_token');
        localStorage.removeItem('carpool_user');
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth Endpoints ---
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const changePassword = async (passwords) => {
  const response = await api.put('/auth/change-password', passwords);
  return response.data;
};

// --- User Profile Endpoints ---
export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (profileData) => {
  const response = await api.put('/users/profile', profileData);
  return response.data;
};

export const updateEmergencyContact = async (contactData) => {
  const response = await api.put('/users/emergency-contact', contactData);
  return response.data;
};

// --- Ride Endpoints ---
export const createRide = async (rideData) => {
  const response = await api.post('/rides', rideData);
  return response.data;
};

export const getRides = async (params = {}) => {
  const response = await api.get('/rides', { params });
  return response.data;
};

export const getRideById = async (id) => {
  const response = await api.get(`/rides/${id}`);
  return response.data;
};

export const updateRide = async (id, rideData) => {
  const response = await api.put(`/rides/${id}`, rideData);
  return response.data;
};

export const cancelRide = async (id) => {
  const response = await api.put(`/rides/${id}/cancel`);
  return response.data;
};

export const completeRide = async (id) => {
  const response = await api.put(`/rides/${id}/complete`);
  return response.data;
};

export const getMyOfferedRides = async () => {
  const response = await api.get('/rides/my/offered');
  return response.data;
};

export const getLiveTracking = async (id) => {
  const response = await api.get(`/rides/${id}/live-tracking`);
  return response.data;
};

export const updateLiveLocation = async (id, locationData) => {
  const response = await api.put(`/rides/${id}/live-tracking`, locationData);
  return response.data;
};

// --- Booking Endpoints ---
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get('/bookings/my');
  return response.data;
};

export const getRideBookings = async (rideId) => {
  const response = await api.get(`/bookings/ride/${rideId}`);
  return response.data;
};

export const acceptBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/accept`);
  return response.data;
};

export const rejectBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/reject`);
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/cancel`);
  return response.data;
};

// --- Rating Endpoints ---
export const createRating = async (ratingData) => {
  const response = await api.post('/ratings', ratingData);
  return response.data;
};

export const getUserRatings = async (userId) => {
  const response = await api.get(`/ratings/user/${userId}`);
  return response.data;
};

// --- Notification Endpoints ---
export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.put('/notifications/read-all');
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count');
  return response.data;
};

// --- Admin Endpoints ---
export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const toggleUserStatus = async (id) => {
  const response = await api.put(`/admin/users/${id}/deactivate`);
  return response.data;
};

export const getAdminRides = async (params = {}) => {
  const response = await api.get('/admin/rides', { params });
  return response.data;
};

export const adminCancelRide = async (id) => {
  const response = await api.delete(`/admin/rides/${id}`);
  return response.data;
};

export default api;
