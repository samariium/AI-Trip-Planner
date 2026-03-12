import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

const makeCircleIcon = (color, emoji, size = 36) => L.divIcon({
  className: '',
  html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;font-size:${Math.round(size*0.44)}px;cursor:pointer;">${emoji}</div>`,
  iconSize: [size, size],
  iconAnchor: [size/2, size/2],
  popupAnchor: [0, -size/2 - 4]
});

const sourceIcon = makeCircleIcon('#10b981', '🟢');
const destIcon   = makeCircleIcon('#ef4444', '🔴');
const hotelIcon  = makeCircleIcon('#f59e0b', '🏨', 32);
const restIcon   = makeCircleIcon('#f97316', '🍽️', 32);

const DAY_COLORS = ['#3b82f6','#22c55e','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16'];

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
      map.fitBounds(L.latLngBounds(positions), { padding: [60, 60], maxZoom: 12 });
    }
  }, [map, positions]);
  return null;
};

const geocode = async (query) => {
  const q = encodeURIComponent(query);
  const res = await axios.get(
    `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`,
    { timeout: 6000, headers: { 'Accept-Language': 'en', 'User-Agent': 'ai-trip-planner/1.0' } }
  );
  return res.data?.[0] ? { lat: parseFloat(res.data[0].lat), lng: parseFloat(res.data[0].lon) } : null;
};

const MapView = ({ sourceCoords, destCoords, source, destination, attractions = [], hotels = [], restaurants = [], itinerary = [] }) => {
  const [routePoints, setRoutePoints]     = useState([]);
  const [routeLoading, setRouteLoading]   = useState(false);
  const [attrCoords, setAttrCoords]       = useState([]);
  const [hotelCoords, setHotelCoords]     = useState([]);
  const [restCoords, setRestCoords]       = useState([]);
  const [dayRoutes, setDayRoutes]         = useState([]);
  const [showHotels, setShowHotels]       = useState(true);
  const [showRests, setShowRests]         = useState(true);
  const [showDayRoutes, setShowDayRoutes] = useState(true);

  const hasValidCoords =
    sourceCoords?.lat && destCoords?.lat &&
    sourceCoords.lat !== 0 && destCoords.lat !== 0 &&
    sourceCoords.lng && destCoords.lng;

  useEffect(() => {
    if (!hasValidCoords) return;
    fetchRoute();
    geocodeAttractions();
    geocodeHotels();
    geocodeRestaurants();
    geocodeDayLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRoute = async () => {
    setRouteLoading(true);
    const coordStr = `${sourceCoords.lng},${sourceCoords.lat};${destCoords.lng},${destCoords.lat}`;
    const query = `?overview=full&geometries=geojson`;
    const endpoints = [
      `https://router.project-osrm.org/route/v1/driving/${coordStr}${query}`,
      `https://routing.openstreetmap.de/routed-car/route/v1/driving/${coordStr}${query}`,
    ];
    for (const url of endpoints) {
      try {
        const res = await axios.get(url, { timeout: 15000 });
        if (res.data?.routes?.[0]?.geometry?.coordinates?.length > 2) {
          setRoutePoints(res.data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]));
          setRouteLoading(false);
          return;
        }
      } catch { /* try next */ }
    }
    setRoutePoints([[sourceCoords.lat, sourceCoords.lng], [destCoords.lat, destCoords.lng]]);
    setRouteLoading(false);
  };

  const geocodeAttractions = async () => {
    if (!attractions.length) return;
    const results = [];
    for (const attr of attractions.slice(0, 6)) {
      try {
        const coords = await geocode(`${attr.name}, ${destination}`);
        if (coords) results.push({ ...attr, ...coords });
      } catch { /* skip */ }
      await new Promise(r => setTimeout(r, 1100));
    }
    setAttrCoords(results);
  };

  const geocodeHotels = async () => {
    if (!hotels?.length) return;
    const results = [];
    for (const h of hotels.slice(0, 3)) {
      try {
        const coords = await geocode(`${h.name}, ${destination}`);
        if (coords) results.push({ ...h, ...coords });
      } catch { /* skip */ }
      await new Promise(r => setTimeout(r, 1100));
    }
    setHotelCoords(results);
  };

  const geocodeRestaurants = async () => {
    if (!restaurants?.length) return;
    const results = [];
    for (const r of restaurants.slice(0, 4)) {
      try {
        const coords = await geocode(`${r.name}, ${destination}`);
        if (coords) results.push({ ...r, ...coords });
      } catch { /* skip */ }
      await new Promise(r => setTimeout(r, 1100));
    }
    setRestCoords(results);
  };

  const geocodeDayLocations = async () => {
    if (!itinerary?.length) return;
    const routes = [];
    for (let di = 0; di < Math.min(itinerary.length, 8); di++) {
      const day    = itinerary[di];
      const locs   = day.keyLocations || [];
      if (!locs.length) { routes.push([]); continue; }
      const coords = [];
      for (const loc of locs.slice(0, 4)) {
        try {
          const c = await geocode(`${loc}, ${destination}`);
          if (c) coords.push([c.lat, c.lng]);
        } catch { /* skip */ }
        await new Promise(r => setTimeout(r, 900));
      }
      routes.push(coords);
    }
    setDayRoutes(routes);
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

  const srcPos  = [sourceCoords.lat, sourceCoords.lng];
  const dstPos  = [destCoords.lat, destCoords.lng];
  const displayRoute  = routePoints.length > 0 ? routePoints : [srcPos, dstPos];
  const allPositions  = [srcPos, dstPos, ...attrCoords.map(a => [a.lat, a.lng])];

  return (
    <>
      {/* Legend */}
      <div className="map-legend">
        <div className="map-legend-item"><span className="legend-emoji">🟢</span><span>{source}</span></div>
        <div className="map-legend-item"><span className="legend-emoji">🔴</span><span>{destination}</span></div>
        <div className="map-legend-item">
          <div className="legend-line" />
          <span>{routeLoading ? 'Loading route…' : 'Main Route'}</span>
        </div>
        {attrCoords.length > 0 && (
          <div className="map-legend-item"><span className="legend-emoji">📍</span><span>{attrCoords.length} attractions</span></div>
        )}
        {hotelCoords.length > 0 && (
          <div className="map-legend-item" style={{ cursor: 'pointer' }} onClick={() => setShowHotels(v => !v)}>
            <span className="legend-emoji">🏨</span>
            <span style={{ textDecoration: showHotels ? 'none' : 'line-through' }}>{hotelCoords.length} hotels</span>
          </div>
        )}
        {restCoords.length > 0 && (
          <div className="map-legend-item" style={{ cursor: 'pointer' }} onClick={() => setShowRests(v => !v)}>
            <span className="legend-emoji">🍽️</span>
            <span style={{ textDecoration: showRests ? 'none' : 'line-through' }}>{restCoords.length} restaurants</span>
          </div>
        )}
        {dayRoutes.some(r => r.length > 1) && (
          <div className="map-legend-item" style={{ cursor: 'pointer' }} onClick={() => setShowDayRoutes(v => !v)}>
            <span style={{ display: 'flex', gap: 3 }}>
              {DAY_COLORS.slice(0, Math.min(dayRoutes.length, 4)).map((c, i) => (
                <span key={i} className="legend-day-dot" style={{ background: c }} />
              ))}
            </span>
            <span style={{ textDecoration: showDayRoutes ? 'none' : 'line-through' }}>Day routes</span>
          </div>
        )}
      </div>

      <div className="map-wrap">
        <MapContainer center={srcPos} zoom={6} style={{ height: '480px', width: '100%' }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Source / Destination */}
          <Marker position={srcPos} icon={sourceIcon}>
            <Popup className="map-popup">
              <div className="popup-inner"><div className="popup-title">📍 {source}</div><div className="popup-sub">Starting point</div></div>
            </Popup>
          </Marker>
          <Marker position={dstPos} icon={destIcon}>
            <Popup className="map-popup">
              <div className="popup-inner"><div className="popup-title">🎯 {destination}</div><div className="popup-sub">Destination</div></div>
            </Popup>
          </Marker>

          {/* Attractions */}
          {attrCoords.map((attr, i) => (
            <Marker key={`attr-${i}`} position={[attr.lat, attr.lng]} icon={makeCircleIcon('#6366f1', getCatEmoji(attr.category))}>
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

          {/* Hotels */}
          {showHotels && hotelCoords.map((h, i) => (
            <Marker key={`hotel-${i}`} position={[h.lat, h.lng]} icon={hotelIcon}>
              <Popup className="map-popup" maxWidth={240}>
                <div className="popup-inner">
                  <div className="popup-title">🏨 {h.name}</div>
                  {h.category && <div className="popup-badge">{h.category}</div>}
                  {h.pricePerNight && <div className="popup-desc">💰 {h.pricePerNight} / night</div>}
                  {h.location && <div className="popup-meta-row"><span>📍 {h.location}</span></div>}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Restaurants */}
          {showRests && restCoords.map((r, i) => (
            <Marker key={`rest-${i}`} position={[r.lat, r.lng]} icon={restIcon}>
              <Popup className="map-popup" maxWidth={240}>
                <div className="popup-inner">
                  <div className="popup-title">🍽️ {r.name}</div>
                  {r.cuisine && <div className="popup-badge">{r.cuisine}</div>}
                  {r.signatureDish && <div className="popup-desc">✨ {r.signatureDish}</div>}
                  {r.priceRange && <div className="popup-meta-row"><span>💰 {r.priceRange}</span></div>}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Main route */}
          {displayRoute.length >= 2 && (
            <Polyline positions={displayRoute} color="#6366f1" weight={8} opacity={0.18} />
          )}
          {displayRoute.length >= 2 && (
            <Polyline positions={displayRoute} color="#6366f1" weight={4} opacity={0.9} dashArray="10, 6" />
          )}

          {/* Day-wise coloured routes */}
          {showDayRoutes && dayRoutes.map((pts, di) =>
            pts.length >= 2 ? (
              <Polyline key={`day-${di}`} positions={pts}
                color={DAY_COLORS[di % DAY_COLORS.length]} weight={4} opacity={0.85} />
            ) : null
          )}

          <FitBounds positions={allPositions} />
        </MapContainer>
      </div>

      {/* Day route colour key */}
      {showDayRoutes && dayRoutes.some(r => r.length > 1) && (
        <div className="map-legend" style={{ marginTop: 8 }}>
          {dayRoutes.map((pts, di) => pts.length > 1 ? (
            <div key={di} className="map-legend-item">
              <span className="legend-day-dot" style={{ background: DAY_COLORS[di % DAY_COLORS.length] }} />
              <span style={{ fontSize: '0.78rem' }}>Day {di + 1}</span>
            </div>
          ) : null)}
        </div>
      )}
    </>
  );
};

export default MapView;