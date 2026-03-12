import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import TravelPlan from './components/TravelPlan';
import LoadingSpinner from './components/LoadingSpinner';

const API_BASE = import.meta.env.VITE_API_URL || '';

const RECENTS_KEY = 'aitrip_recents';
const getRecents = () => { try { return JSON.parse(localStorage.getItem(RECENTS_KEY)) || []; } catch { return []; } };
const saveRecent = (src, dst) => {
  const prev = getRecents().filter(r => !(r.source === src && r.destination === dst));
  localStorage.setItem(RECENTS_KEY, JSON.stringify([{ source: src, destination: dst }, ...prev].slice(0, 5)));
};

const THEME_KEY = 'aitrip_theme';
const getInitialTheme = () => localStorage.getItem(THEME_KEY) || 'dark';

const launchConfetti = () => {
  const fire = (opts) => confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, ...opts });
  fire({ angle: 60, origin: { x: 0, y: 0.6 } });
  fire({ angle: 120, origin: { x: 1, y: 0.6 } });
  setTimeout(() => fire({ angle: 90, origin: { x: 0.5, y: 0.4 }, particleCount: 80 }), 250);
};

const FEATURES = [
  { icon: '✈️', title: 'Smart Travel Options', desc: 'AI-curated flights, trains, buses, and road routes with cost estimates and booking tips.' },
  { icon: '🗺️', title: 'Interactive Route Maps', desc: 'Visualize your journey with real map integration and day-wise colour-coded paths.' },
  { icon: '🏛️', title: 'Top Attractions', desc: 'Discover must-visit landmarks, historical sites, nature spots, and hidden gems at your destination.' },
  { icon: '🍜', title: 'Local Cuisine Guide', desc: 'Explore authentic local dishes, street foods, and the best places to taste regional specialties.' },
  { icon: '💱', title: 'Currency Converter', desc: 'Live exchange rates to convert trip costs instantly into your preferred currency.' },
  { icon: '🪪', title: 'Visa Requirements', desc: 'Get a quick overview of visa rules, types, and application resources for your route.' },
];

function App() {
  const [travelPlan, setTravelPlan]       = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [recents, setRecents]             = useState(getRecents);
  const [theme, setTheme]                 = useState(getInitialTheme);

  // Trip comparison state
  const [compareMode, setCompareMode]     = useState(false);
  const [comparePlan, setComparePlan]     = useState(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError]   = useState(null);

  const resultsRef  = useRef(null);
  const compareRef  = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const handlePlanTrip = useCallback(async (source, destination, startDate, endDate, days, preferences = {}) => {
    setLoading(true);
    setError(null);
    setTravelPlan(null);
    setComparePlan(null);
    setCompareMode(false);
    try {
      const res = await axios.post(`${API_BASE}/api/travel/plan`, {
        source, destination, startDate, endDate, days, ...preferences
      }, { timeout: 70000 });
      setTravelPlan(res.data.data);
      saveRecent(source, destination);
      setRecents(getRecents());
      launchConfetti();
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    } catch (err) {
      const msg = err.response?.data?.error
        || (err.code === 'ECONNABORTED' ? 'Request timed out. The AI is taking too long. Please retry.' : null)
        || 'Failed to generate travel plan. Please check the server and your API key.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleComparePlan = useCallback(async (source, destination, startDate, endDate, days, preferences = {}) => {
    setCompareLoading(true);
    setCompareError(null);
    try {
      const res = await axios.post(`${API_BASE}/api/travel/plan`, {
        source, destination, startDate, endDate, days, ...preferences
      }, { timeout: 70000 });
      setComparePlan(res.data.data);
      setTimeout(() => compareRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to generate comparison plan.';
      setCompareError(msg);
    } finally {
      setCompareLoading(false);
    }
  }, []);

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />

      <main>
        {/* Hero + Search */}
        <section className="hero">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />

          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              AI-Powered Travel Intelligence
            </div>
            <h1 className="hero-title">
              Plan Your Perfect Trip with{' '}
              <span className="gradient-text">AI Intelligence</span>
            </h1>
            <p className="hero-subtitle">
              Enter your source and destination to instantly get AI-generated travel options,
              interactive maps, top attractions, local foods, and on-ground assistance contacts.
            </p>
            <SearchForm onSearch={handlePlanTrip} loading={loading} hasPlan={!!travelPlan} />

            {recents.length > 0 && !travelPlan && !loading && (
              <div className="recents">
                <span className="recents-label">🕐 Recent:</span>
                {recents.map((r, i) => (
                  <button key={i} className="recent-chip"
                    onClick={() => handlePlanTrip(r.source, r.destination)}>
                    {r.source} → {r.destination}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div style={{ maxWidth: '800px', margin: '24px auto', padding: '0 2rem' }}>
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Primary Results */}
        {travelPlan && !loading && (
          <div ref={resultsRef}>
            {/* Compare toggle */}
            {!compareMode && (
              <div style={{ textAlign: 'center', padding: '16px 0 0' }}>
                <button className="compare-toggle-btn" onClick={() => setCompareMode(true)}>
                  ⚖️ Compare Another Route
                </button>
              </div>
            )}

            {/* Comparison layout */}
            {compareMode ? (
              <div className="compare-panel" ref={compareRef}>
                <div className="compare-header">
                  <h3>⚖️ Side-by-Side Comparison</h3>
                  <button className="compare-close" onClick={() => { setCompareMode(false); setComparePlan(null); }}>✕</button>
                </div>
                <div className="compare-grid">
                  {/* Plan A */}
                  <div className="compare-col">
                    <div className="compare-col-label">Plan A — {travelPlan.source} → {travelPlan.destination}</div>
                    <TravelPlan data={travelPlan} compact />
                  </div>
                  {/* Plan B */}
                  <div className="compare-col">
                    <div className="compare-col-label">Plan B — Compare Route</div>
                    {!comparePlan && !compareLoading && (
                      <div className="compare-search-wrap">
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                          Search a second route to compare side by side.
                        </p>
                        <SearchForm onSearch={handleComparePlan} loading={compareLoading} compact />
                      </div>
                    )}
                    {compareLoading && <LoadingSpinner />}
                    {compareError && (
                      <div style={{ padding: '16px' }}>
                        <div className="error-banner"><span className="error-icon">⚠️</span>{compareError}</div>
                      </div>
                    )}
                    {comparePlan && !compareLoading && <TravelPlan data={comparePlan} compact />}
                  </div>
                </div>
              </div>
            ) : (
              <TravelPlan data={travelPlan} />
            )}
          </div>
        )}

        {/* Features Grid */}
        {!travelPlan && !loading && (
          <section className="features">
            <p className="features-eyebrow">What you get</p>
            <h2 className="features-title">Everything You Need for Your Journey</h2>
            <p className="features-subtitle">From AI-curated routes to local food guides — your complete travel toolkit.</p>
            <div className="features-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className="feature-card">
                  <div className="feature-icon-wrap"><span className="feature-icon">{f.icon}</span></div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} AI Trip Planner &nbsp;•&nbsp;
          Powered by Groq &amp; Gemini AI &nbsp;•&nbsp;
          Maps by <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> &nbsp;•&nbsp;
          <a href="https://github.com/samariium/AI-Trip-Planner" target="_blank" rel="noopener noreferrer">GitHub</a>
        </p>
      </footer>
    </div>
  );
}

export default App;