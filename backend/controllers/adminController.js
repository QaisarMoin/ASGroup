const User = require('../models/User');
const KYC = require('../models/KYC');
const WalletTransaction = require('../models/WalletTransaction');
const WithdrawalRequest = require('../models/WithdrawalRequest');
const { creditWallet, debitWallet } = require('../services/walletService');
const { getCommissionSettings, updateCommissionSettings } = require('../services/commissionService');

// @desc Get dashboard stats
// @route GET /api/admin/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, activeUsers, pendingKYC, approvedKYC, pendingWithdrawals, transactions] =
      await Promise.all([
        User.countDocuments({ role: 'user' }),
        User.countDocuments({ role: 'user', isActive: true }),
        KYC.countDocuments({ status: 'pending' }),
        KYC.countDocuments({ status: 'approved' }),
        WithdrawalRequest.countDocuments({ status: 'pending' }),
        WalletTransaction.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'fullName email'),
      ]);

    const totalPayouts = await WalletTransaction.aggregate([
      { $match: { type: 'debit', transactionType: 'withdrawal' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalEarnings = await WalletTransaction.aggregate([
      { $match: { type: 'credit' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Monthly user growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyGrowth = await User.aggregate([
      { $match: { role: 'user', createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        pendingKYC,
        approvedKYC,
        pendingWithdrawals,
        totalPayouts: totalPayouts[0]?.total || 0,
        totalEarnings: totalEarnings[0]?.total || 0,
      },
      recentTransactions: transactions,
      monthlyGrowth,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Dashboard error' });
  }
};

// @desc Get all users with pagination and search
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = {
      role: 'user',
      ...(search && {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { referralCode: { $regex: search, $options: 'i' } },
        ],
      }),
    };

    const [users, total] = await Promise.all([
      User.find(query)
        .populate('referredBy', 'fullName email')
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ]);

    res.json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get users' });
  }
};

// @desc Toggle user active status
// @route PUT /api/admin/users/:id/toggle-status
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle status' });
  }
};

// @desc Get all KYC requests
// @route GET /api/admin/kyc
const getAllKYC = async (req, res) => {
  try {
    const status = req.query.status;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = status ? { status } : {};
    const [kycs, total] = await Promise.all([
      KYC.find(query)
        .populate('userId', 'fullName email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      KYC.countDocuments(query),
    ]);

    res.json({ success: true, kycs, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get KYC list' });
  }
};

// @desc Update KYC status
// @route PUT /api/admin/kyc/:id
const updateKYCStatus = async (req, res) => {
  try {
    const { status, adminRemark } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const kyc = await KYC.findByIdAndUpdate(
      req.params.id,
      { status, adminRemark: adminRemark || '' },
      { new: true }
    ).populate('userId', 'fullName email');

    if (!kyc) return res.status(404).json({ success: false, message: 'KYC not found' });

    res.json({ success: true, message: `KYC ${status}`, kyc });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update KYC' });
  }
};

// @desc Adjust user wallet (via Phone Number)
// @route PUT /api/admin/wallet-adjustment
const adjustWallet = async (req, res) => {
  try {
    const { phone, amount, type, description } = req.body;

    if (!phone || !amount || !type) {
      return res.status(400).json({ success: false, message: 'Phone, amount, and type required' });
    }

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ success: false, message: 'User with this phone number not found' });

    if (type === 'credit') {
      await creditWallet(user._id, parseFloat(amount), 'admin_adjustment', description || 'Admin credit');
    } else {
      await debitWallet(user._id, parseFloat(amount), 'admin_adjustment', description || 'Admin debit');
    }

    const updatedUser = await User.findById(user._id).select('fullName phone walletBalance totalEarnings');
    res.json({ success: true, message: `Successfully adjusted wallet for ${updatedUser.fullName}`, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Wallet adjustment failed' });
  }
};

// @desc Get commission settings
// @route GET /api/admin/commission
const getCommission = async (req, res) => {
  try {
    const settings = await getCommissionSettings();
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get commission settings' });
  }
};

// @desc Update commission settings
// @route PUT /api/admin/commission
const updateCommission = async (req, res) => {
  try {
    const settings = await updateCommissionSettings(req.body);
    res.json({ success: true, message: 'Commission settings updated', settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update commission' });
  }
};

// @desc Get all transactions
// @route GET /api/admin/transactions
const getAllTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type;

    const query = type ? { transactionType: type } : {};
    const [transactions, total] = await Promise.all([
      WalletTransaction.find(query)
        .populate('userId', 'fullName email')
        .populate('relatedUser', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      WalletTransaction.countDocuments(query),
    ]);

    res.json({ success: true, transactions, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get transactions' });
  }
};

// @desc Get all withdrawal requests
// @route GET /api/admin/withdrawals
const getAllWithdrawals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const query = status ? { status } : {};
    const [requests, total] = await Promise.all([
      WithdrawalRequest.find(query)
        .populate('userId', 'fullName email phone walletBalance')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      WithdrawalRequest.countDocuments(query),
    ]);

    res.json({ success: true, requests, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get withdrawals' });
  }
};

// @desc Approve/Reject withdrawal
// @route PUT /api/admin/withdrawals/:id
const processWithdrawal = async (req, res) => {
  try {
    const { status, adminRemark } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const request = await WithdrawalRequest.findById(req.params.id).populate('userId');
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Request already processed' });
    }

    request.status = status;
    request.adminRemark = adminRemark || '';
    request.processedAt = new Date();
    await request.save();

    // If rejected, refund the wallet
    if (status === 'rejected') {
      await creditWallet(
        request.userId._id,
        request.amount,
        'withdrawal_reject',
        `Withdrawal rejected: ${adminRemark || 'No reason provided'}`
      );
    }

    res.json({ success: true, message: `Withdrawal ${status}`, request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process withdrawal' });
  }
};

module.exports = {
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
};
