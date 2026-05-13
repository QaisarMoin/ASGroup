const mongoose = require('mongoose');

const mlmTreeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    level: {
      type: Number,
      default: 0,
    },
    ancestors: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        level: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('MLMTree', mlmTreeSchema);
