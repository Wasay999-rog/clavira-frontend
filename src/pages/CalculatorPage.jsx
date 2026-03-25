import { useState, useEffect, useMemo } from 'react';
import { api } from '../api.js';
import Section from '../components/Section.jsx';
import './CalculatorPage.css';

const INIT = [
  { name: 'Amex Blue Cash Everyday', balance: 4118, apr: 21.24 },
  { name: 'Citi Diamond Preferred', balance: 3918, apr: 27.49 },
  { name: 'Chase Freedom Unlimited', balance: 1238, apr: 20.49 },
  { name: 'Amazon Prime Store Card', balance: 1187, apr: 28.24 },
  { name: 'Apple Card', balance: 635, apr: 24.49 },
  { name: 'Discover it Cash Back', balance: 295, apr: 22.99 },
  { name: 'Bank of America', balance: 152, apr: 18.24 },
];

const STRATS = [
  { key: 'avalanche', label: 'Avalanche', desc: 'Highest APR first', color: 'var(--blue)' },
  { key: 'snowball', label: 'Snowball', desc: 'Smallest balance first', color: 'var(--gold)' },
  { key: 'hybrid', label: 'AI Hybrid', desc: 'Smart blend', color: 'var(--green)' },
];

const aprColor = apr => apr >= 28 ? 'var(--red)' : apr >= 22 ? 'var(--gold)' : 'var(--green)';

export default function CalculatorPage() {
  const [cards, setCards] = useState(INIT);
  const [extra, setExtra] = useState(200);
  const [strategy, setStrategy] = useState('hybrid');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const totalDebt = useMemo(() => cards.reduce((s, c) => s + c.balance, 0), [cards]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try { const r = await api.compare(cards, extra, strategy); if (!cancelled) setData(r); } catch {}
      finally { if (!cancelled) setLoading(false); }
    };
    const t = setTimeout(run, 250);
    return () => { cancelled = true; clearTimeout(t); };
  }, [cards, extra, strategy]);

  const updateApr = (i, v) => {
    const clean = v.replace(/[^0-9.]/g, '');
    setCards(p => p.map((c, j) => j === i ? { ...c, apr: clean === '' ? 0 : parseFloat(clean) || 0 } : c));
  };

  const result = data?.[strategy] || data?.hybrid;
  const minResult = data?.min_only;
  const interestSaved = result && minResult ? Math.max(0, Math.round(minResult.total_interest - result.total_interest)) : 0;
  const monthsFaster = result && minResult ? Math.max(0, minResult.months - result.months) : 0;

  const chartSvg = useMemo(() => {
    if (!data) return '';
    const w = 580, h = 200, pad = 40;
    const lines = [
      { d: data.min_only?.timeline||[], color: '#7C749A', label: 'Min Only' },
      { d: data.avalanche?.timeline||[], color: '#3B82F6', label: 'Avalanche' },
      { d: data.snowball?.timeline||[], color: '#F59E0B', label: 'Snowball' },
      { d: data.hybrid?.timeline||[], color: '#10B981', label: 'AI Hybrid' },
    ];
    const maxM = Math.max(...lines.map(l => l.d.length), 1);
    const maxV = Math.max(totalDebt * 1.05, 1);
    const paths = lines.map(l => {
      if (!l.d.length) return '';
      const pts = l.d.map((v, i) => { const x = pad+(i/Math.max(maxM-1,1))*(w-pad*2); const y = pad+(1-v/maxV)*(h-pad*2); return `${x.toFixed(1)},${y.toFixed(1)}`; });
      return `<polyline points="${pts.join(' ')}" fill="none" stroke="${l.color}" stroke-width="2" stroke-linecap="round" opacity="0.8"/>`;
    }).join('');
    const legend = lines.map((l,i) => { const x = pad+i*125; return `<circle cx="${x}" cy="${h-6}" r="3.5" fill="${l.color}"/><text x="${x+8}" y="${h-2}" fill="#7C749A" font-size="10" font-family="Inter,sans-serif">${l.label}</text>`; }).join('');
    return `<svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg"><text x="${pad}" y="${pad-8}" fill="#7C749A" font-size="10" font-family="Inter,sans-serif">$${Math.round(maxV).toLocaleString()}</text><text x="${w-pad}" y="${h-pad+16}" fill="#7C749A" font-size="10" font-family="Inter,sans-serif" text-anchor="end">${maxM}mo</text><line x1="${pad}" y1="${pad}" x2="${pad}" y2="${h-pad}" stroke="#1E1A36" stroke-width="1"/><line x1="${pad}" y1="${h-pad}" x2="${w-pad}" y2="${h-pad}" stroke="#1E1A36" stroke-width="1"/>${paths}${legend}</svg>`;
  }, [data, totalDebt]);

  return (
    <div className="calc-page"><Section>
      <h1 className="pg-heading">Debt Payoff Calculator</h1>
      <p className="pg-sub">See how fast you can become debt-free</p>

      <div className="calc-card">
        <div className="calc-th"><span>Card</span><span>Balance</span><span>APR %</span></div>
        {cards.map((c, i) => (
          <div key={c.name} className="calc-tr">
            <span className="calc-name">{c.name}</span>
            <span className="calc-bal">${c.balance.toLocaleString()}</span>
            <input className="calc-apr" value={c.apr} onChange={e => updateApr(i, e.target.value)} style={{ color: aprColor(c.apr) }} />
          </div>
        ))}
        <div className="calc-total">Total: <span>${totalDebt.toLocaleString()}</span></div>
      </div>

      <div className="calc-card">
        <div className="calc-card-title">Extra Monthly Payment</div>
        <div className="calc-slider-row">
          <input type="range" min={0} max={1000} step={10} value={extra} onChange={e => setExtra(+e.target.value)} className="calc-slider" />
          <div className="calc-amt-wrap"><span className="calc-dollar">$</span>
            <input type="number" value={extra} onChange={e => setExtra(Math.max(0, Math.min(1000, +e.target.value || 0)))} className="calc-amt" />
          </div>
        </div>
      </div>

      <div className="calc-strats">
        {STRATS.map(s => (
          <button key={s.key} className={`calc-strat ${strategy===s.key?'active':''}`} onClick={() => setStrategy(s.key)} style={{ '--sc': s.color }}>
            <div className="calc-strat-name">{s.label}</div><div className="calc-strat-desc">{s.desc}</div>
          </button>
        ))}
      </div>

      {result && <div className="calc-card">
        <div className="calc-card-title">Payoff Order {loading && <span className="calc-load">updating...</span>}</div>
        {result.order.map((idx, rank) => (
          <div key={idx} className="calc-order-row">
            <div className={`calc-order-num ${rank===0?'first':''}`}>{rank+1}</div>
            <span className="calc-order-name">{cards[idx].name}</span>
            <span className="calc-order-bal">${cards[idx].balance.toLocaleString()}</span>
            <span className="calc-order-apr" style={{ color: aprColor(cards[idx].apr) }}>{cards[idx].apr}%</span>
            {rank===0 && <span className="calc-attack">← Attack now</span>}
          </div>
        ))}
      </div>}

      {data && <div className="calc-card"><div className="calc-card-title">Payoff Timeline</div><div dangerouslySetInnerHTML={{ __html: chartSvg }} /></div>}

      {result && minResult && <div className="calc-summary">
        <div><div className="calc-s-label">Min-Only Interest</div><div className="calc-s-val red">${Math.round(minResult.total_interest).toLocaleString()}</div><div className="calc-s-sub">{minResult.months} months</div></div>
        <div><div className="calc-s-label">Interest Saved</div><div className="calc-s-val green">${interestSaved.toLocaleString()}</div><div className="calc-s-sub">with {strategy==='hybrid'?'AI Hybrid':strategy}</div></div>
        <div><div className="calc-s-label">Debt-Free In</div><div className="calc-s-val purple">{result.months} mo</div><div className="calc-s-sub">{monthsFaster} months faster</div></div>
      </div>}
    </Section></div>
  );
}
