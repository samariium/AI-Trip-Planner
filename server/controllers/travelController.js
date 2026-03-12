const axios = require('axios');
const { generateTravelPlan } = require('../services/aiService');
const { geocodeLocation } = require('../services/mapsService');
const TravelPlan = require('../models/TravelPlan');

const planTrip = async (req, res) => {
  try {
    const { source, destination, startDate, endDate, days: rawDays } = req.body;

    // Input validation
    if (!source || !destination) {
      return res.status(400).json({ error: 'Source and destination are required.' });
    }

    const src = String(source).trim().slice(0, 100);
    const dst = String(destination).trim().slice(0, 100);
    const days = Math.min(Math.max(parseInt(rawDays) || 3, 1), 14); // clamp 1–14 days
    const sDate = startDate ? String(startDate).slice(0, 10) : null;
    const eDate = endDate ? String(endDate).slice(0, 10) : null;

    if (src.length < 2 || dst.length < 2) {
      return res.status(400).json({ error: 'Please enter valid location names.' });
    }

    // Check MongoDB cache (skip cache if days differ)
    const cached = await TravelPlan.findOne({
      source: { $regex: new RegExp(`^${escapeRegex(src)}$`, 'i') },
      destination: { $regex: new RegExp(`^${escapeRegex(dst)}$`, 'i') },
      days: days
    });

    if (cached) {
      console.log(`Cache hit: ${src} → ${dst} (${days} days)`);
      return res.json({ success: true, data: cached, fromCache: true });
    }

    // Fetch geocoding and AI plan concurrently
    const [sourceCoords, destCoords, aiPlan] = await Promise.all([
      geocodeLocation(src),
      geocodeLocation(dst),
      generateTravelPlan(src, dst, sDate, eDate, days)
    ]);

    const travelData = {
      source: src,
      destination: dst,
      days,
      startDate: sDate,
      endDate: eDate,
      ...aiPlan,
      sourceCoords: sourceCoords || { lat: 0, lng: 0 },
      destCoords: destCoords || { lat: 0, lng: 0 }
    };

    // Persist to MongoDB (cache)
    const travelPlan = new TravelPlan(travelData);
    await travelPlan.save();

    res.json({ success: true, data: travelPlan.toObject(), fromCache: false });
  } catch (error) {
    console.error('Trip planning error:', error.message);

    if (error.message?.includes('API key')) {
      return res.status(401).json({ error: 'OpenAI API key is invalid or not configured. Please check server/.env.' });
    }

    res.status(500).json({ error: 'Failed to generate travel plan. Please try again.' });
  }
};

// Escape special regex characters in user input
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const getWeather = async (req, res) => {
  try {
    const { location } = req.query;
    if (!location || String(location).trim().length < 2) {
      return res.status(400).json({ error: 'Valid location is required' });
    }
    const safeLocation = String(location).trim().slice(0, 100);
    const response = await axios.get(
      `https://wttr.in/${encodeURIComponent(safeLocation)}?format=j1`,
      { timeout: 8000, headers: { 'Accept': 'application/json', 'User-Agent': 'ai-trip-planner/1.0' } }
    );
    const data = response.data;
    const current = data.current_condition?.[0];
    const forecast = (data.weather || []).slice(0, 3).map(day => ({
      date: day.date,
      maxTempC: day.maxtempC,
      minTempC: day.mintempC,
      desc: day.hourly?.[4]?.weatherDesc?.[0]?.value || 'N/A'
    }));
    res.json({
      success: true,
      data: {
        location: safeLocation,
        tempC: current?.temp_C,
        feelsLikeC: current?.FeelsLikeC,
        humidity: current?.humidity,
        windspeedKmph: current?.windspeedKmph,
        desc: current?.weatherDesc?.[0]?.value,
        forecast
      }
    });
  } catch (err) {
    console.warn('[Weather] Error:', err.message);
    res.status(503).json({ error: 'Weather data unavailable' });
  }
};

const getSharedPlan = async (req, res) => {
  // feature removed
  return res.status(410).json({ error: 'Share feature has been removed.' });
};

module.exports = { planTrip, getWeather, getSharedPlan };
