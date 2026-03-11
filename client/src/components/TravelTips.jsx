const TravelTips = ({ tips }) => (
  <div className="tips-grid">
    {tips.map((tip, i) => (
      <div key={i} className="tip-item">
        <div className="tip-number">{i + 1}</div>
        <span>{tip}</span>
      </div>
    ))}
  </div>
);

export default TravelTips;
