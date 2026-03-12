const Header = ({ theme, onToggleTheme }) => (
  <header className="header">
    <div className="header-inner">
      <div className="header-logo">
        <span className="header-logo-icon">✈️</span>
        <div className="header-logo-text">
          <div>AI <span>Trip</span> Planner</div>
          <div style={{ fontSize: '0.62rem', fontWeight: 500, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 1 }}>Smart Travel Intelligence</div>
        </div>
      </div>
      <div className="header-right">
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle dark/light mode"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  </header>
);

export default Header;

