import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { api } from '../api';
import Section from '../components/Section.jsx';
import './DashboardPage.css';

export default function DashboardPage({ navigate, showToast }) {
  const { user, refreshUser } = useAuth();
  const [creditScore, setCreditScore] = useState(null);
  const [rewards, setRewards] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [transactions, setTransactions] = useState(null);
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
      api.getAccounts().catch(() => null),
      api.getTransactions().catch(() => null),
    ]).then(([cs, rw, acc, tx]) => {
      setCreditScore(cs);
      setRewards(rw);
      setAccounts(acc);
      setTransactions(tx);
      setLoading(false);
    });
  }, []);

  const scoreColor = (score) => {
    if (score >= 750) return 'var(--green)';
    if (score >= 700) return 'var(--blue)';
    if (score >= 650) return 'var(--gold)';
    return 'var(--red)';
  };

  const hasLinkedAccounts = accounts?.accounts?.length > 0;
  const isPremium = user?.tier === 'premium' || user?.tier === 'business';
  const isBusiness = user?.tier === 'business';

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
            <h1 className="dash-welcome-title">{greeting}, {user?.first_name || 'there'} 👋</h1>
            <p className="dash-welcome-sub">Here's your financial overview</p>
          </div>
          <div className="dash-welcome-actions">
            {!user?.is_verified && (
              <div className="dash-verify-banner">
                <span>📧 Verify your email to unlock all features</span>
                <button onClick={async () => {
                  try { await api.resendVerification(user.email); showToast('Verification email sent!'); }
                  catch { showToast('Could not send email.'); }
                }}>Resend</button>
              </div>
            )}
            {!hasLinkedAccounts && (
              <button className="dash-connect-btn" onClick={() => navigate('/connect-bank')}>
                🏦 Connect Your Bank
              </button>
            )}
          </div>
        </div>
      </Section>

      {/* Connect Bank CTA if no accounts linked */}
      {!hasLinkedAccounts && (
        <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
          <div className="dash-connect-cta">
            <div className="dash-connect-cta-left">
              <h2>Connect your cards for real insights</h2>
              <p>Link your bank accounts to see actual balances, transactions, rewards, and get AI-powered payment strategies tailored to your spending.</p>
              <div className="dash-connect-features">
                <span>✓ Real-time balances</span>
                <span>✓ Transaction history</span>
                <span>✓ Smart payment plans</span>
                <span>✓ Rewards optimization</span>
              </div>
              <button className="dash-connect-cta-btn" onClick={() => navigate('/connect-bank')}>
                Connect with Plaid →
              </button>
            </div>
            <div className="dash-connect-cta-right">
              <div className="dash-connect-visual">
                <div className="dash-connect-card">🏦</div>
                <div className="dash-connect-arrow">→</div>
                <div className="dash-connect-card">📊</div>
                <div className="dash-connect-arrow">→</div>
                <div className="dash-connect-card">💰</div>
              </div>
              <div className="dash-connect-badges">
                <span>🔒 256-bit encrypted</span>
                <span>👁 Read-only access</span>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Quick Stats */}
      <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div className="dash-stats-grid">
          <button className="dash-stat-card" onClick={() => navigate('/credit-score')}>
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

          <button className="dash-stat-card" onClick={() => navigate('/rewards')}>
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

          <button className="dash-stat-card" onClick={() => navigate('/calculator')}>
            <div className="dash-stat-icon" style={{ background: 'rgba(124,58,237,0.12)', color: 'var(--purple)' }}>📉</div>
            <div className="dash-stat-info">
              <div className="dash-stat-label">Total Debt</div>
              <div className="dash-stat-value" style={{ color: 'var(--purple-lighter)' }}>
                ${creditScore?.utilization?.total_balance?.toLocaleString() || '0'}
              </div>
              <div className="dash-stat-detail">{creditScore?.utilization?.percentage || 0}% utilization</div>
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
              {!isPremium && (
                <button className="dash-upgrade-btn" onClick={() => navigate('/pricing')}>Upgrade</button>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Recent Transactions (Premium+) */}
      {isPremium && transactions?.transactions?.length > 0 && (
        <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
          <div className="dash-section-header">
            <h2 className="dash-section-title">Recent Transactions</h2>
            <span className="dash-premium-badge">Premium</span>
          </div>
          <div className="dash-transactions">
            {transactions.transactions.slice(0, 8).map((tx, i) => (
              <div key={i} className="dash-tx-row">
                <div className="dash-tx-icon">{tx.category === 'Food' ? '🍕' : tx.category === 'Transport' ? '🚗' : tx.category === 'Shopping' ? '🛍️' : tx.category === 'Bills' ? '📄' : '💳'}</div>
                <div className="dash-tx-info">
                  <div className="dash-tx-name">{tx.merchant || tx.name}</div>
                  <div className="dash-tx-meta">{tx.date} · {tx.card_name}</div>
                </div>
                <div className={`dash-tx-amount ${tx.amount > 0 ? 'debit' : 'credit'}`}>
                  {tx.amount > 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                </div>
                {tx.is_recurring && <span className="dash-tx-recurring">Recurring</span>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Free tier transaction preview */}
      {!isPremium && (
        <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
          <div className="dash-locked-panel">
            <div className="dash-locked-content">
              <h3>📊 Transaction Insights</h3>
              <p>See your recent transactions, recurring charges, spending patterns, and AI-powered payment strategies.</p>
              <button className="dash-upgrade-btn-lg" onClick={() => navigate('/pricing')}>
                Upgrade to Premium — $9.99/mo →
              </button>
            </div>
            <div className="dash-locked-preview">
              <div className="dash-locked-row" /><div className="dash-locked-row" />
              <div className="dash-locked-row" /><div className="dash-locked-row" />
            </div>
          </div>
        </Section>
      )}

      {/* Cards + AI Tips */}
      <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div className="dash-two-col">
          {/* Cards Overview */}
          <div className="dash-panel">
            <div className="dash-section-header">
              <h2 className="dash-section-title">Your Cards</h2>
              <button className="dash-section-link" onClick={() => navigate('/credit-score')}>View all →</button>
            </div>
            {(creditScore?.utilization?.cards || []).slice(0, 4).map(card => (
              <div key={card.name} className="dash-credit-card">
                <div className="dash-cc-top">
                  <span className="dash-cc-name">{card.name}</span>
                  <span className={`dash-cc-pct ${card.pct > 30 ? 'high' : 'good'}`}>{card.pct}%</span>
                </div>
                <div className="dash-cc-bar-track">
                  <div className="dash-cc-bar-fill"
                    style={{ width: `${card.pct}%`, background: card.pct > 50 ? 'var(--red)' : card.pct > 30 ? 'var(--gold)' : 'var(--green)' }} />
                </div>
                <div className="dash-cc-bottom">
                  <span>${card.balance.toLocaleString()} used</span>
                  <span>${card.limit.toLocaleString()} limit</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Recommendations */}
          <div className="dash-panel">
            <div className="dash-section-header">
              <h2 className="dash-section-title">🤖 AI Recommendations</h2>
            </div>
            <div className="dash-tips-list">
              {(creditScore?.tips || []).slice(0, isPremium ? 6 : 3).map((tip, i) => (
                <div key={i} className="dash-tip-item">
                  <div className="dash-tip-priority">
                    {tip.priority === 'high' ? '🔴' : tip.priority === 'medium' ? '🟡' : '🟢'}
                  </div>
                  <div className="dash-tip-content">
                    <div className="dash-tip-text">{tip.tip}</div>
                    <div className="dash-tip-impact">{tip.impact}</div>
                  </div>
                </div>
              ))}
              {!isPremium && (
                <div className="dash-tip-locked">
                  <span>🔒 3 more tips available with Premium</span>
                  <button onClick={() => navigate('/pricing')}>Upgrade</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Best Card + Quick Actions */}
      <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div className="dash-two-col">
          <div className="dash-panel">
            <div className="dash-section-header">
              <h2 className="dash-section-title">💳 Best Card by Category</h2>
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
            <button className="dash-panel-link" onClick={() => navigate('/rewards')}>View rewards →</button>
          </div>

          {/* Spending Summary (Premium) */}
          <div className="dash-panel">
            <div className="dash-section-header">
              <h2 className="dash-section-title">📈 Monthly Summary</h2>
              {isPremium && <span className="dash-premium-badge">Premium</span>}
            </div>
            {isPremium ? (
              <div className="dash-spending-summary">
                {[
                  { cat: 'Groceries', amount: 487.32, pct: 28, color: 'var(--green)' },
                  { cat: 'Dining', amount: 312.50, pct: 18, color: 'var(--blue)' },
                  { cat: 'Transport', amount: 245.00, pct: 14, color: 'var(--purple)' },
                  { cat: 'Shopping', amount: 198.75, pct: 11, color: 'var(--gold)' },
                  { cat: 'Other', amount: 502.43, pct: 29, color: 'var(--muted)' },
                ].map(s => (
                  <div key={s.cat} className="dash-spend-row">
                    <div className="dash-spend-label">
                      <span>{s.cat}</span>
                      <span>${s.amount.toFixed(2)}</span>
                    </div>
                    <div className="dash-spend-bar-track">
                      <div className="dash-spend-bar" style={{ width: `${s.pct}%`, background: s.color }} />
                    </div>
                  </div>
                ))}
                <div className="dash-spend-total">
                  <span>Total this month</span>
                  <span>$1,746.00</span>
                </div>
              </div>
            ) : (
              <div className="dash-locked-inline">
                <p>🔒 Upgrade to Premium to see your monthly spending breakdown by category.</p>
                <button className="dash-upgrade-btn" onClick={() => navigate('/pricing')}>Upgrade</button>
              </div>
            )}
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
            { icon: '🏦', label: 'Connect Bank', desc: hasLinkedAccounts ? 'Manage linked accounts' : 'Link your cards', path: '/connect-bank' },
            { icon: '📉', label: 'Debt Calculator', desc: 'Plan your payoff strategy', path: '/calculator' },
            { icon: '🏆', label: 'Rewards Optimizer', desc: 'Maximize your cashback', path: '/rewards' },
            { icon: '📊', label: 'Credit Score', desc: 'Track your score factors', path: '/credit-score' },
          ].map(action => (
            <button key={action.label} className="dash-action-card" onClick={() => navigate(action.path)}>
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
