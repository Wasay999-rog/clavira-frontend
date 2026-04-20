const BASE = import.meta.env.PROD
  ? 'https://clavira-backend.onrender.com/api'
  : '/api';

export function setAuth(accessToken, refreshToken, user) {
  if (accessToken) localStorage.setItem('clavira_access_token', accessToken);
  if (refreshToken) localStorage.setItem('clavira_refresh_token', refreshToken);
  if (user) localStorage.setItem('clavira_user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('clavira_access_token');
  localStorage.removeItem('clavira_refresh_token');
  localStorage.removeItem('clavira_user');
}

export function getUser() {
  try {
    const u = localStorage.getItem('clavira_user');
    return u ? JSON.parse(u) : null;
  } catch (e) { return null; }
}

export function isLoggedIn() {
  return !!localStorage.getItem('clavira_access_token');
}

function getToken() {
  return localStorage.getItem('clavira_access_token') || '';
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  const res = await fetch(BASE + path, { ...options, headers });
  if (res.status === 401) {
    const refreshToken = localStorage.getItem('clavira_refresh_token');
    if (refreshToken) {
      try {
        const refreshRes = await fetch(BASE + '/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          localStorage.setItem('clavira_access_token', data.access_token);
          headers['Authorization'] = 'Bearer ' + data.access_token;
          const retryRes = await fetch(BASE + path, { ...options, headers });
          if (!retryRes.ok) {
            const err = await retryRes.json().catch(function() { return { detail: 'Request failed' }; });
            throw err;
          }
          return retryRes.json();
        }
      } catch (e) {
        clearAuth();
        window.dispatchEvent(new Event('clavira:logout'));
      }
    }
  }
  if (!res.ok) {
    const err = await res.json().catch(function() { return { detail: 'Request failed' }; });
    throw err;
  }
  return res.json();
}

export const api = {
  health: function() { return request('/health'); },
  register: function(email, password, first_name, last_name) {
    return request('/auth/register', { method: 'POST', body: JSON.stringify({ email: email, password: password, first_name: first_name, last_name: last_name }) });
  },
  login: function(email, password) {
    return request('/auth/login', { method: 'POST', body: JSON.stringify({ email: email, password: password }) });
  },
  verifyCode: function(email, code) {
    return request('/auth/verify-code', { method: 'POST', body: JSON.stringify({ email: email, code: code }) });
  },
  resendVerification: function(email) {
    return request('/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email: email }) });
  },
  getMe: function() { return request('/auth/me'); },
  simulate: function(cards, extraMonthly, strategy) {
    return request('/simulate', { method: 'POST', body: JSON.stringify({ cards: cards, extra_monthly: extraMonthly, strategy: strategy }) });
  },
  compare: function(cards, extraMonthly, strategy) {
    return request('/simulate/compare', { method: 'POST', body: JSON.stringify({ cards: cards, extra_monthly: extraMonthly, strategy: strategy }) });
  },
  joinWaitlist: function(email) {
    return request('/waitlist', { method: 'POST', body: JSON.stringify({ email: email }) });
  },
  waitlistCount: function() { return request('/waitlist/count'); },
  submitContact: function(data) {
    return request('/contact', { method: 'POST', body: JSON.stringify(data) });
  },
  pricingSignup: function(tier, email, name) {
    return request('/pricing/signup', { method: 'POST', body: JSON.stringify({ tier: tier, email: email, name: name }) });
  },
  getPricing: function() { return request('/pricing'); },
  chat: function(message, history) {
    return request('/chat', { method: 'POST', body: JSON.stringify({ message: message, history: history }) });
  },
  getRewards: function() { return request('/rewards'); },
  getCreditScore: function() { return request('/credit-score'); },
  getPayoffStrategy: function() { return request('/payoff-strategy'); },
  createLinkToken: function() { return request('/plaid/create-link-token', { method: 'POST' }); },
  exchangeToken: function(public_token, institution_name) {
    return request('/plaid/exchange-token', { method: 'POST', body: JSON.stringify({ public_token: public_token, institution_name: institution_name }) });
  },
  getAccounts: function() { return request('/plaid/accounts'); },
  getTransactions: function() { return request('/plaid/transactions'); },
  syncAccounts: function() { return request('/plaid/sync', { method: 'POST' }); },
  disconnectAccount: function(accountId) {
    return request('/plaid/accounts/' + accountId, { method: 'DELETE' });
  },
getOptimizer: function() { return request('/cards/optimize'); },
createCheckout: function(tier, coupon_code) {
  return request('/stripe/create-checkout', {
    method: 'POST',
    body: JSON.stringify({ tier, coupon_code })
  });
},
getSubscription: function() { return request('/stripe/subscription'); },
getPortal: function() { return request('/stripe/portal'); },
updateProfile: function(first_name, last_name) {
  return request('/auth/profile', { method: 'PUT', body: JSON.stringify({ first_name, last_name }) });
},
changePassword: function(current_password, new_password) {
  return request('/auth/change-password', { method: 'POST', body: JSON.stringify({ current_password, new_password }) });
},
deleteAccount: function() {
  return request('/auth/delete-account', { method: 'DELETE' });
},
};