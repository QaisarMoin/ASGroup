const { getBalance, getTransactions, creditWallet, debitWallet } = require('../services/walletService');
const { distributeJoiningCommissions } = require('../services/commissionService');
const User = require('../models/User');

// @desc Get wallet balance
// @route GET /api/wallet/balance
const getWalletBalance = async (req, res) => {
  try {
    const data = await getBalance(req.user._id);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get wallet balance' });
  }
};

// @desc Get transaction history
// @route GET /api/wallet/transactions
const getWalletTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const data = await getTransactions(req.user._id, page, limit);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get transactions' });
  }
};

// @desc Demo deposit
// @route POST /api/wallet/deposit
const depositMoney = async (req, res) => {
  try {
    console.log(`[Wallet] Deposit attempt for user ${req.user._id}, amount: ${req.body.amount}`);
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });

    await creditWallet(req.user._id, parseFloat(amount), 'deposit', 'Demo wallet deposit');
    const data = await getBalance(req.user._id);
    console.log(`[Wallet] Deposit successful for user ${req.user._id}`);
    res.json({ success: true, message: 'Deposit successful!', ...data });
  } catch (error) {
    console.error('[Wallet] Deposit error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Invest and trigger MLM commissions
// @route POST /api/wallet/invest
const investMoney = async (req, res) => {
  try {
    console.log(`[Wallet] Investment attempt for user ${req.user._id}, amount: ${req.body.amount}`);
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });

    const user = await User.findById(req.user._id);
    if (user.walletBalance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
    }

    // Deduct money
    await debitWallet(req.user._id, parseFloat(amount), 'investment', 'Package investment');

    // Distribute commissions to upline
    if (user.referredBy) {
      console.log(`[Wallet] Distributing commissions for investment by ${user._id}`);
      await distributeJoiningCommissions(user._id, user.referredBy, amount, 'investment');
    }

    const data = await getBalance(req.user._id);
    console.log(`[Wallet] Investment cycle complete for user ${req.user._id}`);
    res.json({ success: true, message: 'Investment successful and commissions distributed!', ...data });
  } catch (error) {
    console.error('[Wallet] Investment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getWalletBalance, getWalletTransactions, depositMoney, investMoney };
