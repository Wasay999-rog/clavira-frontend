import { useState, useEffect } from 'react';
import { api } from '../api.js';
import Section from '../components/Section.jsx';
import './HomePage.css';

export default function HomePage({ navigate, showToast }) {
  const [email, setEmail] = useState('');
  const [dotOn, setDotOn] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setDotOn(p => !p), 900);
    return () => clearInterval(t);
  }, []);

  const handleJoin = async () => {
    if (!email || !email.includes('@')) { showToast('❌ Please enter a valid email'); return; }
    setSubmitting(true);
    try {
      const res = await api.joinWaitlist(email);
      showToast(`✅ ${res.message}`);
      setEmail('');
    } catch {
      showToast('❌ Could not join waitlist. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Section style={{ paddingTop: 100, paddingBottom: 100 }}>
        <div className="hero-grid">
          <div className="hero-left">
            <div className="hero-badge">
              <div className="hero-badge-dot" style={{ opacity: dotOn ? 1 : 0.25 }} />
              <span>Now accepting early access</span>
            </div>
            <h1 className="hero-title">
              Stop wasting money on credit cards.<br />
              <span className="hero-title-gradient">Start keeping it.</span>
            </h1>
            <p className="hero-sub">
              Clavira uses AI to optimize your credit card payments, maximize rewards, and help you become debt-free faster.
            </p>
            <div className="hero-form">
              <input className="hero-input" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email" onKeyDown={e => e.key === 'Enter' && handleJoin()} />
              <button className="hero-cta" onClick={handleJoin} disabled={submitting}>
                {submitting ? 'Joining...' : 'Join Waitlist →'}
              </button>
            </div>
            <div className="hero-trust-badges">
              <span>🔒 Encrypted</span><span>🚀 Free to start</span><span>⚡ 2min setup</span>
            </div>
            <div className="hero-stats">
              {[{ val: '$612', label: 'avg. rewards gained/year' }, { val: '8mo', label: 'faster than min. payments' }, { val: '50+', label: 'cards analyzed' }].map(s => (
                <div key={s.label} className="hero-stat">
                  <div className="hero-stat-val">{s.val}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-right">
            <div className="dash-card">
              <div className="dash-header">Credit Card Overview</div>
              {[
                { name: 'Amex Blue Cash', bal: 4118, limit: 8000, color: 'var(--blue)' },
                { name: 'Citi Diamond', bal: 3918, limit: 7500, color: 'var(--gold)' },
                { name: 'Chase Freedom', bal: 1238, limit: 5000, color: 'var(--green)' },
              ].map(c => (
                <div key={c.name} className="dash-row">
                  <div className="dash-row-top">
                    <span>{c.name}</span>
                    <span className="dash-row-nums">${c.bal.toLocaleString()} / ${c.limit.toLocaleString()}</span>
                  </div>
                  <div className="dash-bar-track">
                    <div className="dash-bar-fill" style={{ width: `${(c.bal / c.limit) * 100}%`, background: c.color }} />
                  </div>
                </div>
              ))}
              <div className="dash-insight">
                <div className="dash-insight-label">💡 AI Insight</div>
                <div className="dash-insight-text">Pay $87 extra on Citi Diamond this month to save $234 in interest over the next year.</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section style={{ paddingBottom: 100 }}>
        <div className="trust-grid">
          {[
            { icon: '🔒', title: 'Bank-Grade Security', desc: '256-bit AES encryption' },
            { icon: '🏦', title: '12,000+ Institutions', desc: 'All major banks supported' },
            { icon: '✅', title: 'SOC 2 Compliant', desc: 'Audited & certified' },
            { icon: '👁', title: 'Read-Only Access', desc: 'We never move your money' },
          ].map(t => (
            <div key={t.title} className="trust-item">
              <span className="trust-icon">{t.icon}</span>
              <div><div className="trust-title">{t.title}</div><div className="trust-desc">{t.desc}</div></div>
            </div>
          ))}
        </div>
      </Section>

      <Section style={{ paddingBottom: 100 }}>
        <h2 className="section-heading">The hidden cost of credit cards</h2>
        <p className="section-sub">Most people lose thousands every year without realizing it</p>
        <div className="problems-grid">
          {[
            { num: '01', color: 'var(--purple)', title: 'Interest Overload', desc: 'The average American pays $1,380/year in credit card interest alone.', cost: '$1,380/yr' },
            { num: '02', color: 'var(--blue)', title: 'Wrong Card, Wrong Time', desc: 'Using the wrong card for purchases leaves cashback and rewards on the table.', cost: '$340/yr' },
            { num: '03', color: 'var(--green)', title: 'No Unified View', desc: 'Juggling multiple apps and statements means you miss payment deadlines.', cost: '$156/yr' },
          ].map(p => (
            <div key={p.num} className="problem-card">
              <div className="problem-num" style={{ '--c': p.color }}>{p.num}</div>
              <div className="problem-title">{p.title}</div>
              <div className="problem-desc">{p.desc}</div>
              <div className="problem-cost">−{p.cost} wasted</div>
            </div>
          ))}
        </div>
      </Section>

      <Section style={{ paddingBottom: 60 }}>
        <h2 className="section-heading">How it works</h2>
        <div className="hiw-grid">
          <div className="hiw-steps">
            {[
              { num: '01', color: 'var(--purple)', title: 'Connect Your Cards', desc: 'Securely link all your credit cards in under 60 seconds.' },
              { num: '02', color: 'var(--blue)', title: 'Get Your AI Plan', desc: 'Our engine analyzes your rates, balances, and spending.' },
              { num: '03', color: 'var(--green)', title: 'Save Automatically', desc: 'Follow optimized schedules and watch your debt shrink.' },
            ].map(s => (
              <div key={s.num} className="hiw-step">
                <div className="hiw-pill" style={{ background: s.color }}>{s.num}</div>
                <div>
                  <div className="hiw-step-title">{s.title}</div>
                  <div className="hiw-step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="hiw-visual">
            <div className="surface-card">
              <div className="surface-card-title">Financial Overview</div>
              {[
                { label: 'Debt Payoff', pct: 68, color: 'var(--purple)' },
                { label: 'Rewards Optimized', pct: 85, color: 'var(--green)' },
                { label: 'Credit Score Impact', pct: 42, color: 'var(--blue)' },
              ].map(b => (
                <div key={b.label} className="bar-group">
                  <div className="bar-label-row"><span>{b.label}</span><span className="bar-pct">{b.pct}%</span></div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${b.pct}%`, background: b.color }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
