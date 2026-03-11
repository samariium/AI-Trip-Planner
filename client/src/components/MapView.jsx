import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

// Fix default Leaflet marker icons (Vite/bundler compatibility)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const makeCircleIcon = (color, emoji) => L.divIcon({
  className: '',
  html: `<div style="width:36px;height:36px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:16px;cursor:pointer;">${emoji}</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20]
});

const sourceIcon = makeCircleIcon('#10b981', '🟢');
const destIcon   = makeCircleIcon('#ef4444', '🔴');

const CAT_EMOJI = {
  historical: '🏛️', nature: '🌿', religious: '⛪',
  entertainment: '🎭', shopping: '🛍️', art: '🎨',
  beach: '🏖️', adventure: '🧗'
};
const getCatEmoji = (cat = '') => {
  const key = Object.keys(CAT_EMOJI).find(k => cat.toLowerCase().includes(k));
  return key ? CAT_EMOJI[key] : '📍';
};

const FitBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 });
    }
  }, [map, positions]);
  return null;
};

const MapView = ({ sourceCoords, destCoords, source, destination, attractions = [] }) => {
  const [routePoints, setRoutePoints]   = useState([]);
  const [routeLoading, setRouteLoading] = useState(false);
  const [attrCoords, setAttrCoords]     = useState([]);

  const hasValidCoords =
    sourceCoords?.lat && destCoords?.lat &&
    sourceCoords.lat !== 0 && destCoords.lat !== 0 &&
    sourceCoords.lng && destCoords.lng;

  useEffect(() => {
    if (!hasValidCoords) return;
    fetchRoute();
    geocodeAttractions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRoute = async () => {
    setRouteLoading(true);
    const coordStr = `${sourceCoords.lng},${sourceCoords.lat};${destCoords.lng},${destCoords.lat}`;
    const query    = `?overview=full&geometries=geojson`;
    const endpoints = [
      `https://router.project-osrm.org/route/v1/driving/${coordStr}${query}`,
      `https://routing.openstreetmap.de/routed-car/route/v1/driving/${coordStr}${query}`,
    ];

    for (const url of endpoints) {
      try {
        const res = await axios.get(url, { timeout: 15000 });
        if (res.data?.routes?.[0]?.geometry?.coordinates?.length > 2) {
          const coords = res.data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setRoutePoints(coords);
          setRouteLoading(false);
          return; // success — stop trying
        }
      } catch { /* try next endpoint */ }
    }

    // both failed — fall back to straight line only as last resort
    setRoutePoints([
      [sourceCoords.lat, sourceCoords.lng],
      [destCoords.lat, destCoords.lng]
    ]);
    setRouteLoading(false);
  };

  const geocodeAttractions = async () => {
    if (!attractions.length) return;
    const results = [];
    for (const attr of attractions.slice(0, 6)) {
      try {
        const q = encodeURIComponent(`${attr.name}, ${destination}`);
        const res = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`,
          { timeout: 6000, headers: { 'Accept-Language': 'en', 'User-Agent': 'ai-trip-planner/1.0' } }
        );
        if (res.data?.[0]) {
          results.push({ ...attr, lat: parseFloat(res.data[0].lat), lng: parseFloat(res.data[0].lon) });
        }
      } catch { /* skip */ }
      await new Promise(r => setTimeout(r, 1100));
    }
    setAttrCoords(results);
  };

  if (!hasValidCoords) {
    return (
      <div className="map-unavailable">
        <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🗺️</div>
        <p style={{ fontWeight: 600, marginBottom: '6px' }}>Map not available</p>
        <p style={{ fontSize: '0.88rem' }}>Could not geocode locations.</p>
      </div>
    );
  }

  const srcPos = [sourceCoords.lat, sourceCoords.lng];
  const dstPos = [destCoords.lat, destCoords.lng];
  const displayRoute = routePoints.length > 0 ? routePoints : [srcPos, dstPos];
  const allPositions = [srcPos, dstPos, ...attrCoords.map(a => [a.lat, a.lng])];

  return (
    <>
      <div className="map-legend">
        <div className="map-legend-item">
          <span className="legend-emoji">🟢</span><span>{source}</span>
        </div>
        <div className="map-legend-item">
          <span className="legend-emoji">🔴</span><span>{destination}</span>
        </div>
        <div className="map-legend-item">
          <div className="legend-line" />
          <span>{routeLoading ? 'Loading route…' : 'Route'}</span>
        </div>
        {attrCoords.length > 0 && (
          <div className="map-legend-item">
            <span className="legend-emoji">📍</span>
            <span>{attrCoords.length} attraction{attrCoords.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="map-wrap">
        <MapContainer center={srcPos} zoom={6} style={{ height: '480px', width: '100%' }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={srcPos} icon={sourceIcon}>
            <Popup className="map-popup">
              <div className="popup-inner">
                <div className="popup-title">📍 {source}</div>
                <div className="popup-sub">Starting point</div>
              </div>
            </Popup>
          </Marker>

          <Marker position={dstPos} icon={destIcon}>
            <Popup className="map-popup">
              <div className="popup-inner">
                <div className="popup-title">🎯 {destination}</div>
                <div className="popup-sub">Destination</div>
              </div>
            </Popup>
          </Marker>

          {attrCoords.map((attr, i) => (
            <Marker key={i} position={[attr.lat, attr.lng]} icon={makeCircleIcon('#6366f1', getCatEmoji(attr.category))}>
              <Popup className="map-popup" maxWidth={260}>
                <div className="popup-inner">
                  <div className="popup-title">{attr.name}</div>
                  {attr.category && <div className="popup-badge">{getCatEmoji(attr.category)} {attr.category}</div>}
                  {attr.description && <div className="popup-desc">{attr.description}</div>}
                  <div className="popup-meta-row">
                    {attr.visitDuration && <span>⏱ {attr.visitDuration}</span>}
                    {attr.entryFee && <span>🎟 {attr.entryFee}</span>}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {displayRoute.length >= 2 && (
            <Polyline positions={displayRoute} color="#6366f1" weight={8} opacity={0.18} />
          )}
          {displayRoute.length >= 2 && (
            <Polyline positions={displayRoute} color="#6366f1" weight={4} opacity={0.9} dashArray="10, 6" />
          )}

          <FitBounds positions={allPositions} />
        </MapContainer>
      </div>
    </>
  );
};

export default MapView;