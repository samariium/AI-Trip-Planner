const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/places/search?q=Mumbai
// Proxies Nominatim so we can set a proper User-Agent (required by OSM policy)
router.get('/search', async (req, res) => {
  const q = String(req.query.q || '').trim().slice(0, 200);
  if (q.length < 2) return res.json([]);

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q, format: 'json', addressdetails: 1, limit: 6, 'accept-language': 'en' },
      timeout: 8000,
      headers: {
        'User-Agent': 'AI-Trip-Planner/1.0 (https://samariium.github.io/AI-Trip-Planner)',
        'Accept-Language': 'en',
        'Accept': 'application/json',
        'Referer': 'https://samariium.github.io'
      }
    });

    const items = (response.data || []).map(r => ({
      label: r.display_name,
      short: [
        r.address?.city || r.address?.town || r.address?.village || r.address?.county || r.address?.state,
        r.address?.country
      ].filter(Boolean).join(', ') || r.display_name.split(',')[0].trim(),
      lat: r.lat,
      lon: r.lon,
      type: r.type
    }));

    res.json(items);
  } catch (err) {
    console.error('[Places] Nominatim error:', err.message);
    res.json([]); // return empty rather than error — frontend degrades gracefully
  }
});

module.exports = router;
