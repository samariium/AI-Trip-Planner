const NearbyDestinations = ({ destinations = [], source }) => {
  if (!destinations?.length) return null;
  return (
    <div className="nearby-grid">
      {destinations.map((d, i) => (
        <div key={i} className="nearby-card">
          <div className="nearby-name">📍 {d.name}</div>
          {d.distance && <span className="nearby-dist">🚗 {d.distance}</span>}
          {d.why && <p className="nearby-why">{d.why}</p>}
          {d.tags?.length > 0 && (
            <div className="nearby-tags">
              {d.tags.map((t, ti) => <span key={ti} className="nearby-tag">{t}</span>)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NearbyDestinations;
