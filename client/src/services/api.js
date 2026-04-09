// ===========================================
// API Service Layer
// ===========================================
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---- Auth API ----
export const authAPI = {
  getCurrentUser: () => api.get('/auth/me'),
  demoLogin: (data) => api.post('/auth/demo-login', data),
  logout: () => api.post('/auth/logout'),
  getGoogleAuthUrl: () => `${api.defaults.baseURL}/auth/google`,
};

// ---- Cakes API ----
export const cakesAPI = {
  getAll: (params) => api.get('/cakes', { params }),
  getById: (id) => api.get(`/cakes/${id}`),
  getFeatured: () => api.get('/cakes/featured'),
  getCategories: () => api.get('/cakes/categories'),
  getRecommendations: (params) => api.get('/cakes/recommend', { params }),
};

// ---- Cart API ----
export const cartAPI = {
  get: () => api.get('/cart'),
  addItem: (data) => api.post('/cart', data),
  updateItem: (itemId, data) => api.put(`/cart/${itemId}`, data),
  removeItem: (itemId) => api.delete(`/cart/${itemId}`),
  clear: () => api.delete('/cart'),
};

// ---- Orders API ----
export const ordersAPI = {
  create: (data) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
};

// ---- Payment API (Razorpay) ----
export const paymentAPI = {
  createOrder: (data) => api.post('/payment/create-order', data),
  verify: (data) => api.post('/payment/verify', data),
};

// ---- Chatbot API ----
export const chatbotAPI = {
  sendMessage: (data) => api.post('/chatbot', data),
};

export default api;
