import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { api } from '../api';
import Section from '../components/Section.jsx';

const STRATEGY_INFO = {
  hybrid: { label: 'Clavira Hybrid', color: '#7C3AED', desc: 'Best of both worlds — saves money and builds momentum' },
  avalanche: { label: 'Avalanche', color: '#F43F5E', desc: 'Highest APR first — saves the most in interest' },
  snowball: { label: 'Snowball', color: '#3B82F6', desc: 'Smallest balance first — fastest psychological wins' },
};

export default function PayoffStrategyPage({ navigate }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStrategy, setActiveStrategy] = useState('hybrid');
  const isPremium = user?.tier === 'premium' || user?.tier === 'business';

  useEffect(() => {
    if (!isPremium) { setLoading(false); return; }
    api.getPayoffStrategy()
      .then(setData)
      .catch(e => setError(e?.detail || 'Failed to load'))
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
          <button
            onClick={() => navigate('/pricing')}
            style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
          >
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

  if (error || !data) return (
    <div style={{ paddingTop: 40 }}>
      <Section>
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <h2 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 22, marginBottom: 12 }}>No debt data yet</h2>
          <p style={{ color: '#6B6490', fontSize: 15, marginBottom: 24 }}>Connect a credit card to see your personalized payoff strategy.</p>
          <button onClick={() => navigate('/connect-bank')} style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            Connect Bank →
          </button>
        </div>
      </Section>
    </div>
  );

  const strategy = data.strategies?.[activeStrategy] || data.strategies?.hybrid;
  const hybrid = data.strategies?.hybrid;
  const avalanche = data.strategies?.avalanche;
  const snowball = data.strategies?.snowball;

  const interestSaved = avalanche && snowball
    ? Math.max(0, (snowball.total_interest || 0) - (hybrid?.total_interest || 0))
    : 0;

  const monthsSaved = snowball && hybrid
    ? Math.max(0, (snowball.months_to_payoff || 0) - (hybrid?.months_to_payoff || 0))
    : 0;

  return (
    <div style={{ paddingTop: 24, paddingBottom: 80 }}>
      <Section>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Your Payoff Strategy
          </h1>
          <p style={{ color: '#6B6490', fontSize: 15 }}>AI-powered plan based on your real accounts and spending</p>
        </div>

        {/* Hero stats */}
        <div style={{
          background: 'linear-gradient(135deg, #1A0E3A, #0F0D1F)',
          border: '1px solid rgba(124,58,237,0.25)',
          borderRadius: 20, padding: 28, marginBottom: 28,
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(124,58,237,0.12)', pointerEvents: 'none' }} />
          {[
            { label: 'Total Debt', value: `$${data.total_debt?.toLocaleString()}`, color: '#F43F5E' },
            { label: 'Debt-Free In', value: hybrid ? `${hybrid.months_to_payoff}mo` : '—', color: '#A78BFA' },
            { label: 'Interest Saved', value: interestSaved > 0 ? `$${interestSaved.toLocaleString()}` : '—', color: '#10B981' },
            { label: 'Monthly Payment', value: `$${data.capacity?.total_monthly_payment?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#F59E0B' },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ color: '#6B6490', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
              <div style={{ color: s.color, fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Strategy selector */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Choose Strategy</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {Object.entries(STRATEGY_INFO).map(([key, info]) => {
              const s = data.strategies?.[key];
              return (
                <div
                  key={key}
                  onClick={() => setActiveStrategy(key)}
                  style={{
                    flex: 1, minWidth: 200,
                    background: activeStrategy === key ? `${info.color}15` : '#0F0D1F',
                    border: `1px solid ${activeStrategy === key ? info.color + '50' : 'rgba(124,58,237,0.1)'}`,
                    borderRadius: 16, padding: '16px 20px', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {key === 'hybrid' && (
                    <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.2)', color: '#A78BFA', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, marginBottom: 8, letterSpacing: '0.06em' }}>✦ RECOMMENDED</div>
                  )}
                  <div style={{ color: activeStrategy === key ? info.color : '#F0EEFF', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{info.label}</div>
                  <div style={{ color: '#6B6490', fontSize: 12, marginBottom: 12 }}>{info.desc}</div>
                  {s && (
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div>
                        <div style={{ color: info.color, fontWeight: 700, fontSize: 18 }}>{s.months_to_payoff}mo</div>
                        <div style={{ color: '#6B6490', fontSize: 11 }}>to debt-free</div>
                      </div>
                      <div>
                        <div style={{ color: '#F43F5E', fontWeight: 700, fontSize: 18 }}>${s.total_interest?.toLocaleString()}</div>
                        <div style={{ color: '#6B6490', fontSize: 11 }}>total interest</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Card priority */}
          <div>
            <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Pay In This Order</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(data.card_priority || []).map((card, i) => {
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
                            {card.name.length > 25 ? card.name.slice(0, 25) + '...' : card.name}
                          </div>
                          <div style={{ color: '#6B6490', fontSize: 12, marginTop: 2 }}>{card.estimated_apr}% APR · {pct}% utilization</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#F43F5E', fontWeight: 700, fontSize: 16 }}>${card.balance?.toLocaleString()}</div>
                        <div style={{ color: '#6B6490', fontSize: 11 }}>balance</div>
                      </div>
                    </div>

                    {/* Utilization bar */}
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
                { label: 'Estimated Income', value: `$${data.capacity?.monthly_income?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#10B981' },
                { label: 'Monthly Spending', value: `$${data.capacity?.monthly_spending?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#F43F5E' },
                { label: 'Monthly Surplus', value: `$${data.capacity?.monthly_surplus?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#F59E0B' },
                { label: 'Recommended Payment', value: `$${data.capacity?.total_monthly_payment?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#A78BFA' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(124,58,237,0.06)' : 'none' }}>
                  <span style={{ color: '#6B6490', fontSize: 14 }}>{item.label}</span>
                  <span style={{ color: item.color, fontWeight: 700, fontSize: 14 }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Strategy comparison */}
            <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 16, padding: 20 }}>
              <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Strategy Comparison</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
                    {['Strategy', 'Months', 'Interest'].map((h, i) => (
                      <th key={i} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '8px 0', color: '#6B6490', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(STRATEGY_INFO).map(([key, info]) => {
                    const s = data.strategies?.[key];
                    if (!s) return null;
                    return (
                      <tr key={key} style={{ borderBottom: '1px solid rgba(124,58,237,0.05)', background: activeStrategy === key ? `${info.color}08` : 'transparent' }}>
                        <td style={{ padding: '10px 0', color: info.color, fontWeight: activeStrategy === key ? 700 : 400 }}>{info.label}</td>
                        <td style={{ padding: '10px 0', color: '#F0EEFF', textAlign: 'right', fontWeight: activeStrategy === key ? 700 : 400 }}>{s.months_to_payoff}mo</td>
                        <td style={{ padding: '10px 0', color: '#F43F5E', textAlign: 'right', fontWeight: activeStrategy === key ? 700 : 400 }}>${s.total_interest?.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Spending insights */}
            {data.spending?.by_category?.length > 0 && (
              <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 16, padding: 20 }}>
                <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Top Spending</div>
                {data.spending.by_category.slice(0, 4).map((cat, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 3 ? '1px solid rgba(124,58,237,0.06)' : 'none' }}>
                    <span style={{ color: '#6B6490', fontSize: 13 }}>{cat.category}</span>
                    <span style={{ color: cat.type === 'fixed' ? '#F43F5E' : '#F59E0B', fontWeight: 600, fontSize: 13 }}>${cat.monthly_average?.toLocaleString()}/mo</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Month by month timeline */}
        {strategy?.monthly_plan?.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Month-by-Month Plan</div>
            <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 16, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(124,58,237,0.1)', background: 'rgba(124,58,237,0.05)' }}>
                    {['Month', 'Payment', 'Remaining Debt', 'Interest Paid', 'Card Paid Off'].map((h, i) => (
                      <th key={i} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '12px 16px', color: '#6B6490', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {strategy.monthly_plan.slice(0, 12).map((month, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(124,58,237,0.05)', background: month.cards_paid_off?.length ? 'rgba(16,185,129,0.05)' : 'transparent' }}>
                      <td style={{ padding: '12px 16px', color: '#F0EEFF', fontWeight: 500 }}>Month {month.month}</td>
                      <td style={{ padding: '12px 16px', color: '#A78BFA', textAlign: 'right', fontWeight: 600 }}>${month.total_payment?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td style={{ padding: '12px 16px', color: '#F43F5E', textAlign: 'right' }}>${month.remaining_debt?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      <td style={{ padding: '12px 16px', color: '#F59E0B', textAlign: 'right' }}>${month.interest_this_month?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        {month.cards_paid_off?.length > 0 ? (
                          <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>🎉 Card paid off!</span>
                        ) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {strategy.monthly_plan.length > 12 && (
                <div style={{ padding: '12px 16px', color: '#6B6490', fontSize: 13, textAlign: 'center', borderTop: '1px solid rgba(124,58,237,0.06)' }}>
                  + {strategy.monthly_plan.length - 12} more months until debt-free
                </div>
              )}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ marginTop: 24, background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.08)', borderRadius: 12, padding: 16, display: 'flex', gap: 10 }}>
          <span style={{ color: '#6B6490', flexShrink: 0 }}>ℹ️</span>
          <p style={{ color: '#6B6490', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
            Estimates based on your Plaid data and projected spending. APRs are estimated. Actual results may vary. Always verify payment amounts with your card issuers.
          </p>
        </div>
      </Section>
    </div>
  );
}