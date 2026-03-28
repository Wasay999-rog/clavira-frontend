import { useState, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import { AuthProvider, useAuth } from './components/AuthContext.jsx';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
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

// Plaid
const ConnectBankPage = lazy(() => import('./pages/ConnectBankPage.jsx'));

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

// Protected route wrapper
function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// Smart home: dashboard if logged in, landing if not
function SmartHome({ showToast }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) return <PageLoader />;
  if (isAuthenticated) return <DashboardPage navigate={navigate} showToast={showToast} />;
  return <HomePage navigate={navigate} showToast={showToast} />;
}

function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3500);
  };

  const showChatbot = ['/', '/dashboard'].includes(location.pathname);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Nav
        navigate={navigate}
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
        currentPath={location.pathname}
      />
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<SmartHome showToast={showToast} />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/rewards" element={<RewardsPage navigate={navigate} />} />
            <Route path="/credit-score" element={<CreditScorePage navigate={navigate} />} />
            <Route path="/pricing" element={<PricingPage showToast={showToast} navigate={navigate} />} />
            <Route path="/contact" element={<ContactPage showToast={showToast} />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage navigate={navigate} showToast={showToast} />} />
            <Route path="/register" element={<RegisterPage navigate={navigate} showToast={showToast} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage navigate={navigate} showToast={showToast} />} />
            <Route path="/reset-password" element={<ResetPasswordPage navigate={navigate} showToast={showToast} />} />
            <Route path="/verify-email" element={<VerifyEmailPage navigate={navigate} showToast={showToast} />} />

            {/* Protected */}
            <Route path="/connect-bank" element={
              <RequireAuth><ConnectBankPage navigate={navigate} showToast={showToast} /></RequireAuth>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Footer navigate={navigate} />
      </div>
      {showChatbot && (
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
