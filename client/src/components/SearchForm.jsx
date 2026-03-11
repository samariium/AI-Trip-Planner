import { useState } from 'react';

const SearchForm = ({ onSearch, loading }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!source.trim() || !destination.trim()) return;
    onSearch(source.trim(), destination.trim());
  };

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
  };

  return (
    <div className="search-card">
      <div className="search-card-title">
        <span>🗺️</span> Where would you like to go?
      </div>
      <form onSubmit={handleSubmit}>
        <div className="search-row">
          {/* Source */}
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

          {/* Swap Button */}
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

          {/* Destination */}
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
