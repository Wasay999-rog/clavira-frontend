import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../components/AuthContext';
import './AuthPages.css';

export default function VerifyEmailPage({ navigate, showToast }) {
  var [searchParams] = useSearchParams();
  var token = searchParams.get('token');
  var { user, refreshUser } = useAuth();
  var [status, setStatus] = useState(token ? 'verifying' : 'input');
  var [error, setError] = useState('');
  var [code, setCode] = useState(['', '', '', '', '', '']);
  var [submitting, setSubmitting] = useState(false);
  var [resendCooldown, setResendCooldown] = useState(0);
  var inputRefs = useRef([]);

  useEffect(function() {
    if (!token) return;
    fetch(
      (import.meta.env.PROD ? 'https://clavira-backend.onrender.com/api' : '/api') +
      '/auth/verify?token=' + token
    ).then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.success) {
          setStatus('success');
          refreshUser();
          showToast('Email verified!');
        } else {
          setStatus('error');
          setError(data.detail || 'Verification failed.');
        }
      })
      .catch(function() {
        setStatus('error');
        setError('Verification failed. Please try again.');
      });
  }, [token]);

  function handleCodeChange(index, value) {
    if (!/^\d*$/.test(value)) return;
    var newCode = code.slice();
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    var pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      inputRefs.current[5].focus();
    }
  }

  async function handleSubmit() {
    var fullCode = code.join('');
    if (fullCode.length !== 6) return;
    setSubmitting(true);
    setError('');
    try {
      var email = user ? user.email : '';
      if (!email) {
        setError('Please log in first to verify your email.');
        setSubmitting(false);
        return;
      }
      var data = await api.verifyCode(email, fullCode);
      if (data.success) {
        setStatus('success');
        refreshUser();
        showToast('Email verified!');
      }
    } catch (err) {
      setError(err.detail || 'Invalid code. Please try again.');
      setCode(['', '', '', '', '', '']);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    }
    setSubmitting(false);
  }

  useEffect(function() {
    if (code.every(function(d) { return d !== ''; }) && status === 'input') {
      handleSubmit();
    }
  }, [code]);

  async function handleResend() {
    if (resendCooldown > 0 || !user) return;
    try {
      await api.resendVerification(user.email);
      showToast('New verification code sent to your email!');
      setResendCooldown(60);
    } catch (err) {
      showToast(err.detail || 'Could not resend code.');
    }
  }

  useEffect(function() {
    if (resendCooldown <= 0) return;
    var timer = setTimeout(function() {
      setResendCooldown(resendCooldown - 1);
    }, 1000);
    return function() { clearTimeout(timer); };
  }, [resendCooldown]);

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

        {status === 'input' && (
          <>
            <h1 className="auth-title">Enter verification code</h1>
            <p className="auth-subtitle">
              We sent a 6-digit code to <strong>{user ? user.email : 'your email'}</strong>
            </p>

            <div className="verify-code-inputs" onPaste={handlePaste}>
              {code.map(function(digit, i) {
                return (
                  <input
                    key={i}
                    ref={function(el) { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={function(e) { handleCodeChange(i, e.target.value); }}
                    onKeyDown={function(e) { handleKeyDown(i, e); }}
                    className="verify-code-digit"
                    disabled={submitting}
                    autoFocus={i === 0}
                  />
                );
              })}
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button
              className="auth-submit"
              onClick={handleSubmit}
              disabled={submitting || code.some(function(d) { return d === ''; })}
            >
              {submitting ? 'Verifying...' : 'Verify Email'}
            </button>

            <div className="verify-resend">
              <span className="verify-resend-text">Didn't get the code?</span>
              <button
                className="verify-resend-btn"
                onClick={handleResend}
                disabled={resendCooldown > 0}
              >
                {resendCooldown > 0
                  ? 'Resend in ' + resendCooldown + 's'
                  : 'Resend Code'}
              </button>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="auth-success-icon">✓</div>
            <h1 className="auth-title">Email verified!</h1>
            <p className="auth-subtitle" style={{ marginBottom: 24 }}>Your account is fully activated.</p>
            <button className="auth-submit" onClick={function() { navigate('/'); }}>Go to Dashboard</button>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="auth-title">Verification failed</h1>
            <p className="auth-subtitle" style={{ marginBottom: 24 }}>{error}</p>
            <button className="auth-submit" onClick={function() { setStatus('input'); setError(''); setCode(['','','','','','']); }}>
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}