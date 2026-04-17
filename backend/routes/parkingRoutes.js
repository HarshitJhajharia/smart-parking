const express = require('express');
const router = express.Router();
const { getLots, getLotById, seedData } = require('../controllers/parkingController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected — user must be logged in
router.get('/lots', protect, getLots);
router.get('/lots/:lotId', protect, getLotById);
router.post('/seed', protect, seedData); // Seed sample data for demo

module.exports = router;
