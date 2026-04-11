import { useState, useEffect } from 'react';
import { api } from '../api.js';
import { useAuth } from '../components/AuthContext.jsx';
import Section from '../components/Section.jsx';
import './PricingPage.css';

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Yes — no contracts, no fees. Cancel anytime from your account settings.' },
  { q: 'Is my financial data secure?', a: 'Bank-level encryption, read-only access through Plaid. We never store your bank credentials.' },
  { q: 'How does the AI optimizer work?', a: 'Analyzes your real spending against 50+ credit cards and builds a personalized strategy based on your actual data.' },
  { q: 'Do you support all banks?', a: 'Over 12,000 institutions in the US via Plaid, including Chase, BofA, Citi, Capital One, Amex, Discover, and more.' },
  { q: "What if I don't save money?", a: "Email us within 30 days for a full refund. No questions asked." },
  { q: 'Can I use a promo code?', a: 'Yes! Enter your promo code at checkout. Codes are applied automatically.' },
];

export default function PricingPage({ showToast, navigate }) {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const isPremium = user?.tier === 'premium' || user?.tier === 'business';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') setShowSuccess(true);
  }, []);

  const handleUpgrade = async (tier) => {
    if (!user) { navigate('/register'); return; }
    if (isPremium) {
      setLoading(tier);
      try {
        const res = await api.getPortal();
        window.location.href = res.portal_url;
      } catch { showToast('Could not open billing portal. Please try again.'); }
      finally { setLoading(''); }
      return;
    }
    setLoading(tier);
    try {
      const res = await api.createCheckout(tier, couponCode);
      window.location.href = res.checkout_url;
    } catch { showToast('Could not start checkout. Please try again.'); }
    finally { setLoading(''); }
  };

  const tiers = [
    {
      name: 'Free', price: 0, period: 'forever', highlighted: false, color: '#6B6490',
      features: ['✓ Dashboard with real bank data','✓ Basic debt calculator','✓ AI chatbot','✓ Credit score estimate','✓ 5 recent transactions','✓ First card recommendation'],
      cta: user?.tier === 'free' ? 'Current Plan' : 'Get Started Free',
      disabled: !user || user?.tier === 'free',
    },
    {
      name: 'Premium', price: 9.99, period: 'month', highlighted: true, color: '#7C3AED',
      features: ['✓ Everything in Free','✓ Full AI payoff strategy','✓ Complete card optimizer (50+ cards)','✓ 2-card combo strategy','✓ Transfer partner analysis','✓ Step-by-step redemption guides','✓ Spending breakdown charts','✓ Unlimited transactions','✓ Priority support'],
      cta: !user ? 'Get Premium' : isPremium ? 'Manage Subscription' : 'Upgrade to Premium',
      disabled: false,
    },
    {
      name: 'Business', price: 29.99, period: 'month', highlighted: false, color: '#3B82F6',
      features: ['✓ Everything in Premium','✓ Team accounts','✓ API access','✓ Custom reports','✓ Business card tracking','✓ Dedicated account manager'],
      cta: 'Contact Us',
      disabled: false,
      contactOnly: true,
    },
  ];

  return (
    <div className="pricing-page">
      <Section>
        {showSuccess && (
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: '20px 24px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 28 }}>🎉</span>
            <div>
              <div style={{ color: '#10B981', fontWeight: 700, fontSize: 16 }}>Welcome to Premium!</div>
              <div style={{ color: '#6B6490', fontSize: 14, marginTop: 4 }}>Your account has been upgraded. All premium features are now unlocked.</div>
            </div>
          </div>
        )}

        <h1 className="pg-heading">Simple, Transparent Pricing</h1>
        <p className="pg-sub">Start free. Upgrade when you're ready. Cancel anytime.</p>

        <div style={{ background: 'linear-gradient(135deg, #1A0E3A, #0F0D1F)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: '20px 32px', marginBottom: 40, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[{ val: '$612', label: 'avg. rewards gained/year', color: '#10B981' }, { val: '8mo', label: 'faster than min. payments', color: '#A78BFA' }, { val: '50+', label: 'cards analyzed for you', color: '#F59E0B' }].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ color: s.color, fontWeight: 800, fontSize: 28 }}>{s.val}</div>
              <div style={{ color: '#6B6490', fontSize: 13, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {user && !isPremium && (
          <div style={{ maxWidth: 360, margin: '0 auto 32px', textAlign: 'center' }}>
            <div style={{ color: '#6B6490', fontSize: 13, marginBottom: 8 }}>Have a promo code?</div>
            <input
              value={couponCode}
              onChange={e => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter code (e.g. LAUNCH20)"
              style={{ width: '100%', background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10, padding: '10px 16px', color: '#F0EEFF', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '0.05em' }}
            />
            {couponCode && <div style={{ color: '#10B981', fontSize: 12, marginTop: 6 }}>✓ Code will be applied at checkout</div>}
          </div>
        )}

        <div className="pricing-grid">
          {tiers.map(t => (
            <div key={t.name} className={`pricing-tier ${t.highlighted ? 'hl' : ''}`} style={{ position: 'relative' }}>
              {t.highlighted && <div className="pricing-badge">Most Popular</div>}
              {user?.tier === t.name.toLowerCase() && (
                <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999 }}>CURRENT</div>
              )}
              <div className="pricing-name" style={{ color: t.color }}>{t.name}</div>
              <div className="pricing-price-row">
                <span className="pricing-price">${t.price === 0 ? '0' : t.price}</span>
                <span className="pricing-period">{t.period === 'forever' ? 'forever' : `/${t.period}`}</span>
              </div>
              <div className="pricing-features">
                {t.features.map(f => <div key={f} className="pricing-feat" style={{ color: '#A0A0B8' }}>{f}</div>)}
              </div>
              <button
                className={`pricing-btn ${t.highlighted ? 'primary' : ''}`}
                disabled={t.disabled || loading === t.name.toLowerCase()}
                onClick={() => t.contactOnly ? navigate('/contact') : handleUpgrade(t.name.toLowerCase())}
                style={{ opacity: t.disabled ? 0.5 : 1, cursor: t.disabled ? 'default' : 'pointer' }}
              >
                {loading === t.name.toLowerCase() ? 'Loading...' : t.cta}
              </button>
              {t.name === 'Premium' && !isPremium && (
                <div style={{ textAlign: 'center', marginTop: 10, color: '#6B6490', fontSize: 12 }}>No commitment · Cancel anytime</div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', margin: '32px 0', padding: '20px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 16 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🛡️</div>
          <div style={{ color: '#10B981', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>30-Day Money-Back Guarantee</div>
          <div style={{ color: '#6B6490', fontSize: 14 }}>Not happy? Email us within 30 days for a full refund. No questions asked.</div>
        </div>

        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 24, textAlign: 'center', marginBottom: 24 }}>Common Questions</h2>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid rgba(124,58,237,0.08)', cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0' }}>
                <span style={{ color: '#F0EEFF', fontWeight: 600, fontSize: 15 }}>{faq.q}</span>
                <span style={{ color: '#7C3AED', fontSize: 20, flexShrink: 0, marginLeft: 16 }}>{openFaq === i ? '−' : '+'}</span>
              </div>
              {openFaq === i && <p style={{ color: '#6B6490', fontSize: 14, lineHeight: 1.7, paddingBottom: 18, marginTop: -8 }}>{faq.a}</p>}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
