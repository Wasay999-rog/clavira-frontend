import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { api } from '../api';
import Section from '../components/Section.jsx';
import './DashboardPage.css';

export default function DashboardPage({ setPage, showToast }) {
  const { user, refreshUser } = useAuth();
  const [creditScore, setCreditScore] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good morning');
    else if (h < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  useEffect(() => {
    Promise.all([
      api.getCreditScore().catch(() => null),
      api.getRewards().catch(() => null),
    ]).then(([cs, rw]) => {
      setCreditScore(cs);
      setRewards(rw);
      setLoading(false);
    });
  }, []);

  const scoreColor = (score) => {
    if (score >= 750) return 'var(--green)';
    if (score >= 700) return 'var(--blue)';
    if (score >= 650) return 'var(--gold)';
    return 'var(--red)';
  };

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="dash-loading-spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <Section style={{ paddingTop: 40, paddingBottom: 0 }}>
        <div className="dash-welcome">
          <div>
            <h1 className="dash-welcome-title">
              {greeting}, {user?.first_name || 'there'} 👋
            </h1>
            <p className="dash-welcome-sub">Here's your financial overview</p>
          </div>
          {!user?.is_verified && (
            <div className="dash-verify-banner">
              <span>📧 Please verify your email to unlock all features</span>
              <button
                onClick={async () => {
                  try {
                    await api.resendVerification(user.email);
                    showToast('Verification email sent!');
                  } catch { showToast('Could not send email. Try again.'); }
                }}
              >
                Resend
              </button>
            </div>
          )}
        </div>
      </Section>

      {/* Quick Stats */}
      <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div className="dash-stats-grid">
          <button className="dash-stat-card" onClick={() => setPage('Credit Score')}>
            <div className="dash-stat-icon" style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--blue)' }}>📊</div>
            <div className="dash-stat-info">
              <div className="dash-stat-label">Credit Score</div>
              <div className="dash-stat-value" style={{ color: creditScore ? scoreColor(creditScore.score) : 'var(--muted)' }}>
                {creditScore?.score || '—'}
              </div>
              <div className="dash-stat-detail">{creditScore?.rating || 'Connect to see'}</div>
            </div>
            <div className="dash-stat-arrow">→</div>
          </button>

          <button className="dash-stat-card" onClick={() => setPage('Rewards')}>
            <div className="dash-stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--green)' }}>💰</div>
            <div className="dash-stat-info">
              <div className="dash-stat-label">Total Rewards</div>
              <div className="dash-stat-value" style={{ color: 'var(--green)' }}>
                ${rewards?.total_value?.toFixed(2) || '0.00'}
              </div>
              <div className="dash-stat-detail">{rewards?.total_points?.toLocaleString() || 0} points</div>
            </div>
            <div className="dash-stat-arrow">→</div>
          </button>

          <button className="dash-stat-card" onClick={() => setPage('Calculator')}>
            <div className="dash-stat-icon" style={{ background: 'rgba(124,58,237,0.12)', color: 'var(--purple)' }}>📉</div>
            <div className="dash-stat-info">
              <div className="dash-stat-label">Total Debt</div>
              <div className="dash-stat-value" style={{ color: 'var(--purple-lighter)' }}>
                ${creditScore?.utilization?.total_balance?.toLocaleString() || '0'}
              </div>
              <div className="dash-stat-detail">
                {creditScore?.utilization?.percentage || 0}% utilization
              </div>
            </div>
            <div className="dash-stat-arrow">→</div>
          </button>

          <div className="dash-stat-card dash-stat-plan">
            <div className="dash-stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--gold)' }}>⭐</div>
            <div className="dash-stat-info">
              <div className="dash-stat-label">Your Plan</div>
              <div className="dash-stat-value" style={{ color: 'var(--gold)', textTransform: 'capitalize' }}>
                {user?.tier || 'Free'}
              </div>
              {user?.tier === 'free' && (
                <button className="dash-upgrade-btn" onClick={() => setPage('Pricing')}>
                  Upgrade
                </button>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Cards Overview */}
      <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div className="dash-section-header">
          <h2 className="dash-section-title">Your Cards</h2>
          <button className="dash-section-link" onClick={() => setPage('Credit Score')}>View all →</button>
        </div>
        <div className="dash-cards-grid">
          {(creditScore?.utilization?.cards || []).slice(0, 4).map(card => (
            <div key={card.name} className="dash-credit-card">
              <div className="dash-cc-top">
                <span className="dash-cc-name">{card.name}</span>
                <span className={`dash-cc-pct ${card.pct > 30 ? 'high' : 'good'}`}>{card.pct}%</span>
              </div>
              <div className="dash-cc-bar-track">
                <div
                  className="dash-cc-bar-fill"
                  style={{
                    width: `${card.pct}%`,
                    background: card.pct > 50 ? 'var(--red)' : card.pct > 30 ? 'var(--gold)' : 'var(--green)',
                  }}
                />
              </div>
              <div className="dash-cc-bottom">
                <span>${card.balance.toLocaleString()} used</span>
                <span>${card.limit.toLocaleString()} limit</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* AI Tips + Rewards Side by Side */}
      <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div className="dash-two-col">
          {/* AI Recommendations */}
          <div className="dash-panel">
            <div className="dash-section-header">
              <h2 className="dash-section-title">🤖 AI Recommendations</h2>
            </div>
            <div className="dash-tips-list">
              {(creditScore?.tips || []).slice(0, 3).map((tip, i) => (
                <div key={i} className="dash-tip-item">
                  <div className={`dash-tip-priority ${tip.priority}`}>
                    {tip.priority === 'high' ? '🔴' : tip.priority === 'medium' ? '🟡' : '🟢'}
                  </div>
                  <div className="dash-tip-content">
                    <div className="dash-tip-text">{tip.tip}</div>
                    <div className="dash-tip-impact">{tip.impact}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="dash-panel-link" onClick={() => setPage('Credit Score')}>
              See all tips →
            </button>
          </div>

          {/* Best Card to Use */}
          <div className="dash-panel">
            <div className="dash-section-header">
              <h2 className="dash-section-title">💳 Best Card for Each Category</h2>
            </div>
            <div className="dash-category-list">
              {(rewards?.category_map || []).slice(0, 5).map((cat, i) => (
                <div key={i} className="dash-category-item">
                  <div className="dash-cat-name">{cat.category}</div>
                  <div className="dash-cat-card">{cat.best_card}</div>
                  <div className="dash-cat-rate">{cat.rate}</div>
                </div>
              ))}
            </div>
            <button className="dash-panel-link" onClick={() => setPage('Rewards')}>
              View rewards →
            </button>
          </div>
        </div>
      </Section>

      {/* Quick Actions */}
      <Section style={{ paddingTop: 24, paddingBottom: 60 }}>
        <div className="dash-section-header">
          <h2 className="dash-section-title">Quick Actions</h2>
        </div>
        <div className="dash-actions-grid">
          {[
            { icon: '📉', label: 'Debt Calculator', desc: 'Plan your payoff strategy', page: 'Calculator' },
            { icon: '🏆', label: 'Rewards Optimizer', desc: 'Maximize your cashback', page: 'Rewards' },
            { icon: '📊', label: 'Credit Score', desc: 'Track your score factors', page: 'Credit Score' },
            { icon: '💬', label: 'Ask Clavira AI', desc: 'Get personalized advice', page: 'Home' },
          ].map(action => (
            <button key={action.label} className="dash-action-card" onClick={() => setPage(action.page)}>
              <span className="dash-action-icon">{action.icon}</span>
              <div className="dash-action-label">{action.label}</div>
              <div className="dash-action-desc">{action.desc}</div>
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}
