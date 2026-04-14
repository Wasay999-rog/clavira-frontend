import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { api } from '../api';
import Section from '../components/Section.jsx';

export default function PayoffStrategyPage({ navigate }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeScenario, setActiveScenario] = useState('recommended');
  const isPremium = user?.tier === 'premium' || user?.tier === 'business';

  useEffect(() => {
    if (!isPremium) { setLoading(false); return; }
    api.getPayoffStrategy()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isPremium]);

  if (!isPremium) return (
    <div style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Section>
        <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🔒</div>
          <h2 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 24, marginBottom: 12 }}>Premium Feature</h2>
          <p style={{ color: '#6B6490', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
            Your personalized AI payoff strategy — exact debt-free date, month-by-month plan, and total interest savings — is a Premium feature.
          </p>
          <button onClick={() => navigate('/pricing')} style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            Upgrade to Premium →
          </button>
          <div style={{ color: '#4A4368', fontSize: 12, marginTop: 12 }}>$9.99/month · Cancel anytime</div>
        </div>
      </Section>
    </div>
  );

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(124,58,237,0.2)', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <div style={{ color: '#6B6490', fontSize: 14 }}>Analyzing your debt payoff options...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (!data || !data.has_debt) return (
    <div style={{ paddingTop: 40 }}>
      <Section>
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h2 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 22, marginBottom: 12 }}>No debt detected!</h2>
          <p style={{ color: '#6B6490', fontSize: 15, marginBottom: 24 }}>Connect a credit card with a balance to see your payoff strategy.</p>
          <button onClick={() => navigate('/connect-bank')} style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            Connect Bank →
          </button>
        </div>
      </Section>
    </div>
  );

  const plan = data.monthly_plan || {};
  const scenarios = data.scenarios || {};
  const capacity = data.capacity || {};
  const cardPriority = data.card_priority || [];
  const savings = data.savings_opportunities || [];

  const SCENARIOS = [
    { key: 'minimum_only', label: 'Minimum Only', color: '#F43F5E', icon: '🐌', desc: 'Just minimum payments' },
    { key: 'recommended', label: 'Recommended', color: '#7C3AED', icon: '✦', desc: 'Clavira Hybrid strategy', badge: 'BEST' },
    { key: 'aggressive', label: 'Aggressive', color: '#10B981', icon: '🚀', desc: 'Pay off as fast as possible' },
  ];

  const activeData = scenarios[activeScenario] || {};

  return (
    <div style={{ paddingTop: 24, paddingBottom: 80 }}>
      <Section>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Your Payoff Strategy
          </h1>
          <p style={{ color: '#6B6490', fontSize: 15 }}>{data.strategy_name} · AI-powered plan based on your real accounts</p>
        </div>

        {/* Hero — debt free date */}
        <div style={{
          background: 'linear-gradient(135deg, #1A0E3A, #0F0D1F)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 20, padding: '32px 36px', marginBottom: 28,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(124,58,237,0.08)', pointerEvents: 'none' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            <div>
              <div style={{ color: '#6B6490', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Total Debt</div>
              <div style={{ color: '#F43F5E', fontWeight: 800, fontSize: 32, lineHeight: 1 }}>${data.total_debt?.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ color: '#6B6490', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Debt-Free Date</div>
              <div style={{ color: '#10B981', fontWeight: 800, fontSize: 32, lineHeight: 1 }}>{plan.debt_free_date || '—'}</div>
            </div>
            <div>
              <div style={{ color: '#6B6490', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Interest Saved</div>
              <div style={{ color: '#A78BFA', fontWeight: 800, fontSize: 32, lineHeight: 1 }}>
                ${scenarios.recommended?.interest_saved?.toLocaleString() || '0'}
              </div>
              <div style={{ color: '#6B6490', fontSize: 11, marginTop: 4 }}>vs minimum payments</div>
            </div>
            <div>
              <div style={{ color: '#6B6490', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Monthly Payment</div>
              <div style={{ color: '#F59E0B', fontWeight: 800, fontSize: 32, lineHeight: 1 }}>${capacity.total_monthly_payment?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>
          </div>

          {/* Minimum vs recommended comparison */}
          {scenarios.recommended && scenarios.minimum_only && (
            <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(124,58,237,0.12)', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>🐌</span>
                <div>
                  <div style={{ color: '#6B6490', fontSize: 12 }}>Minimum only</div>
                  <div style={{ color: '#F43F5E', fontWeight: 700 }}>{scenarios.minimum_only.debt_free_date} · ${scenarios.minimum_only.total_interest?.toLocaleString()} interest</div>
                </div>
              </div>
              <div style={{ color: '#6B6490', fontSize: 20, alignSelf: 'center' }}>→</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>✦</span>
                <div>
                  <div style={{ color: '#6B6490', fontSize: 12 }}>Clavira Hybrid</div>
                  <div style={{ color: '#10B981', fontWeight: 700 }}>{scenarios.recommended.debt_free_date} · ${scenarios.recommended.total_interest?.toLocaleString()} interest</div>
                </div>
              </div>
              <div style={{ marginLeft: 'auto', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '10px 16px', textAlign: 'center' }}>
                <div style={{ color: '#10B981', fontWeight: 800, fontSize: 20 }}>{scenarios.recommended.months_saved} months</div>
                <div style={{ color: '#6B6490', fontSize: 12 }}>faster debt-free</div>
              </div>
            </div>
          )}
        </div>

        {/* Scenario selector */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Payment Scenarios</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {SCENARIOS.map(s => {
              const sd = scenarios[s.key];
              return (
                <div
                  key={s.key}
                  onClick={() => setActiveScenario(s.key)}
                  style={{
                    flex: 1, minWidth: 180,
                    background: activeScenario === s.key ? `${s.color}15` : '#0F0D1F',
                    border: `1px solid ${activeScenario === s.key ? s.color + '50' : 'rgba(124,58,237,0.1)'}`,
                    borderRadius: 16, padding: '16px 20px', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {s.badge && (
                    <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.2)', color: '#A78BFA', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, marginBottom: 8 }}>✦ {s.badge}</div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span>{s.icon}</span>
                    <div style={{ color: activeScenario === s.key ? s.color : '#F0EEFF', fontWeight: 700, fontSize: 15 }}>{s.label}</div>
                  </div>
                  <div style={{ color: '#6B6490', fontSize: 12, marginBottom: 12 }}>{s.desc}</div>
                  {sd && (
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div>
                        <div style={{ color: s.color, fontWeight: 700, fontSize: 16 }}>{sd.debt_free_date}</div>
                        <div style={{ color: '#6B6490', fontSize: 11 }}>debt-free date</div>
                      </div>
                      <div>
                        <div style={{ color: '#F43F5E', fontWeight: 700, fontSize: 16 }}>${sd.total_interest?.toLocaleString()}</div>
                        <div style={{ color: '#6B6490', fontSize: 11 }}>total interest</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 28 }}>
          {/* Card priority */}
          <div>
            <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Pay In This Order</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cardPriority.filter((c, i, arr) => arr.findIndex(x => x.name === c.name) === i).map((card, i) => {
                const pct = card.limit > 0 ? Math.round((card.balance / card.limit) * 100) : 0;
                return (
                  <div key={i} style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 16, padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                          background: i === 0 ? 'rgba(245,158,11,0.2)' : 'rgba(124,58,237,0.15)',
                          border: `1px solid ${i === 0 ? 'rgba(245,158,11,0.4)' : 'rgba(124,58,237,0.2)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: i === 0 ? '#F59E0B' : '#A78BFA', fontWeight: 800, fontSize: 13,
                        }}>#{i + 1}</div>
                        <div>
                          <div style={{ color: '#F0EEFF', fontWeight: 600, fontSize: 14 }}>
                            {card.name.length > 28 ? card.name.slice(0, 28) + '...' : card.name}
                          </div>
                          <div style={{ color: '#6B6490', fontSize: 12, marginTop: 2 }}>{card.estimated_apr}% APR · {pct}% utilized</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ color: '#F43F5E', fontWeight: 700, fontSize: 16 }}>${card.balance?.toLocaleString()}</div>
                        <div style={{ color: '#6B6490', fontSize: 11 }}>balance</div>
                      </div>
                    </div>
                    <div style={{ height: 4, background: 'rgba(124,58,237,0.1)', borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}>
                      <div style={{ height: 4, width: `${Math.min(pct, 100)}%`, background: pct > 50 ? '#F43F5E' : pct > 30 ? '#F59E0B' : '#10B981', borderRadius: 2 }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: '#6B6490', fontSize: 12, flex: 1, marginRight: 12 }}>{card.reason}</div>
                      <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 8, padding: '6px 12px', textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ color: '#A78BFA', fontWeight: 700, fontSize: 14 }}>${card.recommended_payment?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        <div style={{ color: '#6B6490', fontSize: 10 }}>pay/month</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Monthly budget */}
            <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 16, padding: 20 }}>
              <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Monthly Budget</div>
              {[
                { label: 'Estimated Income', value: `$${capacity.monthly_income?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#10B981' },
                { label: 'Monthly Spending', value: `$${capacity.monthly_spending?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#F43F5E' },
                { label: 'Monthly Surplus', value: `$${capacity.monthly_surplus?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#F59E0B' },
                { label: 'Recommended Payment', value: `$${capacity.total_monthly_payment?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#A78BFA' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(124,58,237,0.06)' : 'none' }}>
                  <span style={{ color: '#6B6490', fontSize: 14 }}>{item.label}</span>
                  <span style={{ color: item.color, fontWeight: 700, fontSize: 14 }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Savings opportunities */}
            {savings.length > 0 && (
              <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 16, padding: 20 }}>
                <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Savings Opportunities</div>
                {savings.map((s, i) => (
                  <div key={i} style={{ padding: '12px 0', borderBottom: i < savings.length - 1 ? '1px solid rgba(124,58,237,0.06)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ color: '#F0EEFF', fontWeight: 600, fontSize: 14 }}>{s.title}</div>
                      {s.potential_monthly > 0 && (
                        <div style={{ color: '#10B981', fontWeight: 700, fontSize: 13 }}>+${s.potential_monthly}/mo</div>
                      )}
                    </div>
                    <div style={{ color: '#6B6490', fontSize: 13, lineHeight: 1.6 }}>{s.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Month by month */}
        {(scenarios[activeScenario]?.monthly_detail || plan.monthly_detail)?.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Month-by-Month Plan — {SCENARIOS.find(s => s.key === activeScenario)?.label}
              </div>
            </div>

            {/* Active scenario summary */}
            {activeData && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 16 }}>
                {[
                  { label: 'Monthly Payment', value: `$${activeData.monthly_payment?.toLocaleString(undefined, {maximumFractionDigits: 0})}`, color: '#A78BFA' },
                  { label: 'Months to Payoff', value: `${activeData.months} months`, color: '#7C3AED' },
                  { label: 'Total Interest', value: `$${activeData.total_interest?.toLocaleString()}`, color: '#F43F5E' },
                  { label: 'Debt-Free Date', value: activeData.debt_free_date, color: '#10B981' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 12, padding: '12px 16px' }}>
                    <div style={{ color: '#6B6490', fontSize: 11, marginBottom: 4 }}>{s.label}</div>
                    <div style={{ color: s.color, fontWeight: 700, fontSize: 16 }}>{s.value}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 16, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(124,58,237,0.1)', background: 'rgba(124,58,237,0.05)' }}>
                    {['Month', 'Date', 'Payment', 'Interest', 'Remaining', 'Milestone'].map((h, i) => (
                      <th key={i} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '12px 16px', color: '#6B6490', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(scenarios[activeScenario]?.monthly_detail || plan.monthly_detail || []).map((month, i) => (
                    <tr key={i} style={{ borderBottom: i < (scenarios[activeScenario]?.monthly_detail || plan.monthly_detail || []).length - 1 ? '1px solid rgba(124,58,237,0.05)' : 'none', background: month.cards_paid_off?.length ? 'rgba(16,185,129,0.04)' : 'transparent' }}>
                      <td style={{ padding: '12px 16px', color: '#F0EEFF', fontWeight: 600 }}>Month {month.month}</td>
                      <td style={{ padding: '12px 16px', color: '#6B6490', textAlign: 'right' }}>{month.date}</td>
                      <td style={{ padding: '12px 16px', color: '#A78BFA', textAlign: 'right', fontWeight: 600 }}>${month.total_payment?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td style={{ padding: '12px 16px', color: '#F59E0B', textAlign: 'right' }}>${month.total_interest?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td style={{ padding: '12px 16px', color: '#F43F5E', textAlign: 'right' }}>${month.remaining_debt?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        {month.cards_paid_off?.length > 0 ? (
                          <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>🎉 Card paid off!</span>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.08)', borderRadius: 12, padding: 16, display: 'flex', gap: 10 }}>
          <span style={{ color: '#6B6490', flexShrink: 0 }}>ℹ️</span>
          <p style={{ color: '#6B6490', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            Estimates based on your Plaid data. APRs are estimated at {cardPriority[0]?.estimated_apr}% average. Income detected with {data.income?.confidence} confidence. Actual results may vary — verify payment amounts with your card issuers.
          </p>
        </div>
      </Section>
    </div>
  );
}