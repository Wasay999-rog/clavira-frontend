import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { api } from '../api';
import Section from '../components/Section.jsx';
import './DashboardPage.css';
import PayoffStrategy from '../components/PayoffStrategy.jsx';
import '../components/PayoffStrategy.css';
export default function DashboardPage({ navigate, showToast }) {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
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
      api.getAccounts().catch(() => ({ accounts: [] })),
      api.getTransactions().catch(() => ({ transactions: [] })),
    ]).then(([acc, tx]) => {
      setAccounts(acc?.accounts || []);
      setTransactions(tx?.transactions || []);
      setLoading(false);
    });
  }, []);

  const hasLinked = accounts.length > 0;
  const isPremium = user?.tier === 'premium' || user?.tier === 'business';

  // Group accounts by type
  const creditCards = accounts.filter(a => a.type === 'credit');
  const bankAccounts = accounts.filter(a => a.type === 'depository');
  const loanAccounts = accounts.filter(a => a.type === 'loan');
  const investAccounts = accounts.filter(a => a.type === 'investment');

  // Calculate real totals
  const totalCash = bankAccounts.reduce((s, a) => s + (a.balance || 0), 0);
  const totalCreditUsed = creditCards.reduce((s, a) => s + (a.balance || 0), 0);
  const totalCreditLimit = creditCards.reduce((s, a) => s + (a.limit || 0), 0);
  const utilPct = totalCreditLimit > 0 ? Math.round((totalCreditUsed / totalCreditLimit) * 100) : 0;
  const totalLoans = loanAccounts.reduce((s, a) => s + (a.balance || 0), 0);
  const totalInvest = investAccounts.reduce((s, a) => s + (a.balance || 0), 0);
  const netWorth = totalCash + totalInvest - totalCreditUsed - totalLoans;

  // Transaction analysis
  const spendTx = transactions.filter(t => t.amount > 0 && !t.pending);
  const pendingTx = transactions.filter(t => t.pending);
  const recurringTx = transactions.filter(t => t.is_recurring);

  // Spending by category
  const catTotals = {};
  spendTx.forEach(t => {
    const cat = t.category || 'Other';
    catTotals[cat] = (catTotals[cat] || 0) + t.amount;
  });
  const topCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const totalSpend = spendTx.reduce((s, t) => s + t.amount, 0);

  // Smart tips based on REAL data
  const tips = [];
  if (utilPct > 30) {
    const overCards = creditCards.filter(c => c.limit > 0 && (c.balance / c.limit) > 0.3);
    overCards.forEach(c => {
      const target = Math.round(c.limit * 0.3);
      const payDown = Math.round(c.balance - target);
      tips.push({ priority: 'high', tip: `Pay $${payDown.toLocaleString()} on ${c.name.split(' ').slice(0, 3).join(' ')} to get below 30% utilization`, impact: `Saves interest + boosts score` });
    });
  }
  if (utilPct > 50) {
    tips.push({ priority: 'high', tip: `Your overall credit utilization is ${utilPct}%. Getting below 30% could boost your score 20-50 points.`, impact: 'Major score impact' });
  }
  if (recurringTx.length > 0) {
    const recurTotal = recurringTx.reduce((s, t) => s + Math.abs(t.amount), 0);
    tips.push({ priority: 'medium', tip: `You have ${recurringTx.length} recurring charges totaling $${recurTotal.toFixed(0)}/mo. Review for unused subscriptions.`, impact: 'Potential savings' });
  }
  creditCards.forEach(c => {
    if (c.limit > 0 && (c.balance / c.limit) < 0.1 && c.balance > 0) {
      tips.push({ priority: 'low', tip: `${c.name.split(' ').slice(0, 3).join(' ')} is at ${Math.round((c.balance / c.limit) * 100)}% — great utilization! Keep it up.`, impact: 'Maintaining score' });
    }
  });
  if (totalCash > totalCreditUsed * 2 && totalCreditUsed > 500) {
    tips.push({ priority: 'medium', tip: `You have $${totalCash.toLocaleString()} in cash but $${totalCreditUsed.toLocaleString()} in CC debt. Consider paying it down to save on interest.`, impact: 'Interest savings' });
  }

  const catIcon = (cat) => {
    const map = { 'Food and Drink': '🍕', 'Travel': '✈️', 'Transfer': '🔄', 'Payment': '💳', 'Shops': '🛍️', 'Recreation': '🎮', 'Other': '📄' };
    return map[cat] || '💳';
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
            <h1 className="dash-welcome-title">{greeting}, {user?.first_name || 'there'} 👋</h1>
            <p className="dash-welcome-sub">
              {hasLinked
                ? `${accounts.length} accounts connected · ${isPremium ? 'Premium' : 'Free'} plan`
                : 'Connect your bank to get started'}
            </p>
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
            <button className="dash-connect-btn" onClick={() => navigate('/connect-bank')}>
              {hasLinked ? '+ Add Account' : '🏦 Connect Bank'}
            </button>
          </div>
        </div>
      </Section>

      {/* Connect CTA if no accounts */}
      {!hasLinked && (
        <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
          <div className="dash-connect-cta">
            <div className="dash-connect-cta-left">
              <h2>Connect your cards for real insights</h2>
              <p>Link your bank accounts to see actual balances, transactions, and AI-powered payment strategies.</p>
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

      {/* Real Stats */}
      {hasLinked && (
        <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
          <div className="dash-stats-grid">
            <div className="dash-stat-card">
              <div className="dash-stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--green)' }}>💵</div>
              <div className="dash-stat-info">
                <div className="dash-stat-label">Cash & Savings</div>
                <div className="dash-stat-value" style={{ color: 'var(--green)' }}>
                  ${totalCash.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="dash-stat-detail">{bankAccounts.length} account{bankAccounts.length !== 1 ? 's' : ''}</div>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon" style={{ background: 'rgba(244,63,94,0.12)', color: 'var(--red)' }}>💳</div>
              <div className="dash-stat-info">
                <div className="dash-stat-label">Credit Card Debt</div>
                <div className="dash-stat-value" style={{ color: totalCreditUsed > 0 ? 'var(--red)' : 'var(--green)' }}>
                  ${totalCreditUsed.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="dash-stat-detail">{utilPct}% of ${totalCreditLimit.toLocaleString()} limit</div>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon" style={{ background: 'rgba(59,130,246,0.12)', color: 'var(--blue)' }}>📈</div>
              <div className="dash-stat-info">
                <div className="dash-stat-label">Investments</div>
                <div className="dash-stat-value" style={{ color: 'var(--blue)' }}>
                  ${totalInvest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="dash-stat-detail">{investAccounts.length} account{investAccounts.length !== 1 ? 's' : ''}</div>
              </div>
            </div>

            <div className="dash-stat-card">
              <div className="dash-stat-icon" style={{ background: netWorth >= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)', color: netWorth >= 0 ? 'var(--green)' : 'var(--red)' }}>🏦</div>
              <div className="dash-stat-info">
                <div className="dash-stat-label">Net Worth</div>
                <div className="dash-stat-value" style={{ color: netWorth >= 0 ? 'var(--green)' : 'var(--red)' }}>
                  {netWorth < 0 ? '-' : ''}${Math.abs(netWorth).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="dash-stat-detail">All accounts combined</div>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Credit Cards with REAL balances */}
      {creditCards.length > 0 && (
        <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
          <div className="dash-section-header">
            <h2 className="dash-section-title">💳 Credit Cards</h2>
            <button className="dash-section-link" onClick={() => navigate('/calculator')}>Payoff Calculator →</button>
          </div>
          <div className="dash-cards-grid">
            {creditCards.map(card => {
              const pct = card.limit > 0 ? Math.round((card.balance / card.limit) * 100) : 0;
              return (
                <div key={card.id} className="dash-credit-card">
                  <div className="dash-cc-top">
                    <span className="dash-cc-name">{card.name}</span>
                    <span className={`dash-cc-pct ${pct > 30 ? 'high' : 'good'}`}>{pct}%</span>
                  </div>
                  <div className="dash-cc-bar-track">
                    <div className="dash-cc-bar-fill"
                      style={{ width: `${Math.min(pct, 100)}%`, background: pct > 50 ? 'var(--red)' : pct > 30 ? 'var(--gold)' : 'var(--green)' }} />
                  </div>
                  <div className="dash-cc-bottom">
                    <span>${card.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })} balance</span>
                    <span>${card.limit?.toLocaleString()} limit</span>
                  </div>
                  <div className="dash-cc-institution">{card.institution} · ····{card.mask}</div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Two Column: Transactions + Spending/Tips */}
      <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div className="dash-two-col">
          {/* Recent Transactions — REAL */}
          <div className="dash-panel">
            <div className="dash-section-header">
              <h2 className="dash-section-title">📋 Recent Transactions</h2>
              {!isPremium && <span className="dash-premium-badge">Limited</span>}
            </div>
            {spendTx.length > 0 ? (
              <div className="dash-tx-list">
                {spendTx.slice(0, isPremium ? 15 : 5).map((tx, i) => (
                  <div key={i} className="dash-tx-row">
                    <div className="dash-tx-icon">{catIcon(tx.category)}</div>
                    <div className="dash-tx-info">
                      <div className="dash-tx-name">{tx.merchant || tx.name}</div>
                      <div className="dash-tx-meta">
                        {tx.date} · {tx.card_name}
                        {tx.is_recurring && <span className="dash-tx-recurring">Recurring</span>}
                      </div>
                    </div>
                    <div className="dash-tx-amount">${Math.abs(tx.amount).toFixed(2)}</div>
                  </div>
                ))}
                {!isPremium && spendTx.length > 5 && (
                  <div className="dash-tip-locked">
                    <span>🔒 {spendTx.length - 5} more transactions with Premium</span>
                    <button onClick={() => navigate('/pricing')}>Upgrade</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="dash-empty">No transactions yet.</div>
            )}

            {/* Pending */}
            {pendingTx.length > 0 && isPremium && (
              <>
                <div className="dash-subsection">⏳ Pending ({pendingTx.length})</div>
                {pendingTx.slice(0, 5).map((tx, i) => (
                  <div key={`p${i}`} className="dash-tx-row dash-tx-pending">
                    <div className="dash-tx-icon">⏳</div>
                    <div className="dash-tx-info">
                      <div className="dash-tx-name">{tx.merchant || tx.name}</div>
                      <div className="dash-tx-meta">{tx.date} · {tx.card_name}</div>
                    </div>
                    <div className="dash-tx-amount">${Math.abs(tx.amount).toFixed(2)}</div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* AI Tips — based on REAL data */}
          <div className="dash-panel">
            <div className="dash-section-header">
              <h2 className="dash-section-title">🤖 Smart Insights</h2>
            </div>
            {tips.length > 0 ? (
              <div className="dash-tips-list">
                {tips.slice(0, isPremium ? 10 : 3).map((tip, i) => (
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
                {!isPremium && tips.length > 3 && (
                  <div className="dash-tip-locked">
                    <span>🔒 {tips.length - 3} more insights with Premium</span>
                    <button onClick={() => navigate('/pricing')}>Upgrade</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="dash-empty">Connect accounts to get personalized insights.</div>
            )}
          </div>
        </div>
      </Section>

      {/* Spending Breakdown + All Accounts */}
      <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div className="dash-two-col">
          {/* Spending by category — REAL */}
          <div className="dash-panel">
            <div className="dash-section-header">
              <h2 className="dash-section-title">📊 Spending Breakdown</h2>
              {!isPremium && <span className="dash-premium-badge">Premium</span>}
            </div>
            {isPremium && topCats.length > 0 ? (
              <div className="dash-spending-summary">
                {topCats.map(([cat, amt]) => {
                  const pct = totalSpend > 0 ? Math.round((amt / totalSpend) * 100) : 0;
                  const colors = ['var(--purple)', 'var(--blue)', 'var(--green)', 'var(--gold)', 'var(--red)', 'var(--muted)'];
                  const idx = topCats.findIndex(c => c[0] === cat);
                  return (
                    <div key={cat} className="dash-spend-row">
                      <div className="dash-spend-label">
                        <span>{catIcon(cat)} {cat}</span>
                        <span>${amt.toFixed(2)}</span>
                      </div>
                      <div className="dash-spend-bar-track">
                        <div className="dash-spend-bar" style={{ width: `${pct}%`, background: colors[idx] || 'var(--muted)' }} />
                      </div>
                    </div>
                  );
                })}
                <div className="dash-spend-total">
                  <span>Total spending</span>
                  <span>${totalSpend.toFixed(2)}</span>
                </div>
              </div>
            ) : !isPremium ? (
              <div className="dash-locked-inline">
                <p>🔒 Upgrade to Premium to see your spending breakdown by category.</p>
                <button className="dash-upgrade-btn" onClick={() => navigate('/pricing')}>Upgrade</button>
              </div>
            ) : (
              <div className="dash-empty">No spending data yet.</div>
            )}
          </div>

          {/* All Accounts Overview */}
          <div className="dash-panel">
            <div className="dash-section-header">
              <h2 className="dash-section-title">🏦 All Accounts</h2>
              <button className="dash-section-link" onClick={() => navigate('/connect-bank')}>Manage →</button>
            </div>
            <div className="dash-all-accounts">
              {accounts.map(acc => (
                <div key={acc.id} className="dash-account-row">
                  <div className="dash-account-left">
                    <span className="dash-account-type-icon">
                      {acc.type === 'credit' ? '💳' : acc.type === 'depository' ? '🏦' : acc.type === 'loan' ? '📄' : '📈'}
                    </span>
                    <div>
                      <div className="dash-account-name">{acc.name}</div>
                      <div className="dash-account-meta">{acc.institution} · ····{acc.mask} · {acc.subtype}</div>
                    </div>
                  </div>
                  <div className={`dash-account-balance ${acc.type === 'loan' || acc.type === 'credit' ? 'negative' : ''}`}>
                    {acc.type === 'loan' || acc.type === 'credit' ? '-' : ''}${Math.abs(acc.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Loans if any */}
      {loanAccounts.length > 0 && (
        <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
          <div className="dash-section-header">
            <h2 className="dash-section-title">📄 Loans</h2>
          </div>
          <div className="dash-cards-grid">
            {loanAccounts.map(loan => (
              <div key={loan.id} className="dash-credit-card">
                <div className="dash-cc-top">
                  <span className="dash-cc-name">{loan.name}</span>
                  <span className="dash-cc-pct high">{loan.subtype}</span>
                </div>
                <div className="dash-cc-bottom" style={{ marginTop: 8 }}>
                  <span>Balance: ${loan.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  <span>{loan.institution} · ····{loan.mask}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
       {/* Smart Payoff Plan */}
      {hasLinked && totalCreditUsed > 0 && (
        <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
          <PayoffStrategy navigate={navigate} isPremium={isPremium} />
        </Section>
      )}
      {/* Quick Actions */}
      <Section style={{ paddingTop: 24, paddingBottom: 60 }}>
        <div className="dash-section-header">
          <h2 className="dash-section-title">Quick Actions</h2>
        </div>
        <div className="dash-actions-grid">
          {[
            { icon: '🏦', label: 'Connect Bank', desc: hasLinked ? 'Manage linked accounts' : 'Link your cards', path: '/connect-bank' },
            { icon: '📉', label: 'Debt Calculator', desc: 'Plan your payoff strategy', path: '/calculator' },
            { icon: '🏆', label: 'Rewards', desc: 'Track your cashback', path: '/rewards' },
            { icon: '💬', label: 'Ask Clavira AI', desc: 'Get personalized advice', path: '/' },
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