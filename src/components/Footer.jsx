import './Footer.css';

export default function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-brand-col">
          <div className="footer-logo" onClick={() => navigate('/')}>
            <div className="footer-logo-icon">C</div>
            <span className="footer-logo-text">Clavira</span>
          </div>
          <p className="footer-tagline">
            AI-powered credit card optimization. Pay off debt faster, maximize rewards, and improve your credit score.
          </p>
          <div className="footer-badges">
            <div className="footer-badge">🔒 Bank-level Security</div>
            <div className="footer-badge">🚫 No Ads Ever</div>
          </div>
        </div>

        {/* Product */}
        <div className="footer-col">
          <h4 className="footer-col-title">Product</h4>
          <button onClick={() => navigate('/features')} className="footer-link">Features</button>
          <button onClick={() => navigate('/pricing')} className="footer-link">Pricing</button>
          <button onClick={() => navigate('/calculator')} className="footer-link">Debt Calculator</button>
          <div className="footer-link-coming">
            <span>Mobile App</span>
            <span className="coming-badge">Soon</span>
          </div>
          <div className="footer-link-coming">
            <span>API Access</span>
            <span className="coming-badge">Soon</span>
          </div>
        </div>

        {/* Learn */}
        <div className="footer-col">
          <h4 className="footer-col-title">Learn</h4>
          <button onClick={() => navigate('/blog')} className="footer-link">Blog</button>
          <button onClick={() => navigate('/faq')} className="footer-link">FAQ</button>
          <button onClick={() => navigate('/about')} className="footer-link">About Us</button>
          <div className="footer-link-coming">
            <span>Guides</span>
            <span className="coming-badge">Soon</span>
          </div>
          <div className="footer-link-coming">
            <span>Newsletter</span>
            <span className="coming-badge">Soon</span>
          </div>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h4 className="footer-col-title">Company</h4>
          <button onClick={() => navigate('/contact')} className="footer-link">Contact</button>
          <button onClick={() => navigate('/privacy')} className="footer-link">Privacy Policy</button>
          <button onClick={() => navigate('/terms')} className="footer-link">Terms of Service</button>
          <a href="mailto:hello@clavirafinance.com" className="footer-link">hello@clavirafinance.com</a>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <span className="footer-copyright">© 2026 Clavira Finance. All rights reserved.</span>
        <div className="footer-bottom-links">
          <button onClick={() => navigate('/privacy')} className="footer-bottom-link">Privacy</button>
          <span className="footer-dot">·</span>
          <button onClick={() => navigate('/terms')} className="footer-bottom-link">Terms</button>
          <span className="footer-dot">·</span>
          <button onClick={() => navigate('/contact')} className="footer-bottom-link">Contact</button>
        </div>
      </div>
    </footer>
  );
}