const BudgetCard = ({ budget }) => {
  if (!budget) return null;

  const tiers = [
    { key: 'budget', label: 'Budget', emoji: '🟢', color: '#059669', bg: '#f0fdf4' },
    { key: 'midRange', label: 'Mid-Range', emoji: '🟡', color: '#d97706', bg: '#fffbeb' },
    { key: 'luxury', label: 'Luxury', emoji: '🟣', color: '#7c3aed', bg: '#faf5ff' },
  ];

  const rows = [
    { label: '🏨 Accommodation', key: 'accommodation' },
    { label: '🍽️ Food', key: 'food' },
  ];

  return (
    <div className="budget-card">
      <div className="budget-meta-row">
        <div className="budget-meta-item">
          <span className="budget-meta-icon">🚌</span>
          <div>
            <div className="budget-meta-label">Local Transport</div>
            <div className="budget-meta-value">{budget.localTransport || '—'}</div>
          </div>
        </div>
        <div className="budget-meta-item">
          <span className="budget-meta-icon">🎟️</span>
          <div>
            <div className="budget-meta-label">Attractions Entry</div>
            <div className="budget-meta-value">{budget.attractions || '—'}</div>
          </div>
        </div>
      </div>

      <div className="budget-table">
        <div className="budget-thead">
          <div className="budget-cell label-col">Category</div>
          {tiers.map(t => (
            <div key={t.key} className="budget-cell tier-head" style={{ color: t.color }}>
              {t.emoji} {t.label}
            </div>
          ))}
        </div>

        {rows.map(row => (
          <div key={row.key} className="budget-row">
            <div className="budget-cell label-col">{row.label}</div>
            {tiers.map(t => (
              <div key={t.key} className="budget-cell value-col" style={{ '--tier-bg': t.bg }}>
                {budget[row.key]?.[t.key] || '—'}
              </div>
            ))}
          </div>
        ))}

        <div className="budget-row total-row">
          <div className="budget-cell label-col">📊 Total / Day</div>
          {tiers.map(t => (
            <div
              key={t.key}
              className="budget-cell total-cell"
              style={{ color: t.color, background: t.bg }}
            >
              {budget.totalPerDay?.[t.key] || '—'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
