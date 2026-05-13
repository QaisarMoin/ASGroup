const WalletTransaction = require('../models/WalletTransaction');
const User = require('../models/User');

/**
 * Credit a user's wallet and create a transaction record
 */
const creditWallet = async (userId, amount, transactionType, description = '', relatedUser = null) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.walletBalance += amount;
  user.totalEarnings += amount;
  await user.save();

  const tx = await WalletTransaction.create({
    userId,
    amount,
    type: 'credit',
    transactionType,
    description,
    status: 'completed',
    relatedUser,
  });

  return tx;
};

/**
 * Debit a user's wallet and create a transaction record
 */
const debitWallet = async (userId, amount, transactionType, description = '') => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (user.walletBalance < amount) {
    throw new Error('Insufficient wallet balance');
  }

  user.walletBalance -= amount;
  await user.save();

  const tx = await WalletTransaction.create({
    userId,
    amount,
    type: 'debit',
    transactionType,
    description,
    status: 'completed',
  });

  return tx;
};

/**
 * Get user wallet balance
 */
const getBalance = async (userId) => {
  const user = await User.findById(userId).select('walletBalance totalEarnings');
  if (!user) throw new Error('User not found');
  return { walletBalance: user.walletBalance, totalEarnings: user.totalEarnings };
};

/**
 * Get user transactions with pagination
 */
const getTransactions = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [transactions, total] = await Promise.all([
    WalletTransaction.find({ userId })
      .populate('relatedUser', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    WalletTransaction.countDocuments({ userId }),
  ]);
  return { transactions, total, page, pages: Math.ceil(total / limit) };
};

module.exports = { creditWallet, debitWallet, getBalance, getTransactions };
