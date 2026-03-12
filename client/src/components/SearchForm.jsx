import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

const todayStr = () => new Date().toISOString().split('T')[0];

const shiftDate = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const calcDays = (from, to) => {
  if (!from || !to) return 0;
  const diff = Math.round((new Date(to) - new Date(from)) / 86400000);
  return diff > 0 ? diff : 0;
};

const fmt = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
};

const TRAVELLER_TYPES = [
  { value: 'solo', label: 'Solo', icon: '🧳' },
  { value: 'couple', label: 'Couple', icon: '💑' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧' },
  { value: 'backpacker', label: 'Backpacker', icon: '🎒' },
  { value: 'business', label: 'Business', icon: '💼' },
];

const BUDGET_LEVELS = [
  { value: 'budget', label: 'Budget', icon: '💸' },
  { value: 'midrange', label: 'Mid-Range', icon: '💳' },
  { value: 'luxury', label: 'Luxury', icon: '💎' },
];

const TRIP_PURPOSES = [
  { value: 'adventure', label: 'Adventure', icon: '🧗' },
  { value: 'relaxation', label: 'Relaxation', icon: '🏖️' },
  { value: 'cultural', label: 'Cultural', icon: '🏛️' },
  { value: 'pilgrimage', label: 'Pilgrimage', icon: '🕌' },
  { value: 'honeymoon', label: 'Honeymoon', icon: '💍' },
  { value: 'work', label: 'Work', icon: '💼' },
];

const ChipGroup = ({ label, options, value, onChange, disabled }) => (
  <div className="chip-group">
    <div className="search-label" style={{ marginBottom: 8 }}>{label}</div>
    <div className="chip-row">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          className={`trip-chip ${value === opt.value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
          disabled={disabled}
        >
          <span>{opt.icon}</span> {opt.label}
        </button>
      ))}
    </div>
  </div>
);

/* Location input with Nominatim autocomplete — dropdown rendered via Portal
   so it is never clipped by backdrop-filter / overflow on parent elements */
const LocationInput = ({ id, label, icon, placeholder, value, onChange, disabled }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const timerRef = useRef(null);
  const wrapRef  = useRef(null);
  const inputRef = useRef(null);

  const updatePos = useCallback(() => {
    if (!inputRef.current) return;
    const r = inputRef.current.getBoundingClientRect();
    // position:fixed uses viewport coords — getBoundingClientRect already returns those
    setDropPos({ top: r.bottom + 4, left: r.left, width: r.width });
  }, []);

  const fetchSuggestions = useCallback(async (q) => {
    if (q.length < 2) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&limit=6&accept-language=en`;
      const res = await fetch(url);
      const data = await res.json();
      const items = data.map(r => ({
        label: r.display_name,
        short: [r.address?.city || r.address?.town || r.address?.village || r.address?.county, r.address?.country].filter(Boolean).join(', ') || r.display_name.split(',')[0],
      }));
      setSuggestions(items);
      if (items.length > 0) { updatePos(); setOpen(true); }
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [updatePos]);

  const handleChange = (e) => {
    const v = e.target.value;
    onChange(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchSuggestions(v), 350);
  };

  const handleSelect = (item) => {
    onChange(item.short || item.label);
    setSuggestions([]);
    setOpen(false);
  };

  /* Re-position on scroll / resize */
  useEffect(() => {
    if (!open) return;
    const onScroll = () => updatePos();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll, true); window.removeEventListener('resize', onScroll); };
  }, [open, updatePos]);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dropdown = open && suggestions.length > 0 && createPortal(
    <ul
      className="loc-dropdown"
      role="listbox"
      style={{ position: 'fixed', top: dropPos.top, left: dropPos.left, width: dropPos.width, zIndex: 99999 }}
    >
      {suggestions.map((s, i) => (
        <li key={i} className="loc-option" role="option" onMouseDown={() => handleSelect(s)}>
          <span className="loc-pin">📍</span>
          <span className="loc-option-text">
            <span className="loc-short">{s.short}</span>
            <span className="loc-full">{s.label}</span>
          </span>
        </li>
      ))}
    </ul>,
    document.body
  );

  return (
    <div className="search-field location-field" ref={wrapRef}>
      <label className="search-label" htmlFor={id}>
        <span>{icon}</span> {label}
      </label>
      <div className="location-input-wrap">
        <input
          ref={inputRef}
          id={id}
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => { if (suggestions.length > 0) { updatePos(); setOpen(true); } }}
          disabled={disabled}
          autoComplete="off"
          maxLength={120}
        />
        {loading && <span className="loc-spinner" />}
      </div>
      {dropdown}
    </div>
  );
};

const SearchForm = ({ onSearch, loading }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(shiftDate(todayStr(), 1));
  const [endDate, setEndDate] = useState(shiftDate(todayStr(), 4));
  const [travellerType, setTravellerType] = useState('solo');
  const [budgetLevel, setBudgetLevel] = useState('midrange');
  const [tripPurpose, setTripPurpose] = useState('cultural');
  const [numTravellers, setNumTravellers] = useState(1);

  const days = calcDays(startDate, endDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!source.trim() || !destination.trim()) return;
    onSearch(source.trim(), destination.trim(), startDate, endDate, days || 3, {
      travellerType,
      budgetLevel,
      tripPurpose,
      numTravellers: parseInt(numTravellers) || 1,
    });
  };

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
  };

  const handleStartDateChange = (val) => {
    setStartDate(val);
    if (endDate && endDate <= val) setEndDate(shiftDate(val, 3));
  };

  const handleEndDateChange = (val) => {
    if (val >= startDate) setEndDate(val);
  };

  return (
    <div className="search-card">
      <div className="search-card-title">
        <span>🗺️</span> Where would you like to go?
      </div>
      <form onSubmit={handleSubmit}>

        {/* Location row */}
        <div className="search-row">
          <LocationInput
            id="source"
            label="From"
            icon="📍"
            placeholder="e.g. Mumbai, India"
            value={source}
            onChange={setSource}
            disabled={loading}
          />

          <button
            type="button"
            className="search-swap-btn"
            onClick={handleSwap}
            disabled={loading}
            title="Swap source and destination"
            aria-label="Swap source and destination"
          >
            ⇄
          </button>

          <LocationInput
            id="destination"
            label="To"
            icon="🎯"
            placeholder="e.g. Goa, India"
            value={destination}
            onChange={setDestination}
            disabled={loading}
          />
        </div>

        {/* Date row */}
        <div className="date-row">
          <div className="search-field">
            <label className="search-label" htmlFor="startDate">
              <span>📅</span> Departure Date
            </label>
            <input
              id="startDate"
              type="date"
              className="search-input date-input"
              value={startDate}
              min={todayStr()}
              onChange={(e) => handleStartDateChange(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="date-days-badge">
            <span className="date-days-num">{days}</span>
            <span className="date-days-label">day{days !== 1 ? 's' : ''}</span>
          </div>

          <div className="search-field">
            <label className="search-label" htmlFor="endDate">
              <span>🏁</span> Return Date
            </label>
            <input
              id="endDate"
              type="date"
              className="search-input date-input"
              value={endDate}
              min={startDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Date summary */}
        {days > 0 && (
          <div className="date-summary">
            <span>🗓️</span>
            <span>{fmt(startDate)} → {fmt(endDate)}</span>
            <span className="date-summary-pill">{days} day{days !== 1 ? 's' : ''} trip</span>
          </div>
        )}

        {/* Traveller type + number */}
        <div className="pref-row">
          <ChipGroup label="👤 Traveller Type" options={TRAVELLER_TYPES} value={travellerType} onChange={setTravellerType} disabled={loading} />
          <div className="search-field traveller-count-field">
            <div className="search-label" style={{ marginBottom: 8 }}>🧑‍🤝‍🧑 No. of Travellers</div>
            <div className="traveller-count">
              <button type="button" className="count-btn" onClick={() => setNumTravellers(n => Math.max(1, n - 1))} disabled={loading || numTravellers <= 1}>−</button>
              <span className="count-num">{numTravellers}</span>
              <button type="button" className="count-btn" onClick={() => setNumTravellers(n => Math.min(20, n + 1))} disabled={loading || numTravellers >= 20}>+</button>
            </div>
          </div>
        </div>

        {/* Budget level */}
        <ChipGroup label="💰 Budget" options={BUDGET_LEVELS} value={budgetLevel} onChange={setBudgetLevel} disabled={loading} />

        {/* Trip purpose */}
        <ChipGroup label="🎯 Trip Purpose" options={TRIP_PURPOSES} value={tripPurpose} onChange={setTripPurpose} disabled={loading} />

        {/* Submit */}
        <button type="submit" className="search-btn" disabled={loading || !source.trim() || !destination.trim()}>
          {loading ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span> Planning...
            </>
          ) : (
            <>
              <span>✈️</span> Plan My Trip
            </>
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default SearchForm;