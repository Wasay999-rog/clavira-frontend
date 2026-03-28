import './Footer.css';

export default function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <div className="footer-icon">C</div>
        <span>Clavira Finance</span>
      </div>
      <div className="footer-links">
        <button className="footer-link" onClick={() => setPage('Privacy')}>Privacy Policy</button>
        <span className="footer-dot">&middot;</span>
        <button className="footer-link" onClick={() => setPage('Terms')}>Terms of Service</button>
      </div>
      <span className="footer-copy">&copy; 2026 Clavira Finance, Inc. All rights reserved.</span>
    </footer>
  );
}
