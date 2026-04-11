import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { api } from '../api';
import Section from '../components/Section.jsx';

// ─── Lock Overlay ─────────────────────────────────────────────
const PremiumLock = ({ navigate }) => (
  <div style={{
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to bottom, transparent 0%, rgba(5,4,15,0.95) 40%)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    padding: 48, borderRadius: 20, zIndex: 10,
  }}>
    <div style={{ textAlign: 'center', maxWidth: 420 }}>
      <div style={{ fontSize: 36, marginBottom: 16 }}>🔒</div>
      <h3 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 22, marginBottom: 12 }}>
        Premium Feature
      </h3>
      <p style={{ color: '#6B6490', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
        Upgrade to Premium to unlock your personalized card optimization strategy, transfer partner analysis, and step-by-step redemption guides.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/pricing')}
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
            color: '#fff', border: 'none', borderRadius: 12,
            padding: '13px 28px', fontSize: 15, fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Upgrade to Premium →
        </button>
      </div>
      <p style={{ color: '#4A4368', fontSize: 12, marginTop: 16 }}>
        $9.99/month · Cancel anytime
      </p>
    </div>
  </div>
);

// ─── Spending Bar ─────────────────────────────────────────────
const SpendingBar = ({ category, amount, max, color }) => {
  const pct = Math.round((amount / max) * 100);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: '#F0EEFF', fontSize: 14, fontWeight: 500 }}>{category}</span>
        <span style={{ color: '#6B6490', fontSize: 13 }}>${amount.toLocaleString()}/yr</span>
      </div>
      <div style={{ height: 6, background: 'rgba(124,58,237,0.1)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: 6, width: `${pct}%`, background: color || 'linear-gradient(90deg, #7C3AED, #8B5CF6)', borderRadius: 3, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );
};

// ─── Card Result ──────────────────────────────────────────────
const CardResult = ({ card, isNew = false, rank }) => {
  const [expanded, setExpanded] = useState(false);
  const netColor = card.net_value > 2000 ? '#10B981' : card.net_value > 500 ? '#F59E0B' : '#A78BFA';

  return (
    <div style={{
      background: '#0F0D1F',
      border: `1px solid ${isNew ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.1)'}`,
      borderRadius: 20, overflow: 'hidden', marginBottom: 12,
    }}>
      {/* Header */}
      <div
        style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
          {rank && (
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: rank === 1 ? 'rgba(245,158,11,0.2)' : 'rgba(124,58,237,0.15)',
              border: `1px solid ${rank === 1 ? 'rgba(245,158,11,0.4)' : 'rgba(124,58,237,0.2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: rank === 1 ? '#F59E0B' : '#A78BFA', fontWeight: 800, fontSize: 14, flexShrink: 0,
            }}>#{rank}</div>
          )}
          <div>
            {isNew && (
              <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', color: '#A78BFA', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, letterSpacing: '0.08em', marginBottom: 6 }}>
                ✦ RECOMMENDED
              </div>
            )}
            <div style={{ color: '#F0EEFF', fontWeight: 700, fontSize: 16 }}>{card.card_name}</div>
            <div style={{ color: '#6B6490', fontSize: 13, marginTop: 2 }}>{card.issuer} · {card.point_currency}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div>
            <div style={{ color: netColor, fontWeight: 800, fontSize: 24 }}>${card.net_value.toLocaleString()}</div>
            <div style={{ color: '#6B6490', fontSize: 12 }}>net/year</div>
          </div>
          <div style={{ color: '#6B6490', fontSize: 18 }}>{expanded ? '▲' : '▼'}</div>
        </div>
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(124,58,237,0.08)', padding: '20px 24px' }}>
          {/* Fee & gross */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            {[
              { label: 'Gross Value', val: `$${card.gross_value.toLocaleString()}`, color: '#10B981' },
              { label: 'Annual Fee', val: card.annual_fee === 0 ? 'None' : `$${card.annual_fee}`, color: card.annual_fee === 0 ? '#10B981' : '#F59E0B' },
              { label: 'Net Value', val: `$${card.net_value.toLocaleString()}`, color: netColor },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, background: 'rgba(124,58,237,0.05)', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
                <div style={{ color: s.color, fontWeight: 700, fontSize: 18 }}>{s.val}</div>
                <div style={{ color: '#6B6490', fontSize: 12, marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Category breakdown */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Earnings by Category</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
                  {['Category', 'Rate', 'Annual Spend', 'Value'].map((h, i) => (
                    <th key={i} style={{ textAlign: i === 0 ? 'left' : 'right', padding: '8px 0', color: '#6B6490', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(card.category_breakdown || []).map((cat, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(124,58,237,0.05)' }}>
                    <td style={{ padding: '10px 0', color: '#F0EEFF', fontWeight: 500 }}>{cat.category}</td>
                    <td style={{ padding: '10px 0', color: '#A78BFA', fontWeight: 700, textAlign: 'right' }}>{cat.rate}x</td>
                    <td style={{ padding: '10px 0', color: '#6B6490', textAlign: 'right' }}>${cat.annual_spend.toLocaleString()}</td>
                    <td style={{ padding: '10px 0', color: '#10B981', fontWeight: 700, textAlign: 'right' }}>+${cat.value_usd.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Redemption */}
          {(card.redemption_recommendations || []).length > 0 && (
            <div>
              <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>How to Redeem</div>
              {(card.redemption_recommendations || []).map((rec, i) => (
                <div key={i} style={{
                  background: rec.priority === 'high' ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${rec.priority === 'high' ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.06)'}`,
                  borderRadius: 12, padding: 16, marginBottom: 10,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ background: rec.type === 'transfer_partner' ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.05)', borderRadius: 999, padding: '2px 8px', fontSize: 12, color: '#A78BFA', fontWeight: 600 }}>
                        {rec.type === 'transfer_partner' ? '✈️ Transfer' : rec.type === 'hotel_transfer' ? '🏨 Hotel' : '💵 Cash Back'}
                      </span>
                      {rec.uplift_pct > 0 && (
                        <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>+{rec.uplift_pct}% more value</span>
                      )}
                    </div>
                    <span style={{ color: '#10B981', fontWeight: 700, fontSize: 16 }}>${rec.value_usd.toLocaleString()}</span>
                  </div>
                  <div style={{ color: '#F0EEFF', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{rec.title}</div>
                  <div style={{ color: '#6B6490', fontSize: 13, lineHeight: 1.6, marginBottom: rec.steps?.length ? 12 : 0 }}>{rec.description}</div>
                  {rec.steps?.length > 0 && (
                    <div style={{ borderTop: '1px solid rgba(124,58,237,0.08)', paddingTop: 12 }}>
                      {rec.steps.map((step, si) => (
                        <div key={si} style={{ display: 'flex', gap: 10, marginBottom: 6, alignItems: 'flex-start' }}>
                          <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#A78BFA', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{si + 1}</div>
                          <span style={{ color: '#6B6490', fontSize: 13, lineHeight: 1.6 }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Perks */}
          {(card.perks || []).length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Key Perks</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(card.perks || []).slice(0, 5).map((perk, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: '#7C3AED', flexShrink: 0 }}>→</span>
                    <span style={{ color: '#6B6490', fontSize: 13, lineHeight: 1.6 }}>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Combo Section ────────────────────────────────────────────
const ComboSection = ({ combo }) => {
  if (!combo) return null;
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1A0E3A, #0F0D1F)',
      border: '1px solid rgba(124,58,237,0.25)',
      borderRadius: 20, padding: 32, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: 'rgba(124,58,237,0.15)' }} />
      <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', color: '#A78BFA', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, letterSpacing: '0.08em', marginBottom: 20 }}>
        ✦ OPTIMAL 2-CARD STRATEGY
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 14, padding: 16 }}>
          <div style={{ color: '#F0EEFF', fontWeight: 700, fontSize: 15 }}>{combo.card1.name}</div>
          <div style={{ color: '#6B6490', fontSize: 13, marginTop: 3 }}>{combo.card1.issuer}</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA', fontWeight: 800, fontSize: 20, flexShrink: 0 }}>+</div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 14, padding: 16 }}>
          <div style={{ color: '#F0EEFF', fontWeight: 700, fontSize: 15 }}>{combo.card2.name}</div>
          <div style={{ color: '#6B6490', fontSize: 13, marginTop: 3 }}>{combo.card2.issuer}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
        {[
          { label: 'Combined Annual Value', val: `$${combo.total_net_value.toLocaleString()}`, color: '#10B981' },
          { label: 'Total Annual Fees', val: `$${combo.total_annual_fees.toLocaleString()}`, color: '#F59E0B' },
          { label: 'Gross Value', val: `$${combo.total_gross_value.toLocaleString()}`, color: '#A78BFA' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ color: s.color, fontWeight: 800, fontSize: 26 }}>{s.val}</div>
            <div style={{ color: 'rgba(240,238,255,0.5)', fontSize: 12, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(124,58,237,0.1)', paddingTop: 20 }}>
        <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Which Card to Use Where</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
              {['Category', 'Use This Card', 'Rate', 'Annual Value'].map((h, i) => (
                <th key={i} style={{ textAlign: i === 0 ? 'left' : i === 3 ? 'right' : 'center', padding: '8px 0', color: '#6B6490', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(combo.combo_breakdown || []).slice(0, 8).map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(124,58,237,0.05)' }}>
                <td style={{ padding: '10px 0', color: '#F0EEFF', fontWeight: 500 }}>{row.category}</td>
                <td style={{ padding: '10px 0', color: '#A78BFA', textAlign: 'center', fontSize: 13 }}>{row.use_card.split(' ').slice(0, 3).join(' ')}</td>
                <td style={{ padding: '10px 0', color: '#A78BFA', fontWeight: 700, textAlign: 'center' }}>{row.rate}x</td>
                <td style={{ padding: '10px 0', color: '#10B981', fontWeight: 700, textAlign: 'right' }}>+${row.annual_value.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {combo.same_ecosystem && (
        <div style={{ marginTop: 16, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 12, padding: 14, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🔗</span>
          <div>
            <div style={{ color: '#F0EEFF', fontWeight: 600, fontSize: 14 }}>Same Point Ecosystem</div>
            <div style={{ color: '#6B6490', fontSize: 13, marginTop: 3, lineHeight: 1.6 }}>Both cards earn {combo.same_ecosystem}. Points combine automatically, unlocking higher-value transfer partners.</div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────
export default function OptimizerPage({ navigate }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recommended');
  const isPremium = user?.tier === 'premium' || user?.tier === 'business';

  useEffect(() => {
    api.getOptimizer()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const CAT_COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6'];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(124,58,237,0.2)', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <div style={{ color: '#6B6490', fontSize: 14 }}>Analyzing your spending across 50+ cards...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (!data?.has_data) return (
    <div style={{ paddingTop: 40, paddingBottom: 80 }}>
      <Section>
        <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🃏</div>
          <h2 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 24, marginBottom: 12 }}>No data yet</h2>
          <p style={{ color: '#6B6490', fontSize: 15, lineHeight: 1.7, marginBottom: 28 }}>
            Connect a bank account to get your personalized card optimization strategy based on your real spending.
          </p>
          <button
            onClick={() => navigate('/connect-bank')}
            style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
          >
            Connect Bank →
          </button>
        </div>
      </Section>
    </div>
  );

  const recommendedCards = data.best_single_card || [];
  const existingCards = data.existing_cards || [];
  const currentCards = activeTab === 'recommended' ? recommendedCards : existingCards;
  const topCategories = data.spending_profile?.top_categories || [];
  const maxSpend = topCategories[0]?.annual || 1;
  const currentEarning = existingCards.reduce((s, c) => s + (c.net_value || 0), 0);
  const bestPossible = recommendedCards[0]?.net_value || 0;
  const gap = Math.max(0, bestPossible - currentEarning);

  return (
    <div style={{ paddingTop: 24, paddingBottom: 80 }}>
      <Section>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', marginBottom: 8 }}>
              Card Optimizer
            </h1>
            <p style={{ color: '#6B6490', fontSize: 15 }}>
              AI-powered analysis based on your real spending data
            </p>
          </div>
          <div style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 999, padding: '6px 14px' }}>
            <span style={{ color: '#A78BFA', fontWeight: 700, fontSize: 13 }}>✦ AI Powered</span>
          </div>
        </div>

        {/* Hero stat */}
        <div style={{
          background: 'linear-gradient(135deg, #1A0E3A, #0F0D1F)',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 20, padding: 28, marginBottom: 28,
          display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(124,58,237,0.12)' }} />
          <div>
            <div style={{ color: '#6B6490', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>You Could Be Earning</div>
            <div style={{ color: '#10B981', fontWeight: 800, fontSize: 40, lineHeight: 1 }}>${bestPossible.toLocaleString()}<span style={{ fontSize: 18, fontWeight: 600 }}>/yr</span></div>
          </div>
          <div style={{ width: 1, height: 50, background: 'rgba(124,58,237,0.15)' }} />
          <div>
            <div style={{ color: '#6B6490', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Currently Earning</div>
            <div style={{ color: '#A78BFA', fontWeight: 800, fontSize: 40, lineHeight: 1 }}>${currentEarning.toLocaleString()}<span style={{ fontSize: 18, fontWeight: 600 }}>/yr</span></div>
          </div>
          {gap > 0 && (
            <>
              <div style={{ width: 1, height: 50, background: 'rgba(124,58,237,0.15)' }} />
              <div>
                <div style={{ color: '#6B6490', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Gap</div>
                <div style={{ color: '#F43F5E', fontWeight: 800, fontSize: 40, lineHeight: 1 }}>+${gap.toLocaleString()}<span style={{ fontSize: 18, fontWeight: 600 }}>/yr</span></div>
              </div>
            </>
          )}
          <div>
            <div style={{ color: '#6B6490', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Annual Spend</div>
            <div style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 40, lineHeight: 1 }}>${(data.spending_profile?.projected_annual || 0).toLocaleString()}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 28, alignItems: 'start' }}>
          {/* Left sidebar */}
          <div>
            {/* Spending DNA */}
            <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 20, padding: 24, marginBottom: 20 }}>
              <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Your Spending DNA</div>
              {topCategories.map((cat, i) => (
                <SpendingBar key={i} category={cat.category} amount={cat.annual} max={maxSpend} color={CAT_COLORS[i % CAT_COLORS.length]} />
              ))}
              <div style={{ color: '#6B6490', fontSize: 12, marginTop: 12 }}>Based on last 90 days · projected annually</div>
            </div>

            {/* Spending insights */}
            {(data.spending_insights || []).length > 0 && (
              <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 20, padding: 24 }}>
                <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Where You're Missing Out</div>
                {data.spending_insights.map((insight, i) => (
                  <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < data.spending_insights.length - 1 ? '1px solid rgba(124,58,237,0.06)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: '#F0EEFF', fontSize: 13, fontWeight: 600 }}>{insight.category}</span>
                      <span style={{ color: '#F43F5E', fontSize: 13, fontWeight: 700 }}>-${insight.missed_value_usd.toLocaleString()}/yr</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ background: 'rgba(124,58,237,0.1)', color: '#6B6490', fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 999 }}>{insight.current_rate}x now</span>
                      <span style={{ color: '#6B6490', fontSize: 11 }}>→</span>
                      <span style={{ background: 'rgba(124,58,237,0.2)', color: '#A78BFA', fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 999 }}>{insight.best_rate}x possible</span>
                    </div>
                    <div style={{ color: '#6B6490', fontSize: 12 }}>{insight.best_card}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right main */}
          <div>
            {/* Tab bar */}
            <div style={{ display: 'flex', background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 14, padding: 4, marginBottom: 20, width: 'fit-content' }}>
              {[{ key: 'recommended', label: '⭐ Best For You' }, { key: 'existing', label: '💳 Your Cards' }].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    background: activeTab === tab.key ? '#7C3AED' : 'none',
                    border: 'none', borderRadius: 10, padding: '9px 20px',
                    color: activeTab === tab.key ? '#fff' : '#6B6490',
                    fontWeight: activeTab === tab.key ? 700 : 500,
                    fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Cards list — blurred for free users on recommended tab */}
            <div style={{ position: 'relative' }}>
              {currentCards.map((card, i) => (
                <CardResult
                  key={card.card_id}
                  card={card}
                  isNew={activeTab === 'recommended'}
                  rank={activeTab === 'recommended' ? i + 1 : null}
                />
              ))}
              {!isPremium && activeTab === 'recommended' && currentCards.length > 0 && (
                <div style={{ position: 'relative', filter: 'blur(4px)', pointerEvents: 'none' }}>
                  {currentCards.slice(1).map((card, i) => (
                    <CardResult key={i} card={card} isNew rank={i + 2} />
                  ))}
                </div>
              )}
              {!isPremium && activeTab === 'recommended' && (
                <div style={{ position: 'relative', marginTop: -200 }}>
                  <PremiumLock navigate={navigate} />
                </div>
              )}
            </div>

            {/* 2-Card Combo */}
            {data.best_combo && (
              <div style={{ marginTop: 32, position: 'relative' }}>
                <div style={{ color: '#F0EEFF', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
                  🃏 Optimal 2-Card Strategy
                  {!isPremium && (
                    <span style={{ marginLeft: 10, background: 'rgba(245,158,11,0.15)', color: '#F59E0B', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>PREMIUM</span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  {!isPremium && (
                    <div style={{ filter: 'blur(6px)', pointerEvents: 'none' }}>
                      <ComboSection combo={data.best_combo} />
                    </div>
                  )}
                  {isPremium && <ComboSection combo={data.best_combo} />}
                  {!isPremium && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ textAlign: 'center', background: 'rgba(5,4,15,0.9)', borderRadius: 16, padding: 28 }}>
                        <div style={{ fontSize: 28, marginBottom: 10 }}>🔒</div>
                        <div style={{ color: '#F0EEFF', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Premium Feature</div>
                        <button onClick={() => navigate('/pricing')} style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Upgrade →</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div style={{ marginTop: 32, background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.08)', borderRadius: 12, padding: 16, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ color: '#6B6490', flexShrink: 0 }}>ℹ️</span>
              <p style={{ color: '#6B6490', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                Values are estimates based on your spending patterns and current reward rates. Point values vary by redemption method. Always verify card terms before applying.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}