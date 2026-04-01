import { useState, useEffect } from 'react';
import { api } from '../api';

export default function PayoffStrategy({ navigate, isPremium }) {
  var [data, setData] = useState(null);
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState('');
  var [expanded, setExpanded] = useState(false);

  useEffect(function() {
    if (!isPremium) return;
    setLoading(true);
    api.getPayoffStrategy()
      .then(function(d) { setData(d); })
      .catch(function(err) { setError(err.detail || ''); })
      .finally(function() { setLoading(false); });
  }, [isPremium]);

  // Free user — locked CTA
  if (!isPremium) {
    return (
      <div className="payoff-section">
        <div className="payoff-header">
          <h2 className="dash-section-title">{'\u{1F680}'} Smart Payoff Plan</h2>
          <span className="dash-premium-badge">{'\u{1F512}'} Premium</span>
        </div>
        <div className="payoff-locked">
          <div className="payoff-locked-preview">
            <div className="payoff-locked-fake">
              <div className="payoff-locked-bar-row"><span>Card 1</span><div className="payoff-locked-bar" style={{width:'80%'}}/></div>
              <div className="payoff-locked-bar-row"><span>Card 2</span><div className="payoff-locked-bar" style={{width:'55%'}}/></div>
              <div className="payoff-locked-bar-row"><span>Card 3</span><div className="payoff-locked-bar" style={{width:'30%'}}/></div>
            </div>
          </div>
          <div className="payoff-locked-overlay">
            <div className="payoff-locked-icon">{'\u{1F512}'}</div>
            <p className="payoff-locked-title">Your Personalized Payoff Plan</p>
            <p className="payoff-locked-desc">Get a month-by-month strategy to pay off your cards faster, based on your real income, spending, and balances.</p>
            <button className="payoff-locked-btn" onClick={function() { navigate('/pricing'); }}>Upgrade to Premium</button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="payoff-section">
        <div className="payoff-header">
          <h2 className="dash-section-title">{'\u{1F680}'} Smart Payoff Plan</h2>
        </div>
        <div className="payoff-loading">
          <div className="dash-loading-spinner" />
          <p>Analyzing your finances...</p>
        </div>
      </div>
    );
  }

  if (error || !data) return null;
  if (!data.has_debt) {
    return (
      <div className="payoff-section">
        <div className="payoff-header">
          <h2 className="dash-section-title">{'\u{1F680}'} Smart Payoff Plan</h2>
        </div>
        <div className="payoff-no-debt">
          <span className="payoff-no-debt-icon">{'\u{1F389}'}</span>
          <p className="payoff-no-debt-text">{data.message}</p>
        </div>
      </div>
    );
  }

  var plan = data.monthly_plan || {};
  var scenarios = data.scenarios || {};
  var cards = data.card_priority || [];
  var savings = data.savings_opportunities || [];
  var capacity = data.capacity || {};

  return (
    <div className="payoff-section">
      <div className="payoff-header">
        <h2 className="dash-section-title">{'\u{1F680}'} Smart Payoff Plan</h2>
        <span className="payoff-strategy-badge">Clavira Hybrid</span>
      </div>

      {/* Hero Stats */}
      <div className="payoff-hero">
        <div className="payoff-hero-card payoff-hero-main">
          <div className="payoff-hero-label">Total Debt</div>
          <div className="payoff-hero-value red">${data.total_debt.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
          <div className="payoff-hero-sub">{data.utilization_pct}% utilization</div>
        </div>
        <div className="payoff-hero-card">
          <div className="payoff-hero-label">Debt-Free By</div>
          <div className="payoff-hero-value green">{plan.debt_free_date || 'N/A'}</div>
          <div className="payoff-hero-sub">{plan.months_to_payoff || 0} months</div>
        </div>
        <div className="payoff-hero-card">
          <div className="payoff-hero-label">Interest You'll Pay</div>
          <div className="payoff-hero-value gold">${(plan.total_interest_paid || 0).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
          <div className="payoff-hero-sub">{scenarios.recommended ? ('Save $' + scenarios.recommended.interest_saved.toLocaleString(undefined, {maximumFractionDigits: 0}) + ' vs minimums') : ''}</div>
        </div>
        <div className="payoff-hero-card">
          <div className="payoff-hero-label">Monthly Payment</div>
          <div className="payoff-hero-value purple">${(capacity.total_monthly_payment || 0).toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
          <div className="payoff-hero-sub">${(capacity.min_payments_total || 0).toFixed(0)} min + ${(capacity.recommended_extra || 0).toFixed(0)} extra</div>
        </div>
      </div>

      {/* Card Priority */}
      <div className="payoff-card-priority">
        <div className="payoff-sub-header">
          <h3>{'\u{1F3AF}'} Payment Priority</h3>
          <span className="payoff-sub-desc">Pay these in order for the fastest results</span>
        </div>
        {cards.map(function(card, i) {
          var pct = card.limit > 0 ? Math.round(card.balance / card.limit * 100) : 0;
          var pctColor = pct > 50 ? 'var(--red)' : pct > 30 ? 'var(--gold)' : 'var(--green)';
          return (
            <div key={card.name} className="payoff-card-row">
              <div className="payoff-card-rank">{'#' + (i + 1)}</div>
              <div className="payoff-card-info">
                <div className="payoff-card-name">{card.name}</div>
                <div className="payoff-card-meta">{card.reason}</div>
              </div>
              <div className="payoff-card-numbers">
                <div className="payoff-card-balance">${card.balance.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                <div className="payoff-card-rec">
                  Pay <strong>${card.recommended_payment.toLocaleString(undefined, {maximumFractionDigits: 0})}</strong>/mo
                </div>
              </div>
              <div className="payoff-card-util-wrap">
                <div className="payoff-card-util-track">
                  <div className="payoff-card-util-fill" style={{width: Math.min(pct, 100) + '%', background: pctColor}} />
                </div>
                <span className="payoff-card-util-pct" style={{color: pctColor}}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scenario Comparison */}
      {scenarios.minimum_only && (
        <div className="payoff-scenarios">
          <div className="payoff-sub-header">
            <h3>{'\u{1F4CA}'} Payoff Scenarios</h3>
          </div>
          <div className="payoff-scenario-grid">
            <div className="payoff-scenario">
              <div className="payoff-scenario-label">Minimum Only</div>
              <div className="payoff-scenario-months">{scenarios.minimum_only.months} mo</div>
              <div className="payoff-scenario-date">{scenarios.minimum_only.debt_free_date}</div>
              <div className="payoff-scenario-interest">${scenarios.minimum_only.total_interest.toLocaleString(undefined, {maximumFractionDigits: 0})} interest</div>
              <div className="payoff-scenario-payment">${scenarios.minimum_only.monthly_payment.toLocaleString(undefined, {maximumFractionDigits: 0})}/mo</div>
            </div>
            <div className="payoff-scenario payoff-scenario-rec">
              <div className="payoff-scenario-badge">Recommended</div>
              <div className="payoff-scenario-label">Clavira Plan</div>
              <div className="payoff-scenario-months">{scenarios.recommended.months} mo</div>
              <div className="payoff-scenario-date">{scenarios.recommended.debt_free_date}</div>
              <div className="payoff-scenario-interest">${scenarios.recommended.total_interest.toLocaleString(undefined, {maximumFractionDigits: 0})} interest</div>
              <div className="payoff-scenario-payment">${scenarios.recommended.monthly_payment.toLocaleString(undefined, {maximumFractionDigits: 0})}/mo</div>
              <div className="payoff-scenario-savings">
                {'\u{2705}'} Save ${scenarios.recommended.interest_saved.toLocaleString(undefined, {maximumFractionDigits: 0})} &middot; {scenarios.recommended.months_saved} months faster
              </div>
            </div>
            <div className="payoff-scenario">
              <div className="payoff-scenario-label">Aggressive</div>
              <div className="payoff-scenario-months">{scenarios.aggressive.months} mo</div>
              <div className="payoff-scenario-date">{scenarios.aggressive.debt_free_date}</div>
              <div className="payoff-scenario-interest">${scenarios.aggressive.total_interest.toLocaleString(undefined, {maximumFractionDigits: 0})} interest</div>
              <div className="payoff-scenario-payment">${scenarios.aggressive.monthly_payment.toLocaleString(undefined, {maximumFractionDigits: 0})}/mo</div>
            </div>
          </div>
        </div>
      )}

      {/* Savings Opportunities */}
      {savings.length > 0 && (
        <div className="payoff-savings">
          <div className="payoff-sub-header">
            <h3>{'\u{1F4B0}'} Free Up More Cash</h3>
            <button className="payoff-toggle" onClick={function() { setExpanded(!expanded); }}>
              {expanded ? 'Show less' : 'Show all'}
            </button>
          </div>
          {savings.slice(0, expanded ? savings.length : 3).map(function(s, i) {
            return (
              <div key={i} className="payoff-saving-row">
                <div className={'payoff-saving-priority ' + s.priority}>
                  {s.priority === 'high' ? '\u{1F534}' : s.priority === 'medium' ? '\u{1F7E1}' : '\u{1F7E2}'}
                </div>
                <div className="payoff-saving-info">
                  <div className="payoff-saving-title">{s.title}</div>
                  <div className="payoff-saving-desc">{s.description}</div>
                  {s.potential_monthly > 0 && (
                    <div className="payoff-saving-amount">Potential: +${s.potential_monthly.toFixed(0)}/mo toward debt</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Income & Capacity Summary (collapsed) */}
      {capacity.monthly_income > 0 && (
        <div className="payoff-capacity">
          <div className="payoff-capacity-row">
            <span>Detected monthly income</span>
            <span className="payoff-cap-val">${capacity.monthly_income.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
          </div>
          <div className="payoff-capacity-row">
            <span>Monthly spending</span>
            <span className="payoff-cap-val">${capacity.monthly_spending.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
          </div>
          <div className="payoff-capacity-row">
            <span>Available surplus</span>
            <span className="payoff-cap-val" style={{color: capacity.monthly_surplus >= 0 ? 'var(--green)' : 'var(--red)'}}>
              {capacity.monthly_surplus >= 0 ? '+' : ''}${capacity.monthly_surplus.toLocaleString(undefined, {maximumFractionDigits: 0})}
            </span>
          </div>
          <div className="payoff-capacity-row payoff-capacity-highlight">
            <span>Recommended debt payment</span>
            <span className="payoff-cap-val" style={{color: 'var(--purple-lighter)'}}>
              ${capacity.total_monthly_payment.toLocaleString(undefined, {maximumFractionDigits: 0})}/mo
            </span>
          </div>
        </div>
      )}
    </div>
  );
}