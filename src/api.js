const BASE = import.meta.env.PROD
  ? 'https://clavira-backend.onrender.com/api'
  : '/api';

function getToken() {
  return localStorage.getItem('clavira_access_token') || '';
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    // Try refresh
    const refreshToken = localStorage.getItem('clavira_refresh_token');
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          localStorage.setItem('clavira_access_token', data.access_token);
          // Retry original request with new token
          headers['Authorization'] = `Bearer ${data.access_token}`;
          const retryRes = await fetch(`${BASE}${path}`, { ...options, headers });
          if (!retryRes.ok) {
            const err = await retryRes.json().catch(() => ({ detail: 'Request failed' }));
            throw err;
          }
          return retryRes.json();
        }
      } catch {
        // Refresh failed — clear tokens
        localStorage.removeItem('clavira_access_token');
        localStorage.removeItem('clavira_refresh_token');
      }
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw err;
  }
  return res.json();
}

export const api = {
  health: () => request('/health'),

  // Auth
  register: (email, password, first_name, last_name) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, first_name, last_name }),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  verifyCode: (email, code) =>
    request('/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    }),

  resendVerification: (email) =>
    request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  getMe: () => request('/auth/me'),

  // Simulation
  simulate: (cards, extraMonthly, strategy) =>
    request('/simulate', { method: 'POST', body: JSON.stringify({ cards, extra_monthly: extraMonthly, strategy }) }),

  compare: (cards, extraMonthly, strategy) =>
    request('/simulate/compare', { method: 'POST', body: JSON.stringify({ cards, extra_monthly: extraMonthly, strategy }) }),

  // Waitlist
  joinWaitlist: (email) =>
    request('/waitlist', { method: 'POST', body: JSON.stringify({ email }) }),

  waitlistCount: () => request('/waitlist/count'),

  // Contact
  submitContact: (data) =>
    request('/contact', { method: 'POST', body: JSON.stringify(data) }),

  // Pricing
  pricingSignup: (tier, email, name) =>
    request('/pricing/signup', { method: 'POST', body: JSON.stringify({ tier, email, name }) }),

  getPricing: () => request('/pricing'),

  // AI Chat
  chat: (message, history) =>
    request('/chat', { method: 'POST', body: JSON.stringify({ message, history }) }),

  // Rewards & Credit Score (now require auth — real data)
  getRewards: () => request('/rewards'),
  getCreditScore: () => request('/credit-score'),

  // Plaid
  createLinkToken: () => request('/plaid/create-link-token', { method: 'POST' }),
  exchangeToken: (public_token, institution_name) =>
    request('/plaid/exchange-token', {
      method: 'POST',
      body: JSON.stringify({ public_token, institution_name }),
    }),
  getAccounts: () => request('/plaid/accounts'),
  getTransactions: () => request('/plaid/transactions'),
  disconnectAccount: (accountId) =>
    request(`/plaid/accounts/${accountId}`, { method: 'DELETE' }),
};