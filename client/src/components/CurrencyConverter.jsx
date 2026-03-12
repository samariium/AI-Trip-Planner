import { useState, useEffect, useRef } from 'react';

/* Popular currencies */
const CURRENCIES = [
  { code: 'USD', label: 'US Dollar' },
  { code: 'EUR', label: 'Euro' },
  { code: 'GBP', label: 'British Pound' },
  { code: 'JPY', label: 'Japanese Yen' },
  { code: 'AUD', label: 'Australian Dollar' },
  { code: 'CAD', label: 'Canadian Dollar' },
  { code: 'CHF', label: 'Swiss Franc' },
  { code: 'CNY', label: 'Chinese Yuan' },
  { code: 'INR', label: 'Indian Rupee' },
  { code: 'AED', label: 'UAE Dirham' },
  { code: 'SGD', label: 'Singapore Dollar' },
  { code: 'THB', label: 'Thai Baht' },
  { code: 'MYR', label: 'Malaysian Ringgit' },
  { code: 'IDR', label: 'Indonesian Rupiah' },
  { code: 'PHP', label: 'Philippine Peso' },
  { code: 'KRW', label: 'South Korean Won' },
  { code: 'MXN', label: 'Mexican Peso' },
  { code: 'BRL', label: 'Brazilian Real' },
];

/* Extract first numeric value from a string like "₹800–₹1500" */
const parseAmount = (str = '') => {
  const cleaned = str.replace(/[,]/g, '');
  const match = cleaned.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
};

/* Best-effort: detect ISO code from currency string like "Indian Rupee (INR)" */
const detectBaseCurrency = (currencyStr = '') => {
  const m = currencyStr.match(/\(([A-Z]{3})\)/);
  if (m) return m[1];
  const lower = currencyStr.toLowerCase();
  if (lower.includes('rupee') || lower.includes('inr')) return 'INR';
  if (lower.includes('dollar') && lower.includes('us')) return 'USD';
  if (lower.includes('euro')) return 'EUR';
  if (lower.includes('pound')) return 'GBP';
  if (lower.includes('yen')) return 'JPY';
  if (lower.includes('dirham')) return 'AED';
  if (lower.includes('baht')) return 'THB';
  if (lower.includes('ringgit')) return 'MYR';
  return 'USD';
};

const CurrencyConverter = ({ budget, currency }) => {
  const baseCurrency = detectBaseCurrency(currency);
  const [target, setTarget] = useState('USD');
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cacheRef = useRef({});

  useEffect(() => {
    if (target === baseCurrency) { setRates(null); return; }
    if (cacheRef.current[baseCurrency]) {
      setRates(cacheRef.current[baseCurrency]);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`)
      .then(r => r.json())
      .then(data => {
        if (data.result === 'success') {
          cacheRef.current[baseCurrency] = data.rates;
          setRates(data.rates);
        } else {
          setError('Could not fetch exchange rates.');
        }
      })
      .catch(() => setError('Could not fetch exchange rates.'))
      .finally(() => setLoading(false));
  }, [target, baseCurrency]);

  if (!budget) return null;

  const convert = (str) => {
    if (!rates || target === baseCurrency) return null;
    const amount = parseAmount(str);
    if (!amount) return null;
    const rate = rates[target];
    if (!rate) return null;
    const converted = amount * rate;
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency', currency: target, maximumFractionDigits: 0,
    }).format(converted);
    return formatted;
  };

  const items = [
    { label: 'Budget Accommodation / night', val: budget?.accommodation?.budget },
    { label: 'Mid-Range Hotel / night', val: budget?.accommodation?.midRange },
    { label: 'Luxury Hotel / night', val: budget?.accommodation?.luxury },
    { label: 'Budget Food / day', val: budget?.food?.budget },
    { label: 'Mid-Range Food / day', val: budget?.food?.midRange },
    { label: 'Daily Transport', val: budget?.localTransport },
    { label: 'Budget Total / day', val: budget?.totalPerDay?.budget },
    { label: 'Mid-Range Total / day', val: budget?.totalPerDay?.midRange },
    { label: 'Luxury Total / day', val: budget?.totalPerDay?.luxury },
  ].filter(i => i.val);

  return (
    <div className="currency-card">
      <div className="currency-header">
        <span className="currency-icon">💱</span>
        <span className="currency-title">Currency Converter</span>
        <span className="currency-note">Base: {baseCurrency}</span>
      </div>

      <div className="currency-selector">
        <label>Convert to:</label>
        <select className="currency-select" value={target} onChange={e => setTarget(e.target.value)}>
          {CURRENCIES.map(c => (
            <option key={c.code} value={c.code}>{c.code} – {c.label}</option>
          ))}
        </select>
      </div>

      {loading && <div className="currency-loading">Fetching live rates…</div>}
      {error && <div className="currency-loading" style={{ color: '#ef4444' }}>{error}</div>}

      {!loading && !error && (
        <div className="currency-grid">
          {items.map((item, i) => {
            const converted = convert(item.val);
            return (
              <div key={i} className="currency-item">
                <div className="currency-item-label">{item.label}</div>
                <div className="currency-item-value">
                  {target === baseCurrency || !converted ? item.val : converted}
                </div>
                {converted && target !== baseCurrency && (
                  <div className="currency-item-orig">{item.val} {baseCurrency}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div className="currency-rate-note">Live exchange rates via open.er-api.com</div>
    </div>
  );
};

export default CurrencyConverter;
