import { useState, useEffect, lazy, Suspense } from 'react';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import { AuthProvider, useAuth } from './components/AuthContext.jsx';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage.jsx'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage.jsx'));
const RewardsPage = lazy(() => import('./pages/RewardsPage.jsx'));
const CreditScorePage = lazy(() => import('./pages/CreditScorePage.jsx'));
const PricingPage = lazy(() => import('./pages/PricingPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.jsx'));
const TermsPage = lazy(() => import('./pages/TermsPage.jsx'));
const Chatbot = lazy(() => import('./components/Chatbot.jsx'));

// Auth pages
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage.jsx'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage.jsx'));

function PageLoader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40, border: '3px solid rgba(124,58,237,0.2)',
          borderTopColor: '#7C3AED', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
        }} />
        <div style={{ color: '#7C749A', fontSize: 13 }}>Loading...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const [page, setPage] = useState('Home');
  const [toast, setToast] = useState({ show: false, message: '' });

  // URL params for verify/reset tokens
  const [verifyToken, setVerifyToken] = useState(null);
  const [resetToken, setResetToken] = useState(null);

  // Check URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verify = params.get('verify');
    const reset = params.get('reset');

    if (verify) {
      setVerifyToken(verify);
      setPage('Verify Email');
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (reset) {
      setResetToken(reset);
      setPage('Reset Password');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3500);
  };

  // Auth-aware page setter (redirect to login if needed)
  const navTo = (p) => {
    // Pages that require auth
    // For now, all pages are accessible — we'll gate specific features later
    setPage(p);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Nav
        page={page}
        setPage={navTo}
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />
      <div key={page} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <Suspense fallback={<PageLoader />}>
          {page === 'Home' && <HomePage setPage={navTo} showToast={showToast} />}
          {page === 'Features' && <FeaturesPage />}
          {page === 'Calculator' && <CalculatorPage />}
          {page === 'Rewards' && <RewardsPage />}
          {page === 'Credit Score' && <CreditScorePage />}
          {page === 'Pricing' && <PricingPage showToast={showToast} />}
          {page === 'Contact' && <ContactPage showToast={showToast} />}
          {page === 'Privacy' && <PrivacyPage />}
          {page === 'Terms' && <TermsPage />}

          {/* Auth pages */}
          {page === 'Login' && <LoginPage setPage={navTo} showToast={showToast} />}
          {page === 'Register' && <RegisterPage setPage={navTo} showToast={showToast} />}
          {page === 'Forgot Password' && <ForgotPasswordPage setPage={navTo} showToast={showToast} />}
          {page === 'Reset Password' && <ResetPasswordPage token={resetToken} setPage={navTo} showToast={showToast} />}
          {page === 'Verify Email' && <VerifyEmailPage token={verifyToken} setPage={navTo} showToast={showToast} />}
        </Suspense>
        <Footer setPage={navTo} />
      </div>
      {page === 'Home' && (
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      )}
      <Toast message={toast.message} show={toast.show} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
