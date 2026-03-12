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

const SearchForm = ({ onSearch, loading }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(shiftDate(todayStr(), 1));
  const [endDate, setEndDate] = useState(shiftDate(todayStr(), 4));

  const days = calcDays(startDate, endDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!source.trim() || !destination.trim()) return;
    onSearch(source.trim(), destination.trim(), startDate, endDate, days || 3);
  };

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
  };

  const handleStartDateChange = (val) => {
    setStartDate(val);
    if (endDate && endDate <= val) {
      setEndDate(shiftDate(val, 3));
    }
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
          <div className="search-field">
            <label className="search-label" htmlFor="source">
              <span>📍</span> From
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
            ⇄
          </button>

          <div className="search-field">
            <label className="search-label" htmlFor="destination">
              <span>🎯</span> To
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

        {/* Date summary pill */}
        {days > 0 && (
          <div className="date-summary">
            <span>🗓️</span>
            <span>{fmt(startDate)} → {fmt(endDate)}</span>
            <span className="date-summary-pill">{days} day{days !== 1 ? 's' : ''} trip</span>
          </div>
        )}

        <button
          type="submit"
          className={`search-btn ${loading ? 'loading' : ''}`}
          disabled={loading || !source.trim() || !destination.trim()}
        >
          {loading ? (
            <>
              <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
              Generating your travel plan…
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
