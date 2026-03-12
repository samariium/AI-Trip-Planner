import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import TravelPlan from './components/TravelPlan';
import LoadingSpinner from './components/LoadingSpinner';

const API_BASE = import.meta.env.VITE_API_URL || '';

// ─── Recent Searches helpers ───────────────────────────────────────
const RECENTS_KEY = 'aitrip_recents';
const getRecents = () => { try { return JSON.parse(localStorage.getItem(RECENTS_KEY)) || []; } catch { return []; } };
const saveRecent = (src, dst) => {
  const prev = getRecents().filter(r => !(r.source === src && r.destination === dst));
  const next = [{ source: src, destination: dst }, ...prev].slice(0, 5);
  localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
};

// ─── Dark mode helpers ─────────────────────────────────────────────
const THEME_KEY = 'aitrip_theme';
const getInitialTheme = () => localStorage.getItem(THEME_KEY) || 'dark';

function App() {
  const [travelPlan, setTravelPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recents, setRecents] = useState(getRecents);
  const [theme, setTheme] = useState(getInitialTheme);
  const resultsRef = useRef(null);

  // Apply theme class to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const handlePlanTrip = async (source, destination, startDate, endDate, days, preferences = {}) => {
    setLoading(true);
    setError(null);
    setTravelPlan(null);

    try {
      const response = await axios.post(`${API_BASE}/api/travel/plan`, {
        source, destination, startDate, endDate, days, ...preferences
      }, {
        timeout: 60000
      });
      setTravelPlan(response.data.data);
      saveRecent(source, destination);
      setRecents(getRecents());
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err) {
      const msg = err.response?.data?.error
        || (err.code === 'ECONNABORTED' ? 'Request timed out. The AI is taking too long. Please retry.' : null)
        || 'Failed to generate travel plan. Please check the server and your API key.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const FEATURES = [
    { icon: '✈️', title: 'Smart Travel Options', desc: 'AI-curated flights, trains, buses, and road routes with cost estimates and booking tips.' },
    { icon: '🗺️', title: 'Interactive Route Maps', desc: 'Visualize your journey with real map integration and actual road routing via OpenStreetMap.' },
    { icon: '🏛️', title: 'Top Attractions', desc: 'Discover must-visit landmarks, historical sites, nature spots, and hidden gems at your destination.' },
    { icon: '🍜', title: 'Local Cuisine Guide', desc: 'Explore authentic local dishes, street foods, and the best places to taste regional specialties.' },
    { icon: '📞', title: 'Local Assistance', desc: 'Access guides, taxi contacts, emergency numbers, hospitals, and tourism offices at your destination.' },
    { icon: '🤖', title: 'AI-Powered Planning', desc: 'GPT-4o-mini powered recommendations tailored to your specific source and destination combination.' }
  ];

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
            <SearchForm onSearch={handlePlanTrip} loading={loading} />

            {/* Recently Searched */}
            {recents.length > 0 && !travelPlan && !loading && (
              <div className="recents">
                <span className="recents-label">🕐 Recent:</span>
                {recents.map((r, i) => (
                  <button
                    key={i}
                    className="recent-chip"
                    onClick={() => handlePlanTrip(r.source, r.destination)}
                  >
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

        {/* Results */}
        {travelPlan && !loading && (
          <div ref={resultsRef}>
            <TravelPlan data={travelPlan} />
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
                  <div className="feature-icon-wrap">
                    <span className="feature-icon">{f.icon}</span>
                  </div>
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
          Maps by <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
