import axios from 'axios';

export const BACKEND_URL = 'https://asgroup-9icv.onrender.com';

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('asgroup_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — handle 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('asgroup_token');
      localStorage.removeItem('asgroup_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  me: () => API.get('/auth/me'),
  logout: () => API.post('/auth/logout'),
};

// User
export const userAPI = {
  getProfile: () => API.get('/user/profile'),
  updateProfile: (data) => API.put('/user/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data) => API.put('/user/change-password', data),
};

// Wallet
export const walletAPI = {
  getBalance: () => API.get('/wallet/balance'),
  getTransactions: (params) => API.get('/wallet/transactions', { params }),
  deposit: (amount) => API.post('/wallet/deposit', { amount }),
  invest: (amount) => API.post('/wallet/invest', { amount }),
};

// KYC
export const kycAPI = {
  upload: (data) => API.post('/kyc/upload', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getStatus: () => API.get('/kyc/status'),
};

// Team
export const teamAPI = {
  getDirect: (params) => API.get('/team/direct', { params }),
  getTree: () => API.get('/team/tree'),
};

// Withdrawal
export const withdrawalAPI = {
  create: (data) => API.post('/withdrawal/request', data),
  getMy: (params) => API.get('/withdrawal/my', { params }),
};

// Admin
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: (params) => API.get('/admin/users', { params }),
  toggleUserStatus: (id) => API.put(`/admin/users/${id}/toggle-status`),
  getKYC: (params) => API.get('/admin/kyc', { params }),
  updateKYC: (id, data) => API.put(`/admin/kyc/${id}`, data),
  adjustWallet: (data) => API.put('/admin/wallet-adjustment', data),
  getCommission: () => API.get('/admin/commission'),
  updateCommission: (data) => API.put('/admin/commission', data),
  getTransactions: (params) => API.get('/admin/transactions', { params }),
  getWithdrawals: (params) => API.get('/admin/withdrawals', { params }),
  processWithdrawal: (id, data) => API.put(`/admin/withdrawals/${id}`, data),
};

export default API;
