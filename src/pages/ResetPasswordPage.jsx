import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { api } from '../api';
import './AuthPages.css';

export default function RegisterPage({ navigate, showToast }) {
  var { register, refreshUser } = useAuth();
  var [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  var [error, setError] = useState('');
  var [loading, setLoading] = useState(false);
  var [showPassword, setShowPassword] = useState(false);

  // Verification state
  var [step, setStep] = useState('register'); // 'register' or 'verify'
  var [code, setCode] = useState(['', '', '', '', '', '']);
  var [verifying, setVerifying] = useState(false);
  var [verifyError, setVerifyError] = useState('');
  var [resendCooldown, setResendCooldown] = useState(0);
  var inputRefs = useRef([]);

  function update(field, val) {
    setForm(function(f) { return Object.assign({}, f, { [field]: val }); });
  }

  var passwordChecks = [
    { label: '8+ characters', ok: form.password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(form.password) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(form.password) },
    { label: 'Number', ok: /[0-9]/.test(form.password) },
  ];

  var allValid = passwordChecks.every(function(c) { return c.ok; }) && form.password === form.confirm;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!allValid) { setError('Please meet all password requirements'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(form.email, form.password, form.firstName, form.lastName);
      showToast('Account created! Enter the 6-digit code sent to your email.');
      setStep('verify');
      setResendCooldown(60);
    } catch (err) {
      var msg = err.detail;
      if (typeof msg === 'string') setError(msg);
      else if (Array.isArray(msg)) setError(msg.map(function(e) { return e.msg || e.message || JSON.stringify(e); }).join('. '));
      else setError('Registration failed. Please try again.');
    } finally { setLoading(false); }
  }

  // Code input handlers
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

  // Submit verification code
  async function handleVerify() {
    var fullCode = code.join('');
    if (fullCode.length !== 6) return;
    setVerifying(true);
    setVerifyError('');
    try {
      var data = await api.verifyCode(form.email, fullCode);
      if (data.success) {
        refreshUser();
        showToast('Email verified! Welcome to Clavira.');
        navigate('/');
      }
    } catch (err) {
      setVerifyError(err.detail || 'Invalid code. Please try again.');
      setCode(['', '', '', '', '', '']);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    }
    setVerifying(false);
  }

  // Auto-submit when all 6 digits entered
  useEffect(function() {
    if (step === 'verify' && code.every(function(d) { return d !== ''; })) {
      handleVerify();
    }
  }, [code, step]);

  // Resend code
  async function handleResend() {
    if (resendCooldown > 0) return;
    try {
      await api.resendVerification(form.email);
      showToast('New verification code sent!');
      setResendCooldown(60);
    } catch (err) {
      showToast(err.detail || 'Could not resend code.');
    }
  }

  // Cooldown timer
  useEffect(function() {
    if (resendCooldown <= 0) return;
    var timer = setTimeout(function() {
      setResendCooldown(resendCooldown - 1);
    }, 1000);
    return function() { clearTimeout(timer); };
  }, [resendCooldown]);

  // ── VERIFY STEP ──
  if (step === 'verify') {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">C</div>
          <h1 className="auth-title">Verify your email</h1>
          <p className="auth-subtitle">
            We sent a 6-digit code to <strong>{form.email}</strong>
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
                  disabled={verifying}
                  autoFocus={i === 0}
                />
              );
            })}
          </div>

          {verifyError && <p className="auth-error">{verifyError}</p>}

          <button
            className="auth-submit"
            onClick={handleVerify}
            disabled={verifying || code.some(function(d) { return d === ''; })}
          >
            {verifying ? 'Verifying...' : 'Verify Email'}
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


        </div>
      </div>
    );
  }

  // ── REGISTER STEP ──
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
              <input type="text" value={form.firstName} onChange={function(e) { update('firstName', e.target.value); }}
                placeholder="Jane" required autoComplete="given-name" />
            </div>
            <div className="auth-field">
              <label>Last name</label>
              <input type="text" value={form.lastName} onChange={function(e) { update('lastName', e.target.value); }}
                placeholder="Doe" autoComplete="family-name" />
            </div>
          </div>
          <div className="auth-field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={function(e) { update('email', e.target.value); }}
              placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <div className="auth-password-wrap">
              <input type={showPassword ? 'text' : 'password'} value={form.password}
                onChange={function(e) { update('password', e.target.value); }} placeholder="••••••••"
                required autoComplete="new-password" />
              <button type="button" className="auth-toggle-pw"
                onClick={function() { setShowPassword(!showPassword); }}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {form.password && (
              <div className="auth-pw-checks">
                {passwordChecks.map(function(c) {
                  return (
                    <span key={c.label} className={c.ok ? 'check-ok' : 'check-fail'}>
                      {c.ok ? '\u2713' : '\u25CB'} {c.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <div className="auth-field">
            <label>Confirm password</label>
            <input type="password" value={form.confirm} onChange={function(e) { update('confirm', e.target.value); }}
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
          <button className="auth-link-btn" onClick={function() { navigate('/login'); }}>Sign in</button>
        </p>
      </div>
    </div>
  );
}