const OverviewCard = ({ data }) => {
  const stats = [
    { label: 'Best Time to Visit', value: data.bestTimeToVisit || '—', icon: '📅' },
    { label: 'Local Language', value: data.localLanguage || '—', icon: '🗣️' },
    { label: 'Currency', value: data.currency || '—', icon: '💰' },
    { label: 'Travel Options', value: `${data.travelOptions?.length || 0} routes`, icon: '🛣️' },
    { label: 'Attractions', value: `${data.attractions?.length || 0} places`, icon: '📍' },
    { label: 'Local Foods', value: `${data.localFoods?.length || 0} dishes`, icon: '🍽️' }
  ];

  return (
    <div className="overview-banner">
      <div className="overview-inner">
        {/* Fallback / quota warning banner */}
        {data.aiNote && (
          <div style={{
            background: 'rgba(251,191,36,0.15)',
            border: '1px solid rgba(251,191,36,0.4)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#fde68a',
            fontSize: '0.88rem',
            lineHeight: '1.5',
            display: 'flex',
            gap: '8px',
            alignItems: 'flex-start'
          }}>
            <span style={{ flexShrink: 0 }}>⚠️</span>
            <span>{data.aiNote}</span>
          </div>
        )}

        <div className="overview-route">
          <span>{data.source}</span>
          <span className="overview-arrow">→</span>
          <span>{data.destination}</span>
        </div>

        {data.overview && (
          <p className="overview-text">{data.overview}</p>
        )}

        <div className="overview-stats">
          {stats.map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-label">{s.icon} {s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;

