import { useState } from 'react';
import { api } from '../api';
import './AuthPages.css';

export default function ForgotPasswordPage({ navigate, showToast }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.detail || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">C</div>
          <h1 className="auth-title">Check your email</h1>
          <p className="auth-subtitle" style={{ marginBottom: 24 }}>
            If an account exists for <strong>{email}</strong>, we've sent a password reset link. The link expires in 1 hour.
          </p>
          <button className="auth-submit" onClick={() => navigate('/login')}>Back to Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">C</div>
        <h1 className="auth-title">Reset your password</h1>
        <p className="auth-subtitle">Enter your email and we'll send you a reset link.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required autoComplete="email" />
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="auth-switch">
          Remember your password?{' '}
          <button className="auth-link-btn" onClick={() => navigate('/login')}>Sign in</button>
        </p>
      </div>
    </div>
  );
}
