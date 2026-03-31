import { useState, useEffect, useMemo } from 'react';
import { api } from '../api.js';
import Section from '../components/Section.jsx';
import './CreditScorePage.css';

export default function CreditScorePage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getCreditScore()
      .then(setData)
      .catch(err => {
        setError(err.detail || 'Could not load credit score. Please link a credit card first.');
      });
  }, []);

  const scoreAngle = useMemo(() => {
    if (!data || !data.score) return 0;
    return ((data.score - data.range.min) / (data.range.max - data.range.min)) * 360;
  }, [data]);

  if (error) return (
    <div className="cs-page"><Section>
      <h1 className="pg-heading">Credit Score</h1>
      <div className="cs-empty">
        <div className="cs-empty-icon">📊</div>
        <p className="cs-empty-text">{error}</p>
        <p className="cs-empty-sub">Link your credit cards to see your estimated credit score and improvement tips.</p>
      </div>
    </Section></div>
  );

  if (!data) return (
    <div className="cs-page"><Section>
      <h1 className="pg-heading">Credit Score</h1>
      <p className="pg-sub">Loading your score...</p>
    </Section></div>
  );

  if (data.score === 0) return (
    <div className="cs-page"><Section>
      <h1 className="pg-heading">Credit Score</h1>
      <div className="cs-empty">
        <div className="cs-empty-icon">💳</div>
        <p className="cs-empty-text">No credit cards linked</p>
        <p className="cs-empty-sub">Connect your bank accounts to see your estimated credit score based on real data.</p>
      </div>
    </Section></div>
  );

  const utilPct = (p) => p > 50 ? 'var(--red)' : p > 30 ? 'var(--gold)' : 'var(--green)';

  const scoreColor = data.score >= 740 ? 'var(--green)' :
                     data.score >= 670 ? 'var(--gold)' :
                     data.score >= 580 ? '#F97316' : 'var(--red)';

  return (
    <div className="cs-page"><Section>
      <h1 className="pg-heading">Credit Score</h1>
      <p className="pg-sub">Your estimated score based on linked account data</p>

      {/* Estimated badge */}
      <div className="cs-estimated-badge">
        ⚡ Estimated from your Plaid data — not an official FICO score
      </div>

      {/* Score Ring + Rating */}
      <div className="cs-hero">
        <div className="cs-ring-wrap">
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="78" fill="none" stroke="var(--surface2)" strokeWidth="12" />
            <circle cx="90" cy="90" r="78" fill="none" stroke={scoreColor} strokeWidth="12"
              strokeDasharray={`${(scoreAngle / 360) * 490} 490`} strokeLinecap="round" transform="rotate(-90 90 90)"
              style={{ transition: 'stroke-dasharray 1s ease' }} />
          </svg>
          <div className="cs-ring-inner">
            <div className="cs-ring-score" style={{ color: scoreColor }}>{data.score}</div>
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
              <div className="cs-factor-bar-fill" style={{
                width: `${f.score}%`,
                background: f.score > 80 ? 'var(--green)' : f.score > 60 ? 'var(--gold)' : 'var(--red)',
                transition: 'width 0.8s ease',
              }} />
            </div>
            <div className="cs-factor-detail">{f.detail}</div>
          </div>
        ))}
      </div>

      {/* Utilization */}
      {data.utilization && data.utilization.total_limit > 0 && (
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
                <div className="cs-util-bar-fill" style={{
                  width: `${Math.min(c.pct, 100)}%`,
                  background: utilPct(c.pct),
                  transition: 'width 0.6s ease',
                }} />
              </div>
              <div className="cs-util-row-nums">${c.balance.toLocaleString()} / ${c.limit.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      {data.tips && data.tips.length > 0 && (
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
      )}
    </Section></div>
  );
}