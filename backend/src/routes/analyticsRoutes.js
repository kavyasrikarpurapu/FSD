const express = require('express');
const router = express.Router();
const { getPlatformStats } = require('../controllers/notificationController');

router.get('/platform-stats', getPlatformStats);

module.exports = router;
