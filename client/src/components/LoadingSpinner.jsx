import { useState, useEffect } from 'react';

const STEPS = [
  { label: 'Contacting AI...', icon: '🤖' },
  { label: 'Generating itinerary...', icon: '📅' },
  { label: 'Geocoding locations...', icon: '📍' },
  { label: 'Building your plan...', icon: '✨' },
];

const SkeletonLine = ({ w = 'w-100' }) => <div className={`skeleton skeleton-line ${w}`} />;

const SkeletonCards = ({ count = 3 }) => (
  <div className="sk-cards-row">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="sk-card">
        <div className="skeleton skeleton-line w-60" style={{ height: 16, marginBottom: 12 }} />
        <SkeletonLine w="w-100" />
        <SkeletonLine w="w-80" />
        <SkeletonLine w="w-60" />
      </div>
    ))}
  </div>
);

const LoadingSpinner = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 2200);
    return () => clearInterval(interval);
  }, []);

  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: '0 1.5rem' }}>
      {/* Progress card */}
      <div className="progress-steps-wrap">
        <div className="progress-plane">✈️</div>
        <div className="progress-title">Crafting Your Trip</div>
        <div className="progress-subtitle">Our AI is building a personalised travel guide…</div>
        <div className="progress-bar-outer">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="progress-step-list">
          {STEPS.map((s, i) => {
            const state = i < step ? 'done' : i === step ? 'active' : '';
            return (
              <div key={i} className={`progress-step ${state}`}>
                <div className="ps-dot">{i < step ? '✓' : i === step ? '…' : ''}</div>
                <span>{s.icon} {s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skeleton placeholders */}
      <div className="skeleton-loader">
        {/* Overview skeleton */}
        <div className="sk-overview">
          <div className="sk-overview-route">
            <div className="skeleton" style={{ height: 26, width: 140 }} />
            <div className="skeleton" style={{ height: 26, width: 30 }} />
            <div className="skeleton" style={{ height: 26, width: 140 }} />
          </div>
          <SkeletonLine w="w-100" />
          <SkeletonLine w="w-80" />
          <div className="sk-cards-row" style={{ marginTop: 20 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="sk-card">
                <div className="skeleton skeleton-line w-60" style={{ height: 12, marginBottom: 8 }} />
                <div className="skeleton skeleton-line w-80" style={{ height: 18 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary skeleton */}
        <div className="sk-section">
          <div className="skeleton sk-section-title skeleton-line" />
          <SkeletonCards count={3} />
        </div>

        {/* Budget skeleton */}
        <div className="sk-section">
          <div className="skeleton sk-section-title skeleton-line" />
          <SkeletonCards count={3} />
        </div>

        {/* Map skeleton */}
        <div className="sk-section">
          <div className="skeleton sk-section-title skeleton-line" />
          <div className="skeleton skeleton-block" style={{ height: 260, width: '100%' }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;