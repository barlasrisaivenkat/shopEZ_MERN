import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopEZ-token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('shopEZ-token', token);
  } else {
    localStorage.removeItem('shopEZ-token');
  }
};

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  getUsers: () => api.get('/auth/users'),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
};

export const categoryApi = {
  list: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  remove: (id) => api.delete(`/categories/${id}`),
};

export const productApi = {
  list: (params) => api.get('/products', { params }),
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
  byCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
};

export const cartApi = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart', data),
  update: (productId, quantity) =>
    api.put(`/cart/${productId}`, { quantity }),
  remove: (productId) => api.delete(`/cart/${productId}`),
  clear: () => api.delete('/cart/clear'),
};

export const wishlistApi = {
  get: () => api.get('/wishlist'),
  add: (productId) => api.post(`/wishlist/${productId}`),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};

export const orderApi = {
  create: (data) => api.post('/orders', data),

  myOrders: () => api.get('/orders/my-orders'),

  get: (id) => api.get(`/orders/${id}`),

  getAll: () => api.get('/orders'),

  updateStatus: (id, status) =>
    api.put(`/orders/${id}/status`, { status }),

  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

export const reviewApi = {
  list: (productId) => api.get(`/reviews/${productId}`),
  create: (productId, data) =>
    api.post(`/reviews/${productId}`, data),
  remove: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

export const paymentApi = {
  methods: () => api.get('/payments/methods'),
  create: (data) => api.post('/payments', data),
  getAll: () => api.get('/payments'),
  collectCOD: (orderId) =>
    api.put(`/payments/cod/${orderId}/collect`),
};

export default api;