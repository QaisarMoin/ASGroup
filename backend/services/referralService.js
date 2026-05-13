const User = require('../models/User');
const MLMTree = require('../models/MLMTree');

/**
 * Generate a unique referral code
 */
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Find a user by referral code
 */
const findByReferralCode = async (code) => {
  if (!code) return null;
  return User.findOne({ referralCode: code.toUpperCase() });
};

/**
 * Build MLM tree entry for a new user
 * Links user to parent and stores ancestor chain
 */
const buildTreeEntry = async (userId, parentId) => {
  let level = 0;
  let ancestors = [];

  if (parentId) {
    const parentTree = await MLMTree.findOne({ userId: parentId });
    if (parentTree) {
      level = parentTree.level + 1;
      // Build ancestor chain: parent first, then parent's ancestors
      ancestors = [
        { userId: parentId, level: parentTree.level },
        ...parentTree.ancestors,
      ];
    } else {
      level = 1;
      ancestors = [{ userId: parentId, level: 0 }];
    }
  }

  const treeEntry = await MLMTree.create({
    userId,
    parentId: parentId || null,
    level,
    ancestors,
  });

  return treeEntry;
};

/**
 * Update referral counts up the chain
 */
const updateReferralCounts = async (parentId) => {
  if (!parentId) return;

  // Increment direct referrals count for direct parent
  await User.findByIdAndUpdate(parentId, { $inc: { directReferralsCount: 1 } });

  // Increment totalTeamCount for all ancestors
  const parentTree = await MLMTree.findOne({ userId: parentId });
  if (parentTree && parentTree.ancestors.length > 0) {
    const ancestorIds = parentTree.ancestors.map((a) => a.userId);
    await User.updateMany(
      { _id: { $in: ancestorIds } },
      { $inc: { totalTeamCount: 1 } }
    );
  }
  // Also update the direct parent's totalTeamCount
  await User.findByIdAndUpdate(parentId, { $inc: { totalTeamCount: 1 } });
};

/**
 * Get direct referrals of a user
 */
const getDirectReferrals = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find({ referredBy: userId })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments({ referredBy: userId }),
  ]);
  return { users, total, page, pages: Math.ceil(total / limit) };
};

/**
 * Get full downline tree for a user (recursive)
 * Returns tree structure for visualization
 */
const getDownlineTree = async (userId) => {
  const user = await User.findById(userId).select('fullName email referralCode walletBalance createdAt');
  if (!user) return null;

  const children = await User.find({ referredBy: userId }).select(
    'fullName email referralCode walletBalance createdAt'
  );

  const childrenWithDownline = await Promise.all(
    children.map((child) => getDownlineTree(child._id))
  );

  return {
    _id: user._id,
    name: user.fullName,
    email: user.email,
    referralCode: user.referralCode,
    walletBalance: user.walletBalance,
    joinedAt: user.createdAt,
    children: childrenWithDownline.filter(Boolean),
  };
};

module.exports = {
  generateReferralCode,
  findByReferralCode,
  buildTreeEntry,
  updateReferralCounts,
  getDirectReferrals,
  getDownlineTree,
};
