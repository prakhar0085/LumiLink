const express = require('express');
const router = express.Router();
const { createShortUrl, getUserUrls, deleteUrl } = require('../controllers/urlController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/create', protect, createShortUrl);
router.get('/user/all', protect, getUserUrls);
router.delete('/:id', protect, deleteUrl);

module.exports = router;
