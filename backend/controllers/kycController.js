const KYC = require('../models/KYC');
const User = require('../models/User');

// @desc Upload KYC documents
// @route POST /api/kyc/upload
const uploadKYC = async (req, res) => {
  try {
    const { aadhaarNumber, panNumber, bankName, accountNumber, ifscCode } = req.body;

    if (!aadhaarNumber || !panNumber || !bankName || !accountNumber || !ifscCode) {
      return res.status(400).json({ success: false, message: 'All KYC fields are required' });
    }

    if (!req.files || !req.files.aadhaarImage || !req.files.panImage) {
      return res.status(400).json({ success: false, message: 'Both Aadhaar and PAN images required' });
    }

    const existingKYC = await KYC.findOne({ userId: req.user._id });
    if (existingKYC && existingKYC.status === 'approved') {
      return res.status(400).json({ success: false, message: 'KYC already approved' });
    }

    const kycData = {
      userId: req.user._id,
      aadhaarNumber,
      panNumber,
      bankName,
      accountNumber,
      ifscCode,
      aadhaarImage: `/uploads/${req.files.aadhaarImage[0].filename}`,
      panImage: `/uploads/${req.files.panImage[0].filename}`,
      status: 'pending',
      adminRemark: '',
    };

    let kyc;
    if (existingKYC) {
      kyc = await KYC.findOneAndUpdate({ userId: req.user._id }, kycData, { new: true });
    } else {
      kyc = await KYC.create(kycData);
    }

    res.status(201).json({ success: true, message: 'KYC submitted successfully', kyc });
  } catch (error) {
    console.error('KYC upload error:', error);
    res.status(500).json({ success: false, message: 'KYC submission failed' });
  }
};

// @desc Get KYC status
// @route GET /api/kyc/status
const getKYCStatus = async (req, res) => {
  try {
    const kyc = await KYC.findOne({ userId: req.user._id });
    res.json({ success: true, kyc: kyc || null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get KYC status' });
  }
};

module.exports = { uploadKYC, getKYCStatus };
