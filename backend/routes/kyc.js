const express = require('express');
const router = express.Router();
const { uploadKYC, getKYCStatus } = require('../controllers/kycController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post(
  '/upload',
  protect,
  upload.fields([
    { name: 'aadhaarImage', maxCount: 1 },
    { name: 'panImage', maxCount: 1 },
  ]),
  uploadKYC
);
router.get('/status', protect, getKYCStatus);

module.exports = router;
