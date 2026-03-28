import { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../components/AuthContext';
import './AuthPages.css';

export default function VerifyEmailPage({ token, setPage, showToast }) {
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('No verification token provided.');
      return;
    }

    api.verifyEmail(token)
      .then(() => {
        setStatus('success');
        refreshUser();
        showToast('Email verified successfully!');
      })
      .catch(err => {
        setStatus('error');
        setError(err.detail || 'Verification failed. The link may have expired.');
      });
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">C</div>

        {status === 'verifying' && (
          <>
            <h1 className="auth-title">Verifying your email...</h1>
            <div className="auth-spinner" />
          </>
        )}

        {status === 'success' && (
          <>
            <div className="auth-success-icon">✓</div>
            <h1 className="auth-title">Email verified!</h1>
            <p className="auth-subtitle" style={{ marginBottom: 24 }}>
              Your account is now fully activated. You have access to all Clavira features.
            </p>
            <button className="auth-submit" onClick={() => setPage('Home')}>
              Go to Dashboard
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="auth-title">Verification failed</h1>
            <p className="auth-subtitle" style={{ marginBottom: 24 }}>{error}</p>
            <button className="auth-submit" onClick={() => setPage('Home')}>
              Go Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
