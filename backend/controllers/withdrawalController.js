const WithdrawalRequest = require('../models/WithdrawalRequest');
const { debitWallet, creditWallet } = require('../services/walletService');
const User = require('../models/User');

// @desc Create withdrawal request
// @route POST /api/withdrawal/request
const createWithdrawal = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount < 100) {
      return res.status(400).json({ success: false, message: 'Minimum withdrawal amount is ₹100' });
    }

    const user = await User.findById(req.user._id);
    if (user.walletBalance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    // Check pending withdrawal
    const pending = await WithdrawalRequest.findOne({ userId: req.user._id, status: 'pending' });
    if (pending) {
      return res.status(400).json({ success: false, message: 'You already have a pending withdrawal request' });
    }

    // Debit wallet immediately and hold
    await debitWallet(req.user._id, amount, 'withdrawal', `Withdrawal request of ₹${amount}`);

    const request = await WithdrawalRequest.create({ userId: req.user._id, amount });

    res.status(201).json({ success: true, message: 'Withdrawal request submitted', request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Withdrawal failed' });
  }
};

// @desc Get my withdrawal requests
// @route GET /api/withdrawal/my
const getMyWithdrawals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      WithdrawalRequest.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      WithdrawalRequest.countDocuments({ userId: req.user._id }),
    ]);

    res.json({ success: true, requests, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get withdrawals' });
  }
};

module.exports = { createWithdrawal, getMyWithdrawals };
