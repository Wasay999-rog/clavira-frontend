import { useState, lazy, Suspense } from 'react';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';

// Lazy load pages — only loads when user navigates to them
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

export default function App() {
  const [page, setPage] = useState('Home');
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3500);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Nav page={page} setPage={setPage} />
      <div key={page} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <Suspense fallback={<PageLoader />}>
          {page === 'Home' && <HomePage setPage={setPage} showToast={showToast} />}
          {page === 'Features' && <FeaturesPage />}
          {page === 'Calculator' && <CalculatorPage />}
          {page === 'Rewards' && <RewardsPage />}
          {page === 'Credit Score' && <CreditScorePage />}
          {page === 'Pricing' && <PricingPage showToast={showToast} />}
          {page === 'Contact' && <ContactPage showToast={showToast} />}
          {page === 'Privacy' && <PrivacyPage />}
          {page === 'Terms' && <TermsPage />}
        </Suspense>
        <Footer setPage={setPage} />
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
