import './Footer.css';

export default function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="footer-left">
        <span className="footer-brand" onClick={() => navigate('/')}>© 2026 Clavira Finance</span>
      </div>
      <div className="footer-links">
        <button onClick={() => navigate('/privacy')}>Privacy</button>
        <button onClick={() => navigate('/terms')}>Terms</button>
        <button onClick={() => navigate('/contact')}>Contact</button>
      </div>
    </footer>
  );
}
