import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { api } from '../api';
import Section from '../components/Section.jsx';

const STRATEGIES = [
  { key: 'minimum_only', label: '🐌 Minimum', color: '#F43F5E', desc: 'Minimum payments only' },
  { key: 'recommended', label: '✦ Recommended', color: '#7C3AED', desc: 'Clavira Hybrid', badge: true },
  { key: 'aggressive', label: '🚀 Aggressive', color: '#10B981', desc: 'Pay off fastest' },
];

const CAT_COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#F43F5E', '#A78BFA'];

export default function PayoffStrategyPage({ navigate }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStrategy, setActiveStrategy] = useState('recommended');
  const [showMonthly, setShowMonthly] = useState(false);
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
            Your exact debt-free date, month-by-month plan, and total interest savings.
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
        <div style={{ color: '#6B6490', fontSize: 14 }}>Building your payoff plan...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (!data?.has_debt) return (
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
  const projections = data.projections || {};
  const capacity = data.capacity || {};
  const scenarios = data.scenarios || {};
  const cardPriority = (data.card_priority || []).filter((c, i, arr) => arr.findIndex(x => x.name === c.name) === i);
  const topAlerts = (data.alerts || []).filter(a => a.severity === 'high').slice(0, 2);
  const topRec = (data.smart_recommendations || [])[0];
  const probability = projections.probability || {};
  const spendingCats = (data.spending?.by_category || []).slice(0, 5);
  const totalSpend = data.spending?.total_monthly || 0;
  const activeScenarioData = scenarios[activeStrategy] || {};
  const interestSaved = scenarios.recommended?.interest_saved || 0;
  const monthsSaved = scenarios.recommended?.months_saved || 0;
  const probColor = probability.color === 'green' ? '#10B981' : probability.color === 'yellow' ? '#F59E0B' : '#F43F5E';

  return (
    <div style={{ paddingTop: 24, paddingBottom: 80 }}>
      <Section>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 28, letterSpacing: '-0.02em', marginBottom: 4 }}>
            Your Payoff Plan
          </h1>
          <p style={{ color: '#6B6490', fontSize: 14 }}>Clavira Hybrid · updates daily</p>
        </div>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #1A0E3A, #0F0D1F)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 20, padding: '28px 32px', marginBottom: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', pointerEvents: 'none' }} />
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: '#6B6490', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Debt-free by</div>
            <div style={{ color: '#10B981', fontWeight: 800, fontSize: 40, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {plan.debt_free_date || '—'}
            </div>
            {monthsSaved > 0 && (
              <div style={{ color: '#6B6490', fontSize: 13, marginTop: 6 }}>
                {monthsSaved} months faster than minimum payments
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Total Debt', value: `$${data.total_debt?.toLocaleString()}`, color: '#F43F5E' },
              { label: 'Interest Saved', value: `$${interestSaved.toLocaleString()}`, color: '#10B981' },
              { label: 'Monthly Payment', value: `$${capacity.total_monthly_payment?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#F59E0B' },
              { label: 'On-Track', value: `${probability.score || 0}%`, color: probColor },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ color: s.color, fontWeight: 800, fontSize: 20, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: '#6B6490', fontSize: 11, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {topAlerts.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            {topAlerts.map((alert, i) => (
              <div key={i} style={{
                background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)',
                borderRadius: 12, padding: '12px 16px', marginBottom: 8,
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <span style={{ flexShrink: 0 }}>⚠️</span>
                <div>
                  <div style={{ color: '#F0EEFF', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{alert.message}</div>
                  <div style={{ color: '#6B6490', fontSize: 12 }}>{alert.action}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Strategy selector */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Strategy</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {STRATEGIES.map(s => {
              const sd = scenarios[s.key];
              const isActive = activeStrategy === s.key;
              return (
                <div
                  key={s.key}
                  onClick={() => setActiveStrategy(s.key)}
                  style={{
                    flex: 1, minWidth: 140,
                    background: isActive ? `${s.color}12` : '#0F0D1F',
                    border: `1px solid ${isActive ? s.color + '50' : 'rgba(124,58,237,0.1)'}`,
                    borderRadius: 14, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {s.badge && (
                    <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.2)', color: '#A78BFA', fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 999, marginBottom: 6, letterSpacing: '0.06em' }}>BEST</div>
                  )}
                  <div style={{ color: isActive ? s.color : '#F0EEFF', fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{s.label}</div>
                  <div style={{ color: '#6B6490', fontSize: 11, marginBottom: 10 }}>{s.desc}</div>
                  {sd && (
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div>
                        <div style={{ color: s.color, fontWeight: 700, fontSize: 14 }}>{sd.debt_free_date}</div>
                        <div style={{ color: '#6B6490', fontSize: 10 }}>debt-free</div>
                      </div>
                      <div>
                        <div style={{ color: '#F43F5E', fontWeight: 700, fontSize: 14 }}>${sd.total_interest?.toLocaleString()}</div>
                        <div style={{ color: '#6B6490', fontSize: 10 }}>interest</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Two column — cards + budget */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 20 }}>

          {/* Pay in this order */}
          <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 16, padding: '16px 20px' }}>
            <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Pay in this order</div>
            {cardPriority.map((card, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: i < cardPriority.length - 1 ? '1px solid rgba(124,58,237,0.06)' : 'none',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                  background: i === 0 ? 'rgba(245,158,11,0.2)' : 'rgba(124,58,237,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: i === 0 ? '#F59E0B' : '#A78BFA', fontWeight: 800, fontSize: 12,
                }}>#{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#F0EEFF', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {card.name.length > 25 ? card.name.slice(0, 25) + '...' : card.name}
                  </div>
                  <div style={{ color: '#6B6490', fontSize: 11, marginTop: 1 }}>{card.estimated_apr}% APR · ${card.balance?.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color: '#A78BFA', fontWeight: 700, fontSize: 14 }}>${card.recommended_payment?.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</div>
                </div>
              </div>
            ))}
          </div>

          {/* Monthly budget — subtle */}
          <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 16, padding: '16px 20px' }}>
            <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Monthly Budget</div>
            {[
              { label: 'Est. Income', value: `$${capacity.monthly_income?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#10B981', icon: '↑' },
              { label: 'Spending', value: `$${capacity.monthly_spending?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#F43F5E', icon: '↓' },
              { label: 'Surplus', value: `$${capacity.monthly_surplus?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#F59E0B', icon: '=' },
              { label: 'To Debt', value: `$${capacity.total_monthly_payment?.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: '#A78BFA', icon: '→' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '9px 0',
                borderBottom: i < 3 ? '1px solid rgba(124,58,237,0.06)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: item.color, fontSize: 14, fontWeight: 700, width: 16 }}>{item.icon}</span>
                  <span style={{ color: '#6B6490', fontSize: 13 }}>{item.label}</span>
                </div>
                <span style={{ color: item.color, fontWeight: 700, fontSize: 14 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spending by category */}
        {spendingCats.length > 0 && (
          <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 16, padding: '16px 20px', marginBottom: 20 }}>
            <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Where your money goes</div>
            {spendingCats.map((cat, i) => {
              const pct = totalSpend > 0 ? Math.round((cat.monthly_average / totalSpend) * 100) : 0;
              return (
                <div key={i} style={{ marginBottom: i < spendingCats.length - 1 ? 12 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ color: '#F0EEFF', fontSize: 13 }}>{cat.category}</span>
                    <span style={{ color: '#6B6490', fontSize: 13 }}>${cat.monthly_average?.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo · {pct}%</span>
                  </div>
                  <div style={{ height: 5, background: 'rgba(124,58,237,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: 5, width: `${pct}%`, background: CAT_COLORS[i % CAT_COLORS.length], borderRadius: 3, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Smart recommendation */}
        {topRec && (
          <div style={{
            background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)',
            borderRadius: 14, padding: '16px 20px', marginBottom: 20,
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
              <div>
                <div style={{ color: '#F0EEFF', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{topRec.title}</div>
                <div style={{ color: '#6B6490', fontSize: 13, lineHeight: 1.6 }}>{topRec.description}</div>
                {topRec.potential_savings > 0 && (
                  <div style={{ color: '#10B981', fontSize: 13, fontWeight: 600, marginTop: 6 }}>
                    Potential savings: ${topRec.potential_savings.toLocaleString()}
                  </div>
                )}
                {topRec.script && (
                  <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 10, padding: '10px 14px', marginTop: 10 }}>
                    <div style={{ color: '#A78BFA', fontSize: 10, fontWeight: 700, marginBottom: 4, letterSpacing: '0.06em' }}>SCRIPT:</div>
                    <div style={{ color: '#F0EEFF', fontSize: 13, lineHeight: 1.6, fontStyle: 'italic' }}>{topRec.script}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Month by month toggle */}
        <button
          onClick={() => setShowMonthly(!showMonthly)}
          style={{
            background: 'none', border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: 10, padding: '10px 20px', color: '#A78BFA',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%',
            fontFamily: 'inherit', marginBottom: 16,
          }}
        >
          {showMonthly ? 'Hide month-by-month ▲' : 'See month-by-month plan ▼'}
        </button>

        {showMonthly && plan.monthly_detail?.length > 0 && (
          <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(124,58,237,0.1)', background: 'rgba(124,58,237,0.05)' }}>
                  {['Month', 'Date', 'Payment', 'Remaining', 'Milestone'].map((h, i) => (
                    <th key={i} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '10px 14px', color: '#6B6490', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plan.monthly_detail.map((month, i) => (
                  <tr key={i} style={{ borderBottom: i < plan.monthly_detail.length - 1 ? '1px solid rgba(124,58,237,0.05)' : 'none', background: month.cards_paid_off?.length ? 'rgba(16,185,129,0.04)' : 'transparent' }}>
                    <td style={{ padding: '10px 14px', color: '#F0EEFF', fontWeight: 500 }}>{month.month}</td>
                    <td style={{ padding: '10px 14px', color: '#6B6490', textAlign: 'right' }}>{month.date}</td>
                    <td style={{ padding: '10px 14px', color: '#A78BFA', textAlign: 'right', fontWeight: 600 }}>${month.total_payment?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td style={{ padding: '10px 14px', color: '#F43F5E', textAlign: 'right' }}>${month.remaining_debt?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                      {month.cards_paid_off?.length > 0
                        ? <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>🎉 Paid off!</span>
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ color: '#4A4368', fontSize: 12, lineHeight: 1.6, textAlign: 'center' }}>
          Estimates based on your connected accounts. APRs are estimated. Verify with your card issuers.
        </div>

      </Section>
    </div>
  );
}