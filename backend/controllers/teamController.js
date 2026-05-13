const { getDirectReferrals, getDownlineTree } = require('../services/referralService');
const User = require('../models/User');

// @desc Get direct referrals
// @route GET /api/team/direct
const getDirectTeam = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const data = await getDirectReferrals(req.user._id, page, limit);
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get team data' });
  }
};

// @desc Get full downline tree
// @route GET /api/team/tree
const getTeamTree = async (req, res) => {
  try {
    const userTree = await getDownlineTree(req.user._id);
    const user = await User.findById(req.user._id).populate('referredBy', 'fullName email referralCode walletBalance createdAt');

    let finalTree = userTree;

    // If user has a referrer, wrap the tree to show 1 level up
    if (user.referredBy) {
      finalTree = {
        _id: user.referredBy._id,
        name: user.referredBy.fullName,
        email: user.referredBy.email,
        referralCode: user.referredBy.referralCode,
        walletBalance: user.referredBy.walletBalance,
        joinedAt: user.referredBy.createdAt,
        isSponsor: true, // Custom flag to indicate this is the upline
        children: [userTree],
      };
    }

    res.json({ success: true, tree: finalTree });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get team tree' });
  }
};

module.exports = { getDirectTeam, getTeamTree };
