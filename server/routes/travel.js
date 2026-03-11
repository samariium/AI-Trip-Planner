const express = require('express');
const router = express.Router();
const { planTrip, getWeather, getSharedPlan } = require('../controllers/travelController');

// POST /api/travel/plan
router.post('/plan', planTrip);

// GET /api/travel/weather?location=CITY
router.get('/weather', getWeather);

// GET /api/travel/share/:shareId
router.get('/share/:shareId', getSharedPlan);

module.exports = router;
