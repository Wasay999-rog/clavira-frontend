import { useState, useEffect } from 'react';
import { api } from '../api.js';
import Section from '../components/Section.jsx';
import './PricingPage.css';

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Yes — no contracts, no fees. Cancel with one click.' },
  { q: 'Is my financial data secure?', a: '256-bit AES encryption, SOC 2 compliant, read-only access through Plaid.' },
  { q: 'How does the AI optimizer work?', a: 'Analyzes your rates, balances, and cash flow to minimize total interest paid.' },
  { q: 'Do you support all banks?', a: 'Over 12,000 institutions in the US and Canada via Plaid.' },
  { q: "What if I don't save money?", a: "90-day money-back guarantee if we don't save you more than the subscription cost." },
];

export default function PricingPage({ showToast }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [signupTier, setSignupTier] = useState(null);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupName, setSignupName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { api.getPricing().then(setPricing).catch(() => {}); }, []);

  const tiers = pricing?.tiers || [
    { name: 'Free', price: 0, period: 'forever', features: ['3 credit cards','Basic dashboard','Min payment calculator','Email support'], highlighted: false },
    { name: 'Premium', price: 9.99, period: 'month', features: ['Unlimited cards','AI payment optimizer','Card recommender','Health score','Priority support'], highlighted: true },
    { name: 'Business', price: 29.99, period: 'month', features: ['Everything in Premium','Team accounts','API access','Custom reports','Dedicated manager'], highlighted: false },
  ];
  const vp = pricing?.value_prop || { annual_cost: 120, annual_savings: 612, roi_multiple: 5.1 };

  const handleSignup = async () => {
    if (!signupEmail || !signupEmail.includes('@')) { showToast('❌ Please enter a valid email'); return; }
    setSubmitting(true);
    try {
      const res = await api.pricingSignup(signupTier, signupEmail, signupName);
      showToast(`✅ ${res.message}`);
      setSignupTier(null);
      setSignupEmail('');
      setSignupName('');
    } catch {
      showToast('❌ Could not process signup. Try again.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="pricing-page"><Section>
      <h1 className="pg-heading">Simple, Transparent Pricing</h1>
      <p className="pg-sub">Start free, upgrade when you're ready</p>

      <div className="pricing-grid">
        {tiers.map(t => (
          <div key={t.name} className={`pricing-tier ${t.highlighted?'hl':''}`}>
            {t.highlighted && <div className="pricing-badge">Most Popular</div>}
            <div className="pricing-name">{t.name}</div>
            <div className="pricing-price-row">
              <span className="pricing-price">${t.price === 0 ? '0' : t.price}</span>
              <span className="pricing-period">{t.period === 'forever' ? 'forever' : `/${t.period}`}</span>
            </div>
            <div className="pricing-features">
              {t.features.map(f => <div key={f} className="pricing-feat"><span className="check">✓</span> {f}</div>)}
            </div>
            <button className={`pricing-btn ${t.highlighted?'primary':''}`} onClick={() => setSignupTier(t.name)}>
              Get Started
            </button>
          </div>
        ))}
      </div>

      {/* Signup Modal */}
      {signupTier && (
        <div className="modal-overlay" onClick={() => setSignupTier(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Get Started with {signupTier}</h3>
            <p className="modal-sub">Enter your details and we'll reach out to set you up.</p>
            <input className="modal-input" placeholder="Your name (optional)" value={signupName} onChange={e => setSignupName(e.target.value)} />
            <input className="modal-input" placeholder="Your email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
            <div className="modal-btns">
              <button className="modal-cancel" onClick={() => setSignupTier(null)}>Cancel</button>
              <button className="modal-submit" onClick={handleSignup} disabled={submitting}>{submitting ? 'Sending...' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="value-box">
        <div className="value-title">The Math Speaks for Itself</div>
        <div className="value-text">
          <span className="gold">${vp.annual_cost}/year</span> cost vs <span className="green">${vp.annual_savings}/year</span> savings = <span className="roi">{vp.roi_multiple}× return</span>
        </div>
      </div>

      <h2 className="faq-heading">Frequently Asked Questions</h2>
      <div className="faq-list">
        {FAQS.map((f, i) => (
          <div key={i} className="faq-item">
            <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              {f.q}<span className="faq-icon" style={{ transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            {openFaq === i && <div className="faq-a">{f.a}</div>}
          </div>
        ))}
      </div>
    </Section></div>
  );
}
