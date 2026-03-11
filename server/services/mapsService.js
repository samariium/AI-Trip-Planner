const axios = require('axios');

/**
 * Geocodes a location string to lat/lng using OpenStreetMap Nominatim (free, no API key needed).
 */
const geocodeLocation = async (location) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: location,
        format: 'json',
        limit: 1,
        addressdetails: 0
      },
      headers: {
        // Nominatim requires a descriptive User-Agent
        'User-Agent': 'AI-Trip-Planner/1.0 (educational project)'
      },
      timeout: 8000
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name
      };
    }

    console.warn(`Geocoding: no results for "${location}"`);
    return null;
  } catch (error) {
    console.error(`Geocoding error for "${location}":`, error.message);
    return null;
  }
};

module.exports = { geocodeLocation };
