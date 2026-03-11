const Header = ({ theme, onToggleTheme }) => (
  <header className="header">
    <div className="header-inner">
      <div className="header-logo">
        <span className="header-logo-icon">✈️</span>
        <div className="header-logo-text">
          AI <span>Trip</span> Planner
        </div>
      </div>
      <div className="header-right">
        <span className="header-tagline">Smart Travel Intelligence</span>
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

