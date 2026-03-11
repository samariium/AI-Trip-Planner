const FOOD_EMOJIS = ['🍜', '🍛', '🥘', '🍱', '🥗', '🍲', '🫕', '🍢', '🥙', '🍔', '🍕', '🥞', '🍰', '🧆', '🥟'];

const TYPE_STYLES = {
  Breakfast:   { bg: '#fef9c3', color: '#713f12' },
  Lunch:       { bg: '#d1fae5', color: '#065f46' },
  Dinner:      { bg: '#ede9fe', color: '#4c1d95' },
  Snack:       { bg: '#ffedd5', color: '#9a3412' },
  Dessert:     { bg: '#fce7f3', color: '#831843' },
  Beverage:    { bg: '#e0f2fe', color: '#0c4a6e' },
  'Street Food': { bg: '#fef3c7', color: '#92400e' }
};

const getTypeStyle = (type = '') => {
  for (const [key, val] of Object.entries(TYPE_STYLES)) {
    if (type.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return { bg: '#f1f5f9', color: '#334155' };
};

const LocalFoods = ({ foods }) => (
  <div className="foods-grid">
    {foods.map((food, i) => {
      const typeStyle = getTypeStyle(food.type);
      const emoji = FOOD_EMOJIS[i % FOOD_EMOJIS.length];

      return (
        <div key={i} className="food-card">
          {food.mustTry && <div className="must-try-badge">🔥 Must Try</div>}

          <div className="food-emoji">{emoji}</div>

          <div className="food-top">
            <span className="food-name">{food.name}</span>
          </div>

          {food.type && (
            <span
              className="food-type-badge"
              style={{ background: typeStyle.bg, color: typeStyle.color, border: 'none', display: 'inline-block', marginBottom: '10px' }}
            >
              {food.type}
            </span>
          )}

          {food.description && (
            <p className="food-desc">{food.description}</p>
          )}

          <div className="food-footer">
            {food.where && (
              <div className="food-meta-pill">
                <span>📍</span> {food.where}
              </div>
            )}
            {food.priceRange && (
              <div className="food-meta-pill">
                <span>💵</span> {food.priceRange}
              </div>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

export default LocalFoods;
