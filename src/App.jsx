import { useState, lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Toast from './components/Toast.jsx';
import { AuthProvider, useAuth } from './components/AuthContext.jsx';

// Visitor pages (marketing)
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage.jsx'));
const PricingPage = lazy(() => import('./pages/PricingPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.jsx'));
const TermsPage = lazy(() => import('./pages/TermsPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage.jsx'));
const FAQPage = lazy(() => import('./pages/FAQPage.jsx'));

// Auth pages
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage.jsx'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage.jsx'));

// App pages (logged in)
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage.jsx'));
const RewardsPage = lazy(() => import('./pages/RewardsPage.jsx'));
const CreditScorePage = lazy(() => import('./pages/CreditScorePage.jsx'));
const ConnectBankPage = lazy(() => import('./pages/ConnectBankPage.jsx'));
const OptimizerPage = lazy(() => import('./pages/OptimizerPage.jsx'));
const Chatbot = lazy(() => import('./components/Chatbot.jsx'));

// Navs
const VisitorNav = lazy(() => import('./components/VisitorNav.jsx'));
const AppNav = lazy(() => import('./components/AppNav.jsx'));

// Footers
const Footer = lazy(() => import('./components/Footer.jsx'));

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
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3500);
  };

  if (authLoading) return <PageLoader />;

  // ═══════════════════════════════════
  // LOGGED IN BUT NOT VERIFIED — FORCE VERIFICATION
  // ═══════════════════════════════════
  if (isAuthenticated && user && !user.is_verified) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <Suspense fallback={<PageLoader />}>
            <VerifyEmailPage navigate={navigate} showToast={showToast} />
          </Suspense>
        </div>
        <Toast message={toast.message} show={toast.show} />
      </div>
    );
  }

  // ═══════════════════════════════════
  // LOGGED IN + VERIFIED — FULL APP
  // ═══════════════════════════════════
  if (isAuthenticated) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Suspense fallback={null}>
          <AppNav navigate={navigate} user={user} logout={logout} currentPath={location.pathname} />
        </Suspense>
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<DashboardPage navigate={navigate} showToast={showToast} />} />
              <Route path="/calculator" element={<CalculatorPage navigate={navigate} />} />
              <Route path="/rewards" element={<RewardsPage navigate={navigate} />} />
              <Route path="/credit-score" element={<CreditScorePage navigate={navigate} />} />
              <Route path="/connect-bank" element={<ConnectBankPage navigate={navigate} showToast={showToast} />} />
              <Route path="/optimizer" element={<OptimizerPage navigate={navigate} />} />
              <Route path="/pricing" element={<PricingPage showToast={showToast} navigate={navigate} />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/blog" element={<BlogPage navigate={navigate} />} />
              <Route path="/blog/two-card-wallet" element={<BlogPostPage navigate={navigate} slug="two-card-wallet" />} />
              <Route path="/blog/thirty-percent-rule" element={<BlogPostPage navigate={navigate} slug="thirty-percent-rule" />} />
              <Route path="/blog/avalanche-vs-snowball" element={<BlogPostPage navigate={navigate} slug="avalanche-vs-snowball" />} />
              <Route path="/blog/transfer-partners-101" element={<BlogPostPage navigate={navigate} slug="transfer-partners-101" />} />
              <Route path="/blog/debt-free-story" element={<BlogPostPage navigate={navigate} slug="debt-free-story" />} />
              <Route path="/blog/how-ai-works" element={<BlogPostPage navigate={navigate} slug="how-ai-works" />} />
              <Route path="/verify-email" element={<VerifyEmailPage navigate={navigate} showToast={showToast} />} />
              {/* Redirect marketing pages to dashboard */}
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/register" element={<Navigate to="/" replace />} />
              <Route path="/features" element={<Navigate to="/" replace />} />
              <Route path="/contact" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
        <Toast message={toast.message} show={toast.show} />
      </div>
    );
  }

  // ═══════════════════════════════════
  // VISITOR — MARKETING EXPERIENCE
  // ═══════════════════════════════════
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Suspense fallback={null}>
        <VisitorNav navigate={navigate} currentPath={location.pathname} />
      </Suspense>
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage navigate={navigate} showToast={showToast} />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage showToast={showToast} navigate={navigate} />} />
            <Route path="/contact" element={<ContactPage showToast={showToast} />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/about" element={<AboutPage navigate={navigate} />} />
            <Route path="/blog" element={<BlogPage navigate={navigate} />} />
            <Route path="/blog/two-card-wallet" element={<BlogPostPage navigate={navigate} slug="two-card-wallet" />} />
            <Route path="/blog/thirty-percent-rule" element={<BlogPostPage navigate={navigate} slug="thirty-percent-rule" />} />
            <Route path="/blog/avalanche-vs-snowball" element={<BlogPostPage navigate={navigate} slug="avalanche-vs-snowball" />} />
            <Route path="/blog/transfer-partners-101" element={<BlogPostPage navigate={navigate} slug="transfer-partners-101" />} />
            <Route path="/blog/debt-free-story" element={<BlogPostPage navigate={navigate} slug="debt-free-story" />} />
            <Route path="/blog/how-ai-works" element={<BlogPostPage navigate={navigate} slug="how-ai-works" />} />
            <Route path="/faq" element={<FAQPage navigate={navigate} />} />
            <Route path="/login" element={<LoginPage navigate={navigate} showToast={showToast} />} />
            <Route path="/register" element={<RegisterPage navigate={navigate} showToast={showToast} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage navigate={navigate} showToast={showToast} />} />
            <Route path="/reset-password" element={<ResetPasswordPage navigate={navigate} showToast={showToast} />} />
            <Route path="/verify-email" element={<VerifyEmailPage navigate={navigate} showToast={showToast} />} />
            {/* Redirect app pages to login */}
            <Route path="/calculator" element={<Navigate to="/login" replace />} />
            <Route path="/rewards" element={<Navigate to="/login" replace />} />
            <Route path="/credit-score" element={<Navigate to="/login" replace />} />
            <Route path="/connect-bank" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Suspense fallback={null}>
          <Footer navigate={navigate} />
        </Suspense>
      </div>
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
