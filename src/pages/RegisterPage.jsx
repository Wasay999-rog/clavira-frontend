import { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import './AuthPages.css';

export default function RegisterPage({ navigate, showToast }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const passwordChecks = [
    { label: '8+ characters', ok: form.password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(form.password) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(form.password) },
    { label: 'Number', ok: /[0-9]/.test(form.password) },
  ];

  const allValid = passwordChecks.every(c => c.ok) && form.password === form.confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!allValid) { setError('Please meet all password requirements'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(form.email, form.password, form.firstName, form.lastName);
      showToast('Account created! Check your email to verify.');
      navigate('/');
    } catch (err) {
      const msg = err.detail;
      if (typeof msg === 'string') setError(msg);
      else if (Array.isArray(msg)) setError(msg.map(e => e.msg || e.message || JSON.stringify(e)).join('. '));
      else setError('Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">C</div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start optimizing your credit today</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-row">
            <div className="auth-field">
              <label>First name</label>
              <input type="text" value={form.firstName} onChange={e => update('firstName', e.target.value)}
                placeholder="Jane" required autoComplete="given-name" />
            </div>
            <div className="auth-field">
              <label>Last name</label>
              <input type="text" value={form.lastName} onChange={e => update('lastName', e.target.value)}
                placeholder="Doe" autoComplete="family-name" />
            </div>
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
              placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <div className="auth-password-wrap">
              <input type={showPassword ? 'text' : 'password'} value={form.password}
                onChange={e => update('password', e.target.value)} placeholder="••••••••"
                required autoComplete="new-password" />
              <button type="button" className="auth-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {form.password && (
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
            <input type="password" value={form.confirm} onChange={e => update('confirm', e.target.value)}
              placeholder="••••••••" required autoComplete="new-password" />
            {form.confirm && form.password !== form.confirm && (
              <span className="auth-field-error">Passwords don't match</span>
            )}
          </div>
          <button type="submit" className="auth-submit" disabled={loading || !allValid}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account?{' '}
          <button className="auth-link-btn" onClick={() => navigate('/login')}>Sign in</button>
        </p>
      </div>
    </div>
  );
}
