import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { api } from '../api';
import Section from '../components/Section.jsx';

export default function CardsPage({ navigate }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('optimizer');
  const [optimizerData, setOptimizerData] = useState(null);
  const [rewardsData, setRewardsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isPremium = user?.tier === 'premium' || user?.tier === 'business';

  useEffect(() => {
    Promise.all([
      api.getOptimizer().catch(() => null),
      api.getRewards().catch(() => null),
    ]).then(([opt, rew]) => {
      setOptimizerData(opt);
      setRewardsData(rew);
      setLoading(false);
    });
  }, []);

  const CAT_COLORS = ['#7C3AED', '#3B82F6', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6'];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(124,58,237,0.2)', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <div style={{ color: '#6B6490', fontSize: 14 }}>Analyzing your cards...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 24, paddingBottom: 80 }}>
      <Section>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', marginBottom: 8 }}>Cards & Rewards</h1>
            <p style={{ color: '#6B6490', fontSize: 15 }}>Optimize your cards and track your rewards</p>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 14, padding: 4, marginBottom: 28, width: 'fit-content' }}>
          {[
            { key: 'optimizer', label: '✦ Card Optimizer' },
            { key: 'rewards', label: '🏆 My Rewards' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: activeTab === tab.key ? '#7C3AED' : 'none',
                border: 'none', borderRadius: 10, padding: '10px 24px',
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

        {/* ── OPTIMIZER TAB ── */}
        {activeTab === 'optimizer' && (
          <>
            {!optimizerData?.has_data ? (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🃏</div>
                <h2 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 22, marginBottom: 12 }}>No spending data yet</h2>
                <p style={{ color: '#6B6490', fontSize: 15, marginBottom: 24 }}>Connect a bank account to get personalized card recommendations.</p>
                <button onClick={() => navigate('/connect-bank')} style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Connect Bank →</button>
              </div>
            ) : (
              <>
                {/* Hero stats */}
                <div style={{ background: 'linear-gradient(135deg, #1A0E3A, #0F0D1F)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: 28, marginBottom: 28, display: 'flex', gap: 28, flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(124,58,237,0.12)', pointerEvents: 'none' }} />
                  {[
                    { label: 'You Could Earn', value: `$${(optimizerData.best_single_card?.[0]?.net_value || 0).toLocaleString()}/yr`, color: '#10B981' },
                    { label: 'Currently Earning', value: `$${(optimizerData.existing_cards?.reduce((s, c) => s + (c.net_value || 0), 0) || 0).toLocaleString()}/yr`, color: '#A78BFA' },
                    { label: 'Annual Spend', value: `$${(optimizerData.spending_profile?.projected_annual || 0).toLocaleString()}`, color: '#F0EEFF' },
                  ].map((s, i) => (
                    <div key={i}>
                      <div style={{ color: '#6B6490', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{s.label}</div>
                      <div style={{ color: s.color, fontWeight: 800, fontSize: 28, lineHeight: 1 }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                  {/* Spending DNA */}
                  <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 20, padding: 24 }}>
                    <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Your Spending DNA</div>
                    {(optimizerData.spending_profile?.top_categories || []).map((cat, i) => {
                      const max = optimizerData.spending_profile.top_categories[0]?.annual || 1;
                      const pct = Math.round((cat.annual / max) * 100);
                      return (
                        <div key={i} style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ color: '#F0EEFF', fontSize: 14, fontWeight: 500 }}>{cat.category}</span>
                            <span style={{ color: '#6B6490', fontSize: 13 }}>${cat.annual.toLocaleString()}/yr</span>
                          </div>
                          <div style={{ height: 6, background: 'rgba(124,58,237,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: 6, width: `${pct}%`, background: CAT_COLORS[i % CAT_COLORS.length], borderRadius: 3 }} />
                          </div>
                        </div>
                      );
                    })}
                    <div style={{ color: '#6B6490', fontSize: 12, marginTop: 12 }}>Based on last 90 days · projected annually</div>
                  </div>

                  {/* Missing out */}
                  {(optimizerData.spending_insights || []).length > 0 && (
                    <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 20, padding: 24 }}>
                      <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Where You're Missing Out</div>
                      {optimizerData.spending_insights.map((insight, i) => (
                        <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < optimizerData.spending_insights.length - 1 ? '1px solid rgba(124,58,237,0.06)' : 'none' }}>
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

                {/* Best cards */}
                <div style={{ marginTop: 28 }}>
                  <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Best Cards For You</div>
                  <div style={{ position: 'relative' }}>
                    {/* Show first card free */}
                    {(optimizerData.best_single_card || []).slice(0, 1).map((card, i) => (
                      <div key={i} style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 20, padding: 24, marginBottom: 12 }}>
                        <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)', color: '#A78BFA', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, marginBottom: 12 }}>✦ #1 RECOMMENDED</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                          <div>
                            <div style={{ color: '#F0EEFF', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{card.card_name}</div>
                            <div style={{ color: '#6B6490', fontSize: 14 }}>{card.issuer} · {card.point_currency}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#10B981', fontWeight: 800, fontSize: 28 }}>${card.net_value.toLocaleString()}</div>
                            <div style={{ color: '#6B6490', fontSize: 12 }}>net/year for you</div>
                          </div>
                        </div>
                        <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                          <div style={{ background: 'rgba(124,58,237,0.08)', borderRadius: 10, padding: '8px 14px' }}>
                            <div style={{ color: '#A78BFA', fontWeight: 700 }}>${card.gross_value.toLocaleString()}</div>
                            <div style={{ color: '#6B6490', fontSize: 12 }}>gross value</div>
                          </div>
                          <div style={{ background: 'rgba(244,63,94,0.08)', borderRadius: 10, padding: '8px 14px' }}>
                            <div style={{ color: '#F43F5E', fontWeight: 700 }}>{card.annual_fee === 0 ? 'No fee' : `$${card.annual_fee}/yr`}</div>
                            <div style={{ color: '#6B6490', fontSize: 12 }}>annual fee</div>
                          </div>
                        </div>
                        {/* Top categories */}
                        {(card.category_breakdown || []).length > 0 && (
                          <div style={{ marginTop: 16, borderTop: '1px solid rgba(124,58,237,0.08)', paddingTop: 16 }}>
                            <div style={{ color: '#6B6490', fontSize: 12, marginBottom: 10 }}>Earnings by category:</div>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                              {card.category_breakdown.slice(0, 4).map((cat, j) => (
                                <div key={j} style={{ background: 'rgba(124,58,237,0.08)', borderRadius: 8, padding: '6px 12px' }}>
                                  <span style={{ color: '#A78BFA', fontWeight: 700, fontSize: 13 }}>{cat.rate}x </span>
                                  <span style={{ color: '#6B6490', fontSize: 13 }}>{cat.category}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Lock remaining cards for free users */}
                    {!isPremium && (optimizerData.best_single_card || []).length > 1 && (
                      <div style={{ background: 'linear-gradient(135deg, #1A0E3A, #0F0D1F)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 20, padding: 36, textAlign: 'center', marginTop: 12 }}>
                        <div style={{ fontSize: 32, marginBottom: 14 }}>🔒</div>
                        <h3 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 20, marginBottom: 10 }}>
                          {(optimizerData.best_single_card.length - 1)} More Cards + 2-Card Combo
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320, margin: '0 auto 24px', textAlign: 'left' }}>
                          {['✦ Full card rankings for your spending', '✦ Optimal 2-card wallet strategy', '✦ Transfer partner analysis (2x value)', '✦ Step-by-step redemption guides'].map((f, i) => (
                            <div key={i} style={{ color: '#A78BFA', fontSize: 14 }}>{f}</div>
                          ))}
                        </div>
                        <button onClick={() => navigate('/pricing')} style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                          Upgrade to Premium →
                        </button>
                        <div style={{ color: '#4A4368', fontSize: 12, marginTop: 10 }}>$9.99/month · Cancel anytime</div>
                      </div>
                    )}

                    {/* Show all cards for premium */}
                    {isPremium && (optimizerData.best_single_card || []).slice(1).map((card, i) => (
                      <div key={i} style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 20, padding: 24, marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                          <div>
                            <div style={{ color: '#6B6490', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>#{i + 2}</div>
                            <div style={{ color: '#F0EEFF', fontWeight: 700, fontSize: 16 }}>{card.card_name}</div>
                            <div style={{ color: '#6B6490', fontSize: 13, marginTop: 2 }}>{card.issuer} · {card.point_currency}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#A78BFA', fontWeight: 800, fontSize: 22 }}>${card.net_value.toLocaleString()}</div>
                            <div style={{ color: '#6B6490', fontSize: 12 }}>net/year</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2-card combo for premium */}
                {isPremium && optimizerData.best_combo && (
                  <div style={{ marginTop: 28, background: 'linear-gradient(135deg, #1A0E3A, #0F0D1F)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 20, padding: 28 }}>
                    <div style={{ display: 'inline-block', background: 'rgba(124,58,237,0.2)', color: '#A78BFA', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, marginBottom: 16 }}>✦ OPTIMAL 2-CARD STRATEGY</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 14, padding: 16 }}>
                        <div style={{ color: '#F0EEFF', fontWeight: 700 }}>{optimizerData.best_combo.card1?.name}</div>
                        <div style={{ color: '#6B6490', fontSize: 13 }}>{optimizerData.best_combo.card1?.issuer}</div>
                      </div>
                      <div style={{ color: '#A78BFA', fontWeight: 800, fontSize: 24 }}>+</div>
                      <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 14, padding: 16 }}>
                        <div style={{ color: '#F0EEFF', fontWeight: 700 }}>{optimizerData.best_combo.card2?.name}</div>
                        <div style={{ color: '#6B6490', fontSize: 13 }}>{optimizerData.best_combo.card2?.issuer}</div>
                      </div>
                    </div>
                    <div style={{ color: '#10B981', fontWeight: 800, fontSize: 24 }}>${optimizerData.best_combo.total_net_value?.toLocaleString()}/yr combined value</div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── REWARDS TAB ── */}
        {activeTab === 'rewards' && (
          <>
            {!rewardsData || !rewardsData.cards?.length ? (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
                <h2 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 22, marginBottom: 12 }}>No cards linked yet</h2>
                <p style={{ color: '#6B6490', fontSize: 15, marginBottom: 24 }}>Connect your credit cards to see your rewards breakdown.</p>
                <button onClick={() => navigate('/connect-bank')} style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Connect Bank →</button>
              </div>
            ) : (
              <>
                {/* Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
                  {[
                    { label: 'Total Points', value: (rewardsData.total_points || 0).toLocaleString(), color: '#A78BFA' },
                    { label: 'Cash Value', value: `$${(rewardsData.total_value || 0).toFixed(2)}`, color: '#10B981' },
                    { label: 'Pending', value: `$${(rewardsData.total_pending || 0).toFixed(2)}`, color: '#F59E0B' },
                  ].map((s, i) => (
                    <div key={i} style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 16, padding: '20px 24px' }}>
                      <div style={{ color: '#6B6490', fontSize: 12, marginBottom: 8 }}>{s.label}</div>
                      <div style={{ color: s.color, fontWeight: 800, fontSize: 28 }}>{s.value}</div>
                    </div>
                  ))}
                </div>

                {/* Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 28 }}>
                  {rewardsData.cards.map((c, i) => (
                    <div key={i} style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 20, padding: 24 }}>
                      <div style={{ color: '#F0EEFF', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                        {c.name} {c.mask && <span style={{ color: '#6B6490', fontSize: 13 }}>··{c.mask}</span>}
                      </div>
                      <div style={{ color: '#6B6490', fontSize: 13, marginBottom: 16 }}>{c.cashback_rate}</div>
                      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                        <div>
                          <div style={{ color: '#A78BFA', fontWeight: 700, fontSize: 20 }}>{(c.points || 0).toLocaleString()}</div>
                          <div style={{ color: '#6B6490', fontSize: 12 }}>points earned</div>
                        </div>
                        <div>
                          <div style={{ color: '#10B981', fontWeight: 700, fontSize: 20 }}>${(c.points_value || 0).toFixed(2)}</div>
                          <div style={{ color: '#6B6490', fontSize: 12 }}>cash value</div>
                        </div>
                      </div>
                      {c.total_spent > 0 && (
                        <div style={{ color: '#6B6490', fontSize: 13, marginBottom: 12 }}>Total spent: ${c.total_spent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                      )}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {c.best_for.map((b, j) => (
                          <span key={j} style={{ background: 'rgba(124,58,237,0.1)', color: '#A78BFA', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 999 }}>{b}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Spending by category */}
                {(rewardsData.spending_by_category || []).length > 0 && (
                  <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 20, padding: 24, marginBottom: 24 }}>
                    <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Spending by Category</div>
                    {rewardsData.spending_by_category.slice(0, 6).map((cat, i) => {
                      const max = rewardsData.spending_by_category[0]?.amount || 1;
                      const pct = Math.round((cat.amount / max) * 100);
                      return (
                        <div key={i} style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ color: '#F0EEFF', fontSize: 14 }}>{cat.emoji} {cat.category}</span>
                            <span style={{ color: '#6B6490', fontSize: 13 }}>${cat.amount.toLocaleString()} · {cat.percentage}%</span>
                          </div>
                          <div style={{ height: 6, background: 'rgba(124,58,237,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: 6, width: `${pct}%`, background: CAT_COLORS[i % CAT_COLORS.length], borderRadius: 3 }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Optimization tips */}
                {(rewardsData.optimization_tips || []).length > 0 && (
                  <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 20, padding: 24 }}>
                    <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Optimization Tips</div>
                    {rewardsData.optimization_tips.map((tip, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < rewardsData.optimization_tips.length - 1 ? '1px solid rgba(124,58,237,0.06)' : 'none' }}>
                        <span style={{ color: tip.impact === 'high' ? '#F43F5E' : tip.impact === 'medium' ? '#F59E0B' : '#10B981', flexShrink: 0 }}>→</span>
                        <span style={{ color: '#6B6490', fontSize: 14, lineHeight: 1.6 }}>{tip.tip}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Section>
    </div>
  );
}