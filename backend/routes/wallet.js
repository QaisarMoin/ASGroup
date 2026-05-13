const express = require('express');
const router = express.Router();
const { getWalletBalance, getWalletTransactions, depositMoney, investMoney } = require('../controllers/walletController');
const { protect } = require('../middleware/authMiddleware');

router.get('/balance', protect, getWalletBalance);
router.get('/transactions', protect, getWalletTransactions);
router.post('/deposit', protect, depositMoney);
router.post('/invest', protect, investMoney);

module.exports = router;
