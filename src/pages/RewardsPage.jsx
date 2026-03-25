import { useState, useEffect } from 'react';
import { api } from '../api.js';
import Section from '../components/Section.jsx';
import './RewardsPage.css';

export default function RewardsPage() {
  const [data, setData] = useState(null);

  useEffect(() => { api.getRewards().then(setData).catch(() => {}); }, []);

  if (!data) return (
    <div className="rewards-page"><Section>
      <h1 className="pg-heading">Rewards Optimizer</h1>
      <p className="pg-sub">Loading your rewards...</p>
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
          <div className="rew-s-val purple">{data.total_points.toLocaleString()}</div>
        </div>
        <div className="rew-summary-col">
          <div className="rew-s-label">Cash Value</div>
          <div className="rew-s-val green">${data.total_value.toFixed(2)}</div>
        </div>
        <div className="rew-summary-col">
          <div className="rew-s-label">Pending Rewards</div>
          <div className="rew-s-val gold">${data.total_pending.toFixed(2)}</div>
        </div>
      </div>

      {/* Cards */}
      <h2 className="rew-section-title">Your Cards</h2>
      <div className="rew-cards-grid">
        {data.cards.map(c => (
          <div key={c.name} className="rew-card">
            <div className="rew-card-name">{c.name}</div>
            <div className="rew-card-rate">{c.cashback_rate}</div>
            <div className="rew-card-points-row">
              <div>
                <div className="rew-card-pts">{c.points.toLocaleString()} pts</div>
                <div className="rew-card-val">${c.points_value.toFixed(2)} value</div>
              </div>
              {c.pending_rewards > 0 && (
                <div className="rew-card-pending">+${c.pending_rewards.toFixed(2)} pending</div>
              )}
            </div>
            <div className="rew-card-best">
              {c.best_for.map(b => <span key={b} className="rew-tag">{b}</span>)}
            </div>
          </div>
        ))}
      </div>

      {/* Category Map */}
      <h2 className="rew-section-title">Best Card by Category</h2>
      <div className="rew-cat-grid">
        {data.category_map.map(c => (
          <div key={c.category} className="rew-cat-item">
            <div className="rew-cat-name">{c.category}</div>
            <div className="rew-cat-card">{c.best_card}</div>
            <div className="rew-cat-rate">{c.rate}</div>
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
