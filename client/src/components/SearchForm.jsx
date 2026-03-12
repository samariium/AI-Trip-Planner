import { useState } from 'react';

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
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const TRAVELLER_TYPES = [
  { value: 'solo', label: 'Solo', icon: 'ðŸ§³' },
  { value: 'couple', label: 'Couple', icon: 'ðŸ’‘' },
  { value: 'family', label: 'Family', icon: 'ðŸ‘¨â€ðŸ‘©â€ðŸ‘§' },
  { value: 'backpacker', label: 'Backpacker', icon: 'ðŸŽ’' },
  { value: 'business', label: 'Business', icon: 'ðŸ’¼' },
];

const BUDGET_LEVELS = [
  { value: 'budget', label: 'Budget', icon: 'ðŸ’¸' },
  { value: 'midrange', label: 'Mid-Range', icon: 'ðŸ’³' },
  { value: 'luxury', label: 'Luxury', icon: 'ðŸ’Ž' },
];

const TRIP_PURPOSES = [
  { value: 'adventure', label: 'Adventure', icon: 'ðŸ§—' },
  { value: 'relaxation', label: 'Relaxation', icon: 'ðŸ–ï¸' },
  { value: 'cultural', label: 'Cultural', icon: 'ðŸ›ï¸' },
  { value: 'pilgrimage', label: 'Pilgrimage', icon: 'ðŸ•Œ' },
  { value: 'honeymoon', label: 'Honeymoon', icon: 'ðŸ’' },
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
        <span>ðŸ—ºï¸</span> Where would you like to go?
      </div>
      <form onSubmit={handleSubmit}>
        {/* Location row */}
        <div className="search-row">
          <div className="search-field">
            <label className="search-label" htmlFor="source">
              <span>ðŸ“</span> From
            </label>
            <input
              id="source"
              type="text"
              className="search-input"
              placeholder="e.g. Mumbai, India"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              disabled={loading}
              autoComplete="off"
              maxLength={100}
            />
          </div>

          <button
            type="button"
            className="search-swap-btn"
            onClick={handleSwap}
            disabled={loading}
            title="Swap source and destination"
            aria-label="Swap source and destination"
          >
            â‡„
          </button>

          <div className="search-field">
            <label className="search-label" htmlFor="destination">
              <span>ðŸŽ¯</span> To
            </label>
            <input
              id="destination"
              type="text"
              className="search-input"
              placeholder="e.g. Goa, India"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={loading}
              autoComplete="off"
              maxLength={100}
            />
          </div>
        </div>

        {/* Date row */}
        <div className="date-row">
          <div className="search-field">
            <label className="search-label" htmlFor="startDate">
              <span>ðŸ“…</span> Departure Date
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
              <span>ðŸ</span> Return Date
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
            <span>ðŸ—“ï¸</span>
            <span>{fmt(startDate)} â†’ {fmt(endDate)}</span>
            <span className="date-summary-pill">{days} day{days !== 1 ? 's' : ''} trip</span>
          </div>
        )}

        {/* Traveller type + number */}
        <div className="pref-row">
          <ChipGroup label="ðŸ‘¤ Traveller Type" options={TRAVELLER_TYPES} value={travellerType} onChange={setTravellerType} disabled={loading} />
          <div className="search-field traveller-count-field">
            <div className="search-label" style={{ marginBottom: 8 }}>ðŸ§‘â€ðŸ¤â€ðŸ§‘ No. of Travellers</div>
            <div className="traveller-count">
              <button type="button" className="count-btn" onClick={() => setNumTravellers(n => Math.max(1, n - 1))} disabled={loading || numTravellers <= 1}>âˆ’</button>
              <span className="count-num">{numTravellers}</span>
              <button type="button" className="count-btn" onClick={() => setNumTravellers(n => Math.min(20, n + 1))} disabled={loading || numTravellers >= 20}>+</button>
            </div>
          </div>
        </div>

        {/* Budget level */}
        <ChipGroup label="ðŸ’° Budget Level" options={BUDGET_LEVELS} value={budgetLevel} onChange={setBudgetLevel} disabled={loading} />

        {/* Trip purpose */}
        <ChipGroup label="ðŸŽ¯ Trip Purpose" options={TRIP_PURPOSES} value={tripPurpose} onChange={setTripPurpose} disabled={loading} />

        <button
          type="submit"
          className={`search-btn ${loading ? 'loading' : ''}`}
          disabled={loading || !source.trim() || !destination.trim()}
        >
          {loading ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>âŸ³</span>
              Generating your travel planâ€¦
            </>
          ) : (
            <>
              <span>âœˆï¸</span> Plan My Trip
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
