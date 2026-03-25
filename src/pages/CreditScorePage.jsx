import { useState, useEffect, useMemo } from 'react';
import { api } from '../api.js';
import Section from '../components/Section.jsx';
import './CreditScorePage.css';

export default function CreditScorePage() {
  const [data, setData] = useState(null);
  useEffect(() => { api.getCreditScore().then(setData).catch(() => {}); }, []);

  const scoreAngle = useMemo(() => {
    if (!data) return 0;
    return ((data.score - data.range.min) / (data.range.max - data.range.min)) * 360;
  }, [data]);

  const historyChart = useMemo(() => {
    if (!data?.history) return '';
    const w = 500, h = 160, pad = 40;
    const pts = data.history;
    const minS = Math.min(...pts.map(p => p.score)) - 10;
    const maxS = Math.max(...pts.map(p => p.score)) + 10;
    const points = pts.map((p, i) => {
      const x = pad + (i / (pts.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (p.score - minS) / (maxS - minS)) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const labels = pts.map((p, i) => {
      const x = pad + (i / (pts.length - 1)) * (w - pad * 2);
      return `<text x="${x}" y="${h - 5}" fill="#7C749A" font-size="10" text-anchor="middle" font-family="Inter,sans-serif">${p.month}</text>`;
    }).join('');
    const dots = pts.map((p, i) => {
      const x = pad + (i / (pts.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (p.score - minS) / (maxS - minS)) * (h - pad * 2);
      return `<circle cx="${x}" cy="${y}" r="4" fill="#10B981"/><text x="${x}" y="${y - 10}" fill="#F0EEFF" font-size="10" text-anchor="middle" font-family="Inter,sans-serif" font-weight="600">${p.score}</text>`;
    }).join('');
    return `<svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <polyline points="${points.join(' ')}" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
      ${dots}${labels}
    </svg>`;
  }, [data]);

  if (!data) return (
    <div className="cs-page"><Section>
      <h1 className="pg-heading">Credit Score</h1>
      <p className="pg-sub">Loading your score...</p>
    </Section></div>
  );

  const utilPct = (p) => p > 50 ? 'var(--red)' : p > 30 ? 'var(--gold)' : 'var(--green)';

  return (
    <div className="cs-page"><Section>
      <h1 className="pg-heading">Credit Score</h1>
      <p className="pg-sub">Monitor and improve your credit health</p>

      {/* Score Ring + Rating */}
      <div className="cs-hero">
        <div className="cs-ring-wrap">
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="78" fill="none" stroke="var(--surface2)" strokeWidth="12" />
            <circle cx="90" cy="90" r="78" fill="none" stroke="var(--green)" strokeWidth="12"
              strokeDasharray={`${(scoreAngle / 360) * 490} 490`} strokeLinecap="round" transform="rotate(-90 90 90)" />
          </svg>
          <div className="cs-ring-inner">
            <div className="cs-ring-score">{data.score}</div>
            <div className="cs-ring-rating">{data.rating}</div>
          </div>
        </div>
        <div className="cs-hero-right">
          <div className="cs-range-bar">
            <div className="cs-range-labels">
              <span>Poor</span><span>Fair</span><span>Good</span><span>Excellent</span>
            </div>
            <div className="cs-range-track">
              <div className="cs-range-marker" style={{ left: `${((data.score - 300) / 550) * 100}%` }} />
            </div>
            <div className="cs-range-nums"><span>300</span><span>850</span></div>
          </div>
        </div>
      </div>

      {/* Score History */}
      <div className="cs-card">
        <div className="cs-card-title">Score Trend (6 months)</div>
        <div dangerouslySetInnerHTML={{ __html: historyChart }} />
      </div>

      {/* Factors */}
      <div className="cs-card">
        <div className="cs-card-title">Score Factors</div>
        {data.factors.map(f => (
          <div key={f.name} className="cs-factor">
            <div className="cs-factor-top">
              <span className="cs-factor-name">{f.name}</span>
              <span className={`cs-factor-status ${f.status}`}>{f.status}</span>
              <span className="cs-factor-weight">{f.weight}% weight</span>
            </div>
            <div className="cs-factor-bar-track">
              <div className="cs-factor-bar-fill" style={{ width: `${f.score}%`, background: f.score > 80 ? 'var(--green)' : f.score > 60 ? 'var(--gold)' : 'var(--red)' }} />
            </div>
            <div className="cs-factor-detail">{f.detail}</div>
          </div>
        ))}
      </div>

      {/* Utilization */}
      <div className="cs-card">
        <div className="cs-card-title">
          Credit Utilization
          <span className="cs-util-pct" style={{ color: utilPct(data.utilization.percentage) }}>
            {data.utilization.percentage}% overall
          </span>
        </div>
        <div className="cs-util-summary">
          ${data.utilization.total_balance.toLocaleString()} used of ${data.utilization.total_limit.toLocaleString()} total
        </div>
        {data.utilization.cards.map(c => (
          <div key={c.name} className="cs-util-row">
            <div className="cs-util-row-top">
              <span>{c.name}</span>
              <span style={{ color: utilPct(c.pct) }}>{c.pct}%</span>
            </div>
            <div className="cs-util-bar-track">
              <div className="cs-util-bar-fill" style={{ width: `${c.pct}%`, background: utilPct(c.pct) }} />
            </div>
            <div className="cs-util-row-nums">${c.balance.toLocaleString()} / ${c.limit.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="cs-card">
        <div className="cs-card-title">Tips to Improve</div>
        {data.tips.map((t, i) => (
          <div key={i} className="cs-tip">
            <div className={`cs-tip-priority ${t.priority}`}>{t.priority}</div>
            <div className="cs-tip-body">
              <div className="cs-tip-text">{t.tip}</div>
              <div className="cs-tip-impact">{t.impact}</div>
            </div>
          </div>
        ))}
      </div>
    </Section></div>
  );
}
