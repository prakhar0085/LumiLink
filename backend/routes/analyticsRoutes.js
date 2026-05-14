const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/:id', protect, getAnalytics);

module.exports = router;
