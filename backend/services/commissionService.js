const MLMTree = require('../models/MLMTree');
const CommissionSetting = require('../models/CommissionSetting');
const { creditWallet } = require('./walletService');

/**
 * Distribute commissions up the MLM hierarchy when a new user joins
 * @param {ObjectId} newUserId - The newly joined user
 * @param {ObjectId} parentId - Direct referrer
 * @param {number} amount - Amount paid on joining or investing
 * @param {string} context - 'joining' or 'investment'
 */
const distributeJoiningCommissions = async (newUserId, parentId, amount, context = 'joining') => {
  if (!parentId || amount <= 0) return;

  // Get active commission settings or create defaults
  let settings = await CommissionSetting.findOne({ isActive: true });
  if (!settings) {
    settings = await CommissionSetting.create({
      isActive: true,
      levelWiseCommission: { '1': 20, '2': 10, '3': 5, '4': 3, '5': 2 }
    });
  }

  // Get parent's tree entry (contains ancestor chain)
  const parentTree = await MLMTree.findOne({ userId: parentId });

  // Build ordered list of upline users: [direct parent (level1), grandparent (level2), ...]
  const upline = [
    { userId: parentId, levelFromNew: 1 },
  ];

  if (parentTree && parentTree.ancestors.length > 0) {
    parentTree.ancestors.forEach((ancestor, index) => {
      upline.push({ userId: ancestor.userId, levelFromNew: index + 2 });
    });
  }

  const commissionMap = settings.levelWiseCommission;
  const commissionPromises = [];

  for (const uplineEntry of upline) {
    const levelKey = String(uplineEntry.levelFromNew);
    const commissionPercent = commissionMap.get(levelKey);

    if (commissionPercent && commissionPercent > 0) {
      const commissionAmount = (amount * commissionPercent) / 100;
      const txType = uplineEntry.levelFromNew === 1 ? 'referral_bonus' : 'level_income';
      
      const sourceText = context === 'investment' ? 'downline investment' : 'new joiner';
      const description = `Level ${uplineEntry.levelFromNew} commission from ${sourceText} (₹${amount} × ${commissionPercent}%)`;

      commissionPromises.push(
        creditWallet(uplineEntry.userId, commissionAmount, txType, description, newUserId)
      );
    }
  }

  await Promise.all(commissionPromises);
};

/**
 * Get current commission settings
 */
const getCommissionSettings = async () => {
  let settings = await CommissionSetting.findOne({ isActive: true });
  if (!settings) {
    // Create default settings
    settings = await CommissionSetting.create({});
  }
  return settings;
};

/**
 * Update commission settings
 */
const updateCommissionSettings = async (data) => {
  let settings = await CommissionSetting.findOne({ isActive: true });
  if (!settings) {
    settings = await CommissionSetting.create(data);
  } else {
    Object.assign(settings, data);
    await settings.save();
  }
  return settings;
};

module.exports = {
  distributeJoiningCommissions,
  getCommissionSettings,
  updateCommissionSettings,
};
