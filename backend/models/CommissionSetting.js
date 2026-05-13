const mongoose = require('mongoose');

const commissionSettingSchema = new mongoose.Schema(
  {
    joiningCommission: {
      type: Number,
      default: 0,
      comment: 'Percentage of joining amount credited to direct referrer',
    },
    levelWiseCommission: {
      type: Map,
      of: Number,
      default: {
        '1': 20,
        '2': 10,
        '3': 5,
        '4': 3,
        '5': 2,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CommissionSetting', commissionSettingSchema);
