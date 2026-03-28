const BASE = import.meta.env.PROD
  ? 'https://clavira-backend.onrender.com/api'
  : '/api';

// ═══════════════════════════════════════
// TOKEN MANAGEMENT
// ═══════════════════════════════════════

const TOKEN_KEY = 'clavira_access_token';
const REFRESH_KEY = 'clavira_refresh_token';
const USER_KEY = 'clavira_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setAuth(accessToken, refreshToken, user) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}


// ═══════════════════════════════════════
// HTTP CLIENT
// ═══════════════════════════════════════

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };

  // Add auth header if we have a token (unless explicitly skipped)
  if (options.auth !== false) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  delete options.auth;

  const res = await fetch(`${BASE}${path}`, { headers, ...options });

  // If 401, try refreshing the token once
  if (res.status === 401 && !options._retried) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getToken()}`;
      const retry = await fetch(`${BASE}${path}`, { headers, ...options, _retried: true });
      if (retry.ok) return retry.json();
    }
    // Refresh failed — clear auth and throw
    clearAuth();
    window.dispatchEvent(new Event('clavira:logout'));
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw err;
  }
  return res.json();
}

async function tryRefreshToken() {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setAuth(data.access_token, null, data.user);
    return true;
  } catch {
    return false;
  }
}


// ═══════════════════════════════════════
// API METHODS
// ═══════════════════════════════════════

export const api = {
  health: () => request('/health'),

  // Auth
  register: (email, password, firstName, lastName = '') =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
      auth: false,
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      auth: false,
    }),

  verifyEmail: (token) =>
    request(`/auth/verify?token=${encodeURIComponent(token)}`, { auth: false }),

  resendVerification: (email) =>
    request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
      auth: false,
    }),

  forgotPassword: (email) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      auth: false,
    }),

  resetPassword: (token, password) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
      auth: false,
    }),

  getMe: () => request('/auth/me'),

  updateProfile: (firstName, lastName) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ first_name: firstName, last_name: lastName }),
    }),

  // Simulation
  simulate: (cards, extraMonthly, strategy) =>
    request('/simulate', { method: 'POST', body: JSON.stringify({ cards, extra_monthly: extraMonthly, strategy }) }),

  compare: (cards, extraMonthly, strategy) =>
    request('/simulate/compare', { method: 'POST', body: JSON.stringify({ cards, extra_monthly: extraMonthly, strategy }) }),

  // Waitlist
  joinWaitlist: (email) =>
    request('/waitlist', { method: 'POST', body: JSON.stringify({ email }), auth: false }),

  waitlistCount: () => request('/waitlist/count', { auth: false }),

  // Contact
  submitContact: (data) =>
    request('/contact', { method: 'POST', body: JSON.stringify(data), auth: false }),

  // Pricing
  pricingSignup: (tier, email, name) =>
    request('/pricing/signup', { method: 'POST', body: JSON.stringify({ tier, email, name }) }),

  getPricing: () => request('/pricing', { auth: false }),

  // Chat
  chat: (message, history) =>
    request('/chat', { method: 'POST', body: JSON.stringify({ message, history }) }),

  // Data
  getRewards: () => request('/rewards'),
  getCreditScore: () => request('/credit-score'),
};
