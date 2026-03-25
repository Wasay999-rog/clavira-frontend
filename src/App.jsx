import { useState } from 'react';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import Chatbot from './components/Chatbot.jsx';
import HomePage from './pages/HomePage.jsx';
import FeaturesPage from './pages/FeaturesPage.jsx';
import CalculatorPage from './pages/CalculatorPage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import RewardsPage from './pages/RewardsPage.jsx';
import CreditScorePage from './pages/CreditScorePage.jsx';

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
        {page === 'Home' && <HomePage setPage={setPage} showToast={showToast} />}
        {page === 'Features' && <FeaturesPage />}
        {page === 'Calculator' && <CalculatorPage />}
        {page === 'Rewards' && <RewardsPage />}
        {page === 'Credit Score' && <CreditScorePage />}
        {page === 'Pricing' && <PricingPage showToast={showToast} />}
        {page === 'Contact' && <ContactPage showToast={showToast} />}
        <Footer />
      </div>
      {page === 'Home' && <Chatbot />}
      <Toast message={toast.message} show={toast.show} />
    </div>
  );
}
