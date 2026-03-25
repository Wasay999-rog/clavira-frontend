const BASE = import.meta.env.PROD
  ? 'https://clavira-backend.onrender.com/api'
  : '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw err;
  }
  return res.json();
}

export const api = {
  health: () => request('/health'),

  simulate: (cards, extraMonthly, strategy) =>
    request('/simulate', { method: 'POST', body: JSON.stringify({ cards, extra_monthly: extraMonthly, strategy }) }),

  compare: (cards, extraMonthly, strategy) =>
    request('/simulate/compare', { method: 'POST', body: JSON.stringify({ cards, extra_monthly: extraMonthly, strategy }) }),

  joinWaitlist: (email) =>
    request('/waitlist', { method: 'POST', body: JSON.stringify({ email }) }),

  waitlistCount: () => request('/waitlist/count'),

  submitContact: (data) =>
    request('/contact', { method: 'POST', body: JSON.stringify(data) }),

  pricingSignup: (tier, email, name) =>
    request('/pricing/signup', { method: 'POST', body: JSON.stringify({ tier, email, name }) }),

  getPricing: () => request('/pricing'),

  chat: (message, history) =>
    request('/chat', { method: 'POST', body: JSON.stringify({ message, history }) }),

  getRewards: () => request('/rewards'),

  getCreditScore: () => request('/credit-score'),
};
