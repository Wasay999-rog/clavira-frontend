import { useState, useEffect } from 'react';
import { api } from '../api.js';
import Section from '../components/Section.jsx';
import './RewardsPage.css';

export default function RewardsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getRewards()
      .then(setData)
      .catch(err => {
        setError(err.detail || 'Could not load rewards. Please link a credit card first.');
      });
  }, []);

  if (error) return (
    <div className="rewards-page"><Section>
      <h1 className="pg-heading">Rewards Optimizer</h1>
      <div className="rew-empty">
        <div className="rew-empty-icon">🎯</div>
        <p className="rew-empty-text">{error}</p>
        <p className="rew-empty-sub">Link your credit cards to see real rewards data and optimization tips.</p>
      </div>
    </Section></div>
  );

  if (!data) return (
    <div className="rewards-page"><Section>
      <h1 className="pg-heading">Rewards Optimizer</h1>
      <p className="pg-sub">Loading your rewards...</p>
    </Section></div>
  );

  const hasCards = data.cards && data.cards.length > 0;

  if (!hasCards) return (
    <div className="rewards-page"><Section>
      <h1 className="pg-heading">Rewards Optimizer</h1>
      <div className="rew-empty">
        <div className="rew-empty-icon">💳</div>
        <p className="rew-empty-text">No credit cards linked yet</p>
        <p className="rew-empty-sub">Connect your bank accounts to see your rewards, spending breakdown, and optimization tips.</p>
      </div>
    </Section></div>
  );

  return (
    <div className="rewards-page"><Section>
      <h1 className="pg-heading">Rewards Optimizer</h1>
      <p className="pg-sub">Maximize every dollar of cashback and points</p>

      {/* Summary Strip */}
      <div className="rew-summary">
        <div className="rew-summary-col">
          <div className="rew-s-label">Total Points</div>
          <div className="rew-s-val purple">{(data.total_points || 0).toLocaleString()}</div>
        </div>
        <div className="rew-summary-col">
          <div className="rew-s-label">Cash Value</div>
          <div className="rew-s-val green">${(data.total_value || 0).toFixed(2)}</div>
        </div>
        <div className="rew-summary-col">
          <div className="rew-s-label">Pending</div>
          <div className="rew-s-val gold">${(data.total_pending || 0).toFixed(2)}</div>
        </div>
      </div>

      {/* Spending by Category (with emojis + donut) */}
      {data.spending_by_category && data.spending_by_category.length > 0 && (
        <>
          <h2 className="rew-section-title">Spending Breakdown</h2>
          <div className="rew-spending-grid">
            {/* Donut Chart */}
            <div className="rew-donut-wrap">
              <SpendingDonut categories={data.spending_by_category} />
            </div>
            {/* Category List */}
            <div className="rew-cat-list">
              {data.spending_by_category.map((c, i) => (
                <div key={c.category} className="rew-spend-row">
                  <div className="rew-spend-dot" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                  <span className="rew-spend-emoji">{c.emoji}</span>
                  <span className="rew-spend-name">{c.category}</span>
                  <span className="rew-spend-amount">${c.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  <span className="rew-spend-pct">{c.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Cards */}
      <h2 className="rew-section-title">Your Cards</h2>
      <div className="rew-cards-grid">
        {data.cards.map(c => (
          <div key={c.name + c.mask} className="rew-card">
            <div className="rew-card-name">
              {c.name}
              {c.mask && <span className="rew-card-mask">••{c.mask}</span>}
            </div>
            <div className="rew-card-rate">{c.cashback_rate}</div>
            <div className="rew-card-points-row">
              <div>
                <div className="rew-card-pts">{(c.points || 0).toLocaleString()} pts</div>
                <div className="rew-card-val">${(c.points_value || 0).toFixed(2)} value</div>
              </div>
              {c.pending_rewards > 0 && (
                <div className="rew-card-pending">+${c.pending_rewards.toFixed(2)} pending</div>
              )}
            </div>
            {c.total_spent > 0 && (
              <div className="rew-card-spent">Total spent: ${c.total_spent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            )}
            <div className="rew-card-best">
              {c.best_for.map(b => <span key={b} className="rew-tag">{b}</span>)}
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <h2 className="rew-section-title">Optimization Tips</h2>
      <div className="rew-tips">
        {data.optimization_tips.map((t, i) => (
          <div key={i} className="rew-tip">
            <div className={`rew-tip-impact ${t.impact}`}>{t.impact}</div>
            <div className="rew-tip-text">{t.tip}</div>
          </div>
        ))}
      </div>
    </Section></div>
  );
}


// ─── SVG Donut Chart ───

const DONUT_COLORS = [
  '#7C3AED', '#10B981', '#F59E0B', '#3B82F6', '#F43F5E',
  '#8B5CF6', '#06B6D4', '#EC4899', '#84CC16', '#F97316',
  '#6366F1', '#14B8A6',
];

function SpendingDonut({ categories }) {
  const total = categories.reduce((s, c) => s + c.amount, 0);
  if (total === 0) return null;

  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 70;
  const strokeWidth = 28;

  let cumulative = 0;
  const segments = categories.map((cat, i) => {
    const pct = cat.amount / total;
    const dashLength = pct * 2 * Math.PI * r;
    const gapLength = (1 - pct) * 2 * Math.PI * r;
    const offset = -cumulative * 2 * Math.PI * r + (Math.PI * r / 2); // rotate -90deg start
    cumulative += pct;

    return (
      <circle
        key={cat.category}
        cx={cx} cy={cy} r={r}
        fill="none"
        stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
        strokeWidth={strokeWidth}
        strokeDasharray={`${dashLength} ${gapLength}`}
        strokeDashoffset={-offset}
        style={{ transition: 'stroke-dasharray 0.5s ease' }}
      />
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface2)" strokeWidth={strokeWidth} />
      {segments}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="var(--text)" fontSize="22" fontWeight="800" fontFamily="Inter,sans-serif">
        ${Math.round(total).toLocaleString()}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--muted)" fontSize="11" fontFamily="Inter,sans-serif">
        total spent
      </text>
    </svg>
  );
}