const express = require('express');
const router = express.Router();
const { getDirectTeam, getTeamTree } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.get('/direct', protect, getDirectTeam);
router.get('/tree', protect, getTeamTree);

module.exports = router;
