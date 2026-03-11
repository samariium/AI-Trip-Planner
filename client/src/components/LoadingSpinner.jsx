const STEPS = [
  'Analyzing your route...',
  'Fetching travel options...',
  'Generating AI recommendations...',
  'Building your travel guide...'
];

const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-card">
      <div className="loading-plane">✈️</div>
      <div className="loading-title">Planning Your Trip</div>
      <div className="loading-subtitle">
        Our AI is crafting a personalized travel guide for you
      </div>
      <div className="loading-bar-wrap">
        <div className="loading-bar" />
      </div>
      <div className="loading-steps">
        {STEPS.map((step, i) => (
          <div key={i} className="loading-step" style={{ animationDelay: `${i * 0.6}s` }}>
            <div className="loading-step-dot" style={{ animationDelay: `${i * 0.6}s` }} />
            {step}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LoadingSpinner;
