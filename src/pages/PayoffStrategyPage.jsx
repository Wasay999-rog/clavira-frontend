import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { api } from '../api';
import Section from '../components/Section.jsx';

export default function PayoffStrategyPage({ navigate }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
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
  const cardPriority = (data.card_priority || []).filter((c, i, arr) => arr.findIndex(x => x.name === c.name) === i);
  const alerts = (data.alerts || []).filter(a => a.severity === 'high').slice(0, 2);
  const topRec = (data.smart_recommendations || [])[0];
  const probability = projections.probability || {};
  const scenarios = data.scenarios || {};
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

        {/* Hero card */}
        <div style={{
          background: 'linear-gradient(135deg, #1A0E3A, #0F0D1F)',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 20, padding: '28px 32px', marginBottom: 20,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(124,58,237,0.15)', pointerEvents: 'none' }} />

          {/* Debt free date — the hero number */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ color: '#6B6490', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>You could be debt-free by</div>
            <div style={{ color: '#10B981', fontWeight: 800, fontSize: 42, lineHeight: 1, letterSpacing: '-0.02em' }}>
              {plan.debt_free_date || '—'}
            </div>
            {monthsSaved > 0 && (
              <div style={{ color: '#6B6490', fontSize: 13, marginTop: 6 }}>
                {monthsSaved} months faster than minimum payments
              </div>
            )}
          </div>

          {/* Three key stats */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ color: '#A78BFA', fontWeight: 800, fontSize: 22 }}>${data.total_debt?.toLocaleString()}</div>
              <div style={{ color: '#6B6490', fontSize: 12, marginTop: 2 }}>total debt</div>
            </div>
            <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ color: '#10B981', fontWeight: 800, fontSize: 22 }}>${interestSaved.toLocaleString()}</div>
              <div style={{ color: '#6B6490', fontSize: 12, marginTop: 2 }}>interest saved</div>
            </div>
            <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ color: '#F59E0B', fontWeight: 800, fontSize: 22 }}>${capacity.total_monthly_payment?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              <div style={{ color: '#6B6490', fontSize: 12, marginTop: 2 }}>recommended/month</div>
            </div>
            <div style={{ flex: 1, minWidth: 100 }}>
              <div style={{ color: probColor, fontWeight: 800, fontSize: 22 }}>{probability.score}%</div>
              <div style={{ color: '#6B6490', fontSize: 12, marginTop: 2 }}>on-track probability</div>
            </div>
          </div>
        </div>

        {/* High priority alerts */}
        {alerts.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            {alerts.map((alert, i) => (
              <div key={i} style={{
                background: 'rgba(244,63,94,0.06)',
                border: '1px solid rgba(244,63,94,0.2)',
                borderRadius: 14, padding: '14px 18px',
                marginBottom: 8, display: 'flex', gap: 12, alignItems: 'flex-start',
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
                <div>
                  <div style={{ color: '#F0EEFF', fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{alert.message}</div>
                  <div style={{ color: '#6B6490', fontSize: 12 }}>{alert.action}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pay in this order */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Pay in this order</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {cardPriority.map((card, i) => (
              <div key={i} style={{
                background: '#0F0D1F',
                border: `1px solid ${i === 0 ? 'rgba(245,158,11,0.3)' : 'rgba(124,58,237,0.1)'}`,
                borderRadius: 14, padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: i === 0 ? 'rgba(245,158,11,0.2)' : 'rgba(124,58,237,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: i === 0 ? '#F59E0B' : '#A78BFA', fontWeight: 800, fontSize: 13,
                }}>#{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#F0EEFF', fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {card.name.length > 30 ? card.name.slice(0, 30) + '...' : card.name}
                  </div>
                  <div style={{ color: '#6B6490', fontSize: 12, marginTop: 2 }}>{card.estimated_apr}% APR · ${card.balance?.toLocaleString()} balance</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color: '#A78BFA', fontWeight: 700, fontSize: 15 }}>${card.recommended_payment?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <div style={{ color: '#6B6490', fontSize: 11 }}>per month</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top smart recommendation */}
        {topRec && (
          <div style={{
            background: 'rgba(124,58,237,0.06)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: 14, padding: '16px 20px', marginBottom: 20,
          }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
              <div>
                <div style={{ color: '#F0EEFF', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{topRec.title}</div>
                <div style={{ color: '#6B6490', fontSize: 13, lineHeight: 1.6, marginBottom: topRec.script ? 10 : 0 }}>{topRec.description}</div>
                {topRec.script && (
                  <div style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 10, padding: '10px 14px', marginTop: 8 }}>
                    <div style={{ color: '#A78BFA', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>SCRIPT TO USE:</div>
                    <div style={{ color: '#F0EEFF', fontSize: 13, lineHeight: 1.6, fontStyle: 'italic' }}>{topRec.script}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Scenarios comparison — minimal */}
        <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
          <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Your options</div>
          {[
            { label: '🐌 Minimum only', data: scenarios.minimum_only, color: '#F43F5E' },
            { label: '✦ Recommended', data: scenarios.recommended, color: '#7C3AED', highlight: true },
            { label: '🚀 Aggressive', data: scenarios.aggressive, color: '#10B981' },
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0',
              borderBottom: i < 2 ? '1px solid rgba(124,58,237,0.06)' : 'none',
              background: s.highlight ? 'transparent' : 'transparent',
            }}>
              <div style={{ color: s.highlight ? '#F0EEFF' : '#6B6490', fontWeight: s.highlight ? 700 : 400, fontSize: 14 }}>{s.label}</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: s.color, fontWeight: 700, fontSize: 14 }}>{s.data?.debt_free_date}</div>
                <div style={{ color: '#6B6490', fontSize: 12 }}>${s.data?.total_interest?.toLocaleString()} interest</div>
              </div>
            </div>
          ))}
        </div>

        {/* Show more toggle */}
        <button
          onClick={() => setShowDetail(!showDetail)}
          style={{ background: 'none', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: '10px 20px', color: '#A78BFA', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%', fontFamily: 'inherit' }}
        >
          {showDetail ? 'Hide details ▲' : 'See month-by-month plan ▼'}
        </button>

        {/* Month by month — hidden by default */}
        {showDetail && plan.monthly_detail?.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 14, overflow: 'hidden' }}>
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
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ marginTop: 20, color: '#4A4368', fontSize: 12, lineHeight: 1.6, textAlign: 'center' }}>
          Estimates based on your connected accounts. APRs are estimated. Verify with your card issuers.
        </div>

      </Section>
    </div>
  );
}