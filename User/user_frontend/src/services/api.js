import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Booking APIs
export const bookingAPI = {
  createBooking: (bookingData) => api.post('/booking/create', bookingData),
  getUserBookings: (userId) => api.get(`/booking/user/${userId}`),
  getBookingStatus: (bookingId) => api.get(`/booking/${bookingId}`),
};

// OTP APIs
export const otpAPI = {
  verify: ({ bookingId, otpCode }) => api.post('/otp/verify', { bookingId, otpCode }),
};

// Ambulance location
export const ambulanceAPI = {
  getLocationByBooking: (bookingId) => api.get(`/ambulances/location/by-booking/${bookingId}`),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
};

export default api;
