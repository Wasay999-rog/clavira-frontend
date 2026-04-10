import Section from '../components/Section.jsx';

const HOW_IT_WORKS = [
  { icon: '🏦', step: '01', title: 'Connect your bank', desc: 'Securely link your accounts via Plaid — the same technology trusted by Venmo and Coinbase. Read-only access. We can never move money.' },
  { icon: '🤖', step: '02', title: 'AI analyzes your data', desc: 'Our engine scores your spending against 50+ credit cards, builds a personalized payoff plan, and estimates your credit score in seconds.' },
  { icon: '📈', step: '03', title: 'You optimize and earn', desc: 'Follow your custom plan, use the right card for each purchase, and watch your net worth grow.' },
];

const TRUST = [
  { icon: '🔒', title: 'Bank-level Security', desc: 'Plaid-powered, read-only access. We never store your credentials.' },
  { icon: '👁️', title: 'Transparent AI', desc: 'We show you exactly how every recommendation is calculated.' },
  { icon: '🚫', title: 'No Ads Ever', desc: 'We only make money from subscriptions — never from selling your data.' },
  { icon: '📧', title: 'Real Support', desc: 'Email us and a human responds. No chatbots, no runaround.' },
];

const ROADMAP = [
  { done: true, item: 'AI payoff strategy engine' },
  { done: true, item: 'Card optimizer with 50+ cards' },
  { done: true, item: 'Real-time Plaid bank sync' },
  { done: true, item: 'Estimated credit score engine' },
  { done: false, item: 'Mobile app (iOS & Android)' },
  { done: false, item: 'Push notifications & reminders' },
  { done: false, item: 'Halal financial product recommendations' },
  { done: false, item: 'Team accounts for families & businesses' },
];

export default function AboutPage({ navigate }) {
  return (
    <div style={{ paddingTop: 90, paddingBottom: 80 }}>
      {/* Hero */}
      <Section>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 80px' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, fontWeight: 800, color: '#fff',
            margin: '0 auto 24px',
          }}>C</div>
          <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16, color: 'var(--text)' }}>
            About Clavira Finance
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 18, lineHeight: 1.7 }}>
            Your AI-powered financial co-pilot. Built to help real people get out of debt, maximize rewards, and take control of their financial lives.
          </p>
        </div>
      </Section>

      {/* Why we built it */}
      <Section>
        <div style={{
          background: 'linear-gradient(135deg, #1A0E3A, #0F0D1F)',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 24, padding: '48px',
          maxWidth: 800, margin: '0 auto 80px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 200, height: 200, borderRadius: '50%',
            background: 'rgba(124,58,237,0.15)',
          }} />
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 24 }}>
            Why I built this
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
            I built Clavira after spending years watching people — including myself — lose thousands of dollars to credit card interest while simultaneously leaving reward points sitting unused.
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
            The tools that existed were either too complex, too generic, or just dashboards that showed you data without telling you what to do. Nobody was building a real AI-powered advisor that actually looked at your spending and said: "use this card here, pay this one off first, and here's exactly how to redeem your points for maximum value."
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
            That's Clavira. One platform that connects your real bank data, analyzes it with AI, and gives you a clear action plan — not just charts.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderTop: '1px solid rgba(124,58,237,0.12)', paddingTop: 24 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'rgba(124,58,237,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 800, color: '#fff', flexShrink: 0,
            }}>W</div>
            <div>
              <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 15 }}>Wasay Mohammed</div>
              <div style={{ color: '#A78BFA', fontSize: 13, marginTop: 2 }}>Founder & CEO · Clavira Finance</div>
              <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2 }}>M.S. Business Analytics · Credit Risk Background</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 40, color: 'var(--text)' }}>
          The problem we're solving
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 800, margin: '0 auto 80px' }}>
          {[
            { stat: '$6,000', label: 'Average American credit card debt', color: '#F43F5E' },
            { stat: '22%', label: 'Average credit card APR in 2026', color: '#F59E0B' },
            { stat: '$1,200+', label: 'Interest paid per year on average balance', color: '#A78BFA' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'linear-gradient(135deg, #1A0E3A, #0F0D1F)',
              border: '1px solid rgba(124,58,237,0.15)',
              borderRadius: 20, padding: 28,
            }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: s.color, marginBottom: 8 }}>{s.stat}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works */}
      <Section>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 40, color: 'var(--text)' }}>
          How it works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 900, margin: '0 auto 80px' }}>
          {HOW_IT_WORKS.map((s, i) => (
            <div key={i} style={{
              background: '#0F0D1F',
              border: '1px solid rgba(124,58,237,0.12)',
              borderRadius: 20, padding: 28,
            }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{s.icon}</div>
              <div style={{ color: 'rgba(124,58,237,0.5)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 8 }}>STEP {s.step}</div>
              <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{s.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Roadmap */}
      <Section>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 40, color: 'var(--text)' }}>
          What's coming
        </h2>
        <div style={{
          background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.12)',
          borderRadius: 20, padding: 32, maxWidth: 600, margin: '0 auto 80px',
        }}>
          {ROADMAP.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < ROADMAP.length - 1 ? '1px solid rgba(124,58,237,0.08)' : 'none' }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                background: item.done ? 'rgba(16,185,129,0.2)' : 'rgba(124,58,237,0.1)',
                border: `2px solid ${item.done ? '#10B981' : 'rgba(124,58,237,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, fontSize: 12,
              }}>
                {item.done ? '✓' : ''}
              </div>
              <span style={{ color: item.done ? 'var(--text)' : 'var(--muted)', fontSize: 14, flex: 1 }}>{item.item}</span>
              {!item.done && (
                <span style={{ background: 'rgba(124,58,237,0.12)', color: '#7C3AED', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>Soon</span>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Trust */}
      <Section>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 40, color: 'var(--text)' }}>
          Why trust us
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 900, margin: '0 auto 80px' }}>
          {TRUST.map((t, i) => (
            <div key={i} style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 20, padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{t.icon}</div>
              <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{t.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>Ready to optimize?</h2>
          <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 32 }}>Join thousands of users already saving money with Clavira.</p>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '14px 32px', fontSize: 15, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Get started free →
          </button>
        </div>
      </Section>
    </div>
  );
}