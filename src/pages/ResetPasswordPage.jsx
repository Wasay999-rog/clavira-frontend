import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import './AuthPages.css';

export default function ResetPasswordPage({ navigate, showToast }) {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordChecks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase', ok: /[a-z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
  ];
  const allValid = passwordChecks.every(c => c.ok) && password === confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allValid) return;
    setError('');
    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setSuccess(true);
      showToast('Password reset successfully!');
    } catch (err) {
      setError(err.detail || 'Reset failed. The link may have expired.');
    } finally { setLoading(false); }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">C</div>
          <h1 className="auth-title">Invalid link</h1>
          <p className="auth-subtitle" style={{ marginBottom: 24 }}>No reset token found. Please request a new reset link.</p>
          <button className="auth-submit" onClick={() => navigate('/forgot-password')}>Request Reset</button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">C</div>
          <div className="auth-success-icon">✓</div>
          <h1 className="auth-title">Password reset!</h1>
          <p className="auth-subtitle" style={{ marginBottom: 24 }}>You can now sign in with your new password.</p>
          <button className="auth-submit" onClick={() => navigate('/login')}>Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">C</div>
        <h1 className="auth-title">Choose a new password</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-field">
            <label>New password</label>
            <div className="auth-password-wrap">
              <input type={showPassword ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                required autoComplete="new-password" />
              <button type="button" className="auth-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {password && (
              <div className="auth-pw-checks">
                {passwordChecks.map(c => (
                  <span key={c.label} className={c.ok ? 'check-ok' : 'check-fail'}>
                    {c.ok ? '✓' : '○'} {c.label}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="auth-field">
            <label>Confirm password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••" required autoComplete="new-password" />
            {confirm && password !== confirm && <span className="auth-field-error">Passwords don't match</span>}
          </div>
          <button type="submit" className="auth-submit" disabled={loading || !allValid}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
