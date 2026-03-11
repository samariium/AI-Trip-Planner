const CATEGORY_STYLES = {
  Historical:    { bg: '#fef3c7', color: '#92400e', bar: '#f59e0b', icon: '🏛️' },
  Nature:        { bg: '#d1fae5', color: '#065f46', bar: '#10b981', icon: '🌿' },
  Religious:     { bg: '#ede9fe', color: '#4c1d95', bar: '#8b5cf6', icon: '⛪' },
  Entertainment: { bg: '#fce7f3', color: '#831843', bar: '#ec4899', icon: '🎭' },
  Shopping:      { bg: '#ffedd5', color: '#9a3412', bar: '#f97316', icon: '🛍️' },
  Art:           { bg: '#dbeafe', color: '#1e3a8a', bar: '#3b82f6', icon: '🎨' },
  Beach:         { bg: '#e0f2fe', color: '#0c4a6e', bar: '#0891b2', icon: '🏖️' },
  Adventure:     { bg: '#dcfce7', color: '#14532d', bar: '#22c55e', icon: '🧗' }
};

const getStyle = (category = '') => {
  for (const [key, val] of Object.entries(CATEGORY_STYLES)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return { bg: '#f1f5f9', color: '#334155', bar: '#64748b', icon: '📍' };
};

const Attractions = ({ attractions }) => (
  <div className="attractions-grid">
    {attractions.map((attr, i) => {
      const style = getStyle(attr.category);
      return (
        <div key={i} className="attraction-card">
          <div className="attraction-color-bar" style={{ background: style.bar }} />
          <div className="attraction-body">
            <div className="attraction-top">
              <span className="attraction-icon">{style.icon}</span>
              {attr.category && (
                <span
                  className="attraction-category"
                  style={{ background: style.bg, color: style.color }}
                >
                  {attr.category}
                </span>
              )}
            </div>

            <h3 className="attraction-name">{attr.name}</h3>

            {attr.description && (
              <p className="attraction-desc">{attr.description}</p>
            )}

            <div className="attraction-meta">
              {attr.visitDuration && (
                <div className="attraction-meta-item">
                  <span>⏱</span> {attr.visitDuration}
                </div>
              )}
              {attr.entryFee && (
                <div className="attraction-meta-item">
                  <span>🎟️</span> {attr.entryFee}
                </div>
              )}
              {attr.bestTime && (
                <div className="attraction-meta-item">
                  <span>🌤️</span> {attr.bestTime}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default Attractions;
