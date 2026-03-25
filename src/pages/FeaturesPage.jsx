import { useState } from 'react';
import Section from '../components/Section.jsx';
import './FeaturesPage.css';

export default function FeaturesPage() {
  const [stratTab, setStratTab] = useState('avalanche');
  const score = 742, angle = ((score - 300) / 550) * 360;

  return (
    <div className="features-page">
      <Section>
        <h1 className="pg-heading">Powerful Features</h1>
        <p className="pg-sub">Everything you need to master your credit cards</p>

        <div className="feat-row">
          <div className="feat-text"><h3>Unified Dashboard</h3><p>See all your credit cards, balances, due dates, and utilization in one beautiful view.</p></div>
          <div className="feat-vis">
            <div className="fv-card">
              {['Amex Gold — $2,450','Chase Sapphire — $1,890','Discover It — $680','Capital One — $340'].map((c,i) => (
                <div key={c} className="fv-row" style={{ borderBottom: i < 3 ? '1px solid rgba(124,58,237,0.06)' : 'none' }}>
                  <span>{c.split(' — ')[0]}</span><span className="fv-amt">{c.split(' — ')[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="feat-row reverse">
          <div className="feat-text"><h3>Payment Optimizer</h3><p>Choose between Avalanche, Snowball, or AI Hybrid strategy to pay off debt the smart way.</p></div>
          <div className="feat-vis">
            <div className="fv-card">
              <div className="strat-tabs">
                {['avalanche','snowball','hybrid'].map(t => (
                  <button key={t} className={`strat-tab ${stratTab===t?'active':''}`} onClick={() => setStratTab(t)}>
                    {t==='hybrid'?'AI Hybrid':t.charAt(0).toUpperCase()+t.slice(1)}
                  </button>
                ))}
              </div>
              <div className="strat-body">
                {stratTab==='avalanche'&&'Targets highest interest rate first — saves the most money over time.'}
                {stratTab==='snowball'&&'Targets smallest balance first — builds momentum with quick wins.'}
                {stratTab==='hybrid'&&'AI balances both approaches using your spending patterns and cash flow.'}
              </div>
            </div>
          </div>
        </div>

        <div className="feat-row">
          <div className="feat-text"><h3>Card Recommender</h3><p>See which card earns the most rewards for each spending category.</p></div>
          <div className="feat-vis">
            <div className="fv-card"><div className="rec-grid">
              {[{cat:'Dining',card:'Amex Gold',pct:'4%'},{cat:'Gas',card:'Citi Custom',pct:'5%'},{cat:'Travel',card:'Chase Sapphire',pct:'3%'},{cat:'Groceries',card:'Amex Blue',pct:'6%'}].map(r => (
                <div key={r.cat} className="rec-item"><div className="rec-cat">{r.cat}</div><div className="rec-card">{r.card}</div><div className="rec-pct">{r.pct} back</div></div>
              ))}
            </div></div>
          </div>
        </div>

        <div className="feat-row reverse">
          <div className="feat-text"><h3>AI Assistant</h3><p>Ask Clavira anything about your finances — get instant, personalized answers.</p></div>
          <div className="feat-vis">
            <div className="fv-card">
              <div className="chat-b user">Should I pay off Amex or Chase first?</div>
              <div className="chat-b ai">Based on your rates, paying Amex first saves $234 more in interest. I recommend Avalanche.</div>
            </div>
          </div>
        </div>

        <div className="feat-row">
          <div className="feat-text"><h3>Financial Health Score</h3><p>Track your overall financial health with our proprietary scoring system.</p></div>
          <div className="feat-vis">
            <div className="fv-card fhs-layout">
              <div className="fhs-ring-wrap">
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="38" fill="none" stroke="var(--surface2)" strokeWidth="7"/>
                  <circle cx="45" cy="45" r="38" fill="none" stroke="var(--green)" strokeWidth="7" strokeDasharray={`${(angle/360)*239} 239`} strokeLinecap="round" transform="rotate(-90 45 45)"/>
                </svg>
                <div className="fhs-score">{score}</div>
              </div>
              <div className="fhs-bars">
                {[{l:'Payment History',v:95,c:'var(--green)'},{l:'Utilization',v:62,c:'var(--gold)'},{l:'Credit Mix',v:78,c:'var(--green)'}].map(f => (
                  <div key={f.l} className="fhs-bar-g"><div className="fhs-bar-l"><span>{f.l}</span><span>{f.v}%</span></div><div className="fhs-bar-t"><div className="fhs-bar-f" style={{width:`${f.v}%`,background:f.c}}/></div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
