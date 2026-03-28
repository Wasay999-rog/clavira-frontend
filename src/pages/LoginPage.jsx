import { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import './AuthPages.css';

export default function LoginPage({ navigate, showToast }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back!');
      navigate('/');
    } catch (err) {
      setError(err.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">C</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your Clavira account</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <div className="auth-password-wrap">
              <input type={showPassword ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                required autoComplete="current-password" />
              <button type="button" className="auth-toggle-pw"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <button type="button" className="auth-link-btn"
            onClick={() => navigate('/forgot-password')}
            style={{ alignSelf: 'flex-end', marginTop: -8, marginBottom: 8 }}>
            Forgot password?
          </button>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account?{' '}
          <button className="auth-link-btn" onClick={() => navigate('/register')}>Create one</button>
        </p>
      </div>
    </div>
  );
}
