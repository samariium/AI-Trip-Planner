const MODE_ICONS = {
  flight: '✈️',
  train: '🚂',
  bus: '🚌',
  car: '🚗',
  ferry: '⛴️',
  metro: '🚇',
  bike: '🏍️',
  walk: '🚶'
};

const getModeIcon = (mode = '') => {
  const key = mode.toLowerCase();
  for (const [k, v] of Object.entries(MODE_ICONS)) {
    if (key.includes(k)) return v;
  }
  return '🚀';
};

const TravelOptions = ({ options }) => (
  <div className="options-grid">
    {options.map((opt, i) => (
      <div key={i} className="option-card">
        <div className="option-header">
          <div className="option-icon">{getModeIcon(opt.mode)}</div>
          <div>
            <div className="option-mode">{opt.mode}</div>
            <div className="option-duration">⏱ {opt.duration}</div>
          </div>
        </div>

        <div className="option-cost">
          💵 {opt.estimatedCost}
        </div>

        {opt.details && (
          <p className="option-details">{opt.details}</p>
        )}

        {(opt.pros || opt.cons) && (
          <div className="option-proscons">
            {opt.pros && <div className="option-pro">✓ {opt.pros}</div>}
            {opt.cons && <div className="option-con">✗ {opt.cons}</div>}
          </div>
        )}

        {opt.bookingTip && (
          <div className="option-book-tip">
            <span>📌</span>
            <span>{opt.bookingTip}</span>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default TravelOptions;
