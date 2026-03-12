import { useState } from 'react';

const CATEGORY_ICONS = {
  'Documents': '📄',
  'Clothing': '👕',
  'Toiletries': '🧴',
  'Electronics': '🔌',
  'Health & Safety': '🏥',
  'Adventure Essentials': '🧗',
  'Relaxation Essentials': '🏖️',
  'Cultural Essentials': '🏛️',
  'Pilgrimage Essentials': '🕌',
  'Honeymoon Essentials': '💍',
  'Business Essentials': '💼',
  'Family Essentials': '👨‍👩‍👧',
};

const PackingChecklist = ({ checklist }) => {
  const [checked, setChecked] = useState({});

  if (!checklist?.length) return null;

  const toggle = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalItems = checklist.reduce((acc, cat) => acc + (cat.items?.length || 0), 0);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const pct = totalItems ? Math.round((checkedCount / totalItems) * 100) : 0;

  return (
    <div className="packing-card">
      <div className="packing-header">
        <span className="packing-title">🎒 Packing Checklist</span>
        <span className="packing-progress-text">{checkedCount}/{totalItems} packed</span>
      </div>
      <div className="packing-progress-bar">
        <div className="packing-progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="packing-categories">
        {checklist.map((cat, catIdx) => {
          const catChecked = cat.items?.filter((_, i) => checked[`${catIdx}-${i}`]).length || 0;
          return (
            <div key={catIdx} className="packing-category">
              <div className="packing-cat-header">
                <span className="packing-cat-icon">{CATEGORY_ICONS[cat.category] || '📦'}</span>
                <span className="packing-cat-name">{cat.category}</span>
                <span className="packing-cat-count">{catChecked}/{cat.items?.length || 0}</span>
              </div>
              <div className="packing-items">
                {cat.items?.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  return (
                    <label key={itemIdx} className={`packing-item ${checked[key] ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={!!checked[key]}
                        onChange={() => toggle(catIdx, itemIdx)}
                        className="packing-checkbox"
                      />
                      <span className="packing-item-text">{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {pct === 100 && (
        <div className="packing-done">✅ All packed! Have a great trip! 🎉</div>
      )}
    </div>
  );
};

export default PackingChecklist;
