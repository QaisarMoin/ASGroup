const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAllKYC,
  updateKYCStatus,
  adjustWallet,
  getCommission,
  updateCommission,
  getAllTransactions,
  getAllWithdrawals,
  processWithdrawal,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/kyc', getAllKYC);
router.put('/kyc/:id', updateKYCStatus);
router.put('/wallet-adjustment', adjustWallet);
router.get('/commission', getCommission);
router.put('/commission', updateCommission);
router.get('/transactions', getAllTransactions);
router.get('/withdrawals', getAllWithdrawals);
router.put('/withdrawals/:id', processWithdrawal);

module.exports = router;
