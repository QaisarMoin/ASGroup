const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const WalletTransaction = require('../models/WalletTransaction');
const { buildTreeEntry, updateReferralCounts, findByReferralCode } = require('../services/referralService');
const { distributeJoiningCommissions } = require('../services/commissionService');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// @desc Register new user
// @route POST /api/auth/register
const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, referralCode, joiningAmount } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Resolve referrer
    let referrer = null;
    if (referralCode) {
      referrer = await findByReferralCode(referralCode);
      if (!referrer) {
        return res.status(400).json({ success: false, message: 'Invalid referral code' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const amount = parseFloat(joiningAmount) || 1000;

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      referredBy: referrer ? referrer._id : null,
      joiningAmount: amount,
      walletBalance: amount, // Initialize wallet balance with joining amount
    });

    // Create transaction record for initial deposit
    await WalletTransaction.create({
      userId: user._id,
      amount,
      type: 'credit',
      transactionType: 'joining_deposit',
      description: 'Initial joining deposit',
      status: 'completed',
    });

    // Build MLM tree entry
    await buildTreeEntry(user._id, referrer ? referrer._id : null);

    // Update referral counts
    if (referrer) {
      await updateReferralCounts(referrer._id);
      // Distribute commissions
      await distributeJoiningCommissions(user._id, referrer._id, amount);
    }

    const token = generateToken(user._id);

    const userData = user.toObject();
    delete userData.password;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: userData,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Registration failed' });
  }
};

// @desc Login user
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    const userData = user.toObject();
    delete userData.password;

    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ success: true, message: 'Login successful', token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// @desc Get current user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('referredBy', 'fullName email referralCode');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get user data' });
  }
};

// @desc Logout
// @route POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie('token').json({ success: true, message: 'Logged out successfully' });
};

module.exports = { register, login, getMe, logout };
