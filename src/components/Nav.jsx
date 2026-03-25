import { useState } from 'react';
import './Nav.css';

const links = ['Home', 'Features', 'Calculator', 'Rewards', 'Credit Score', 'Pricing', 'Contact'];

export default function Nav({ page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (p) => { setPage(p); setMenuOpen(false); };

  return (
    <>
      <nav className="nav">
        <div className="nav-logo" onClick={() => go('Home')}>
          <div className="nav-logo-icon">C</div>
          <span className="nav-logo-text">Clavira</span>
        </div>
        <div className="nav-links">
          {links.map(l => (
            <button key={l} className={`nav-link ${page === l ? 'active' : ''}`} onClick={() => go(l)}>{l}</button>
          ))}
        </div>
        <button className="nav-cta desktop-only" onClick={() => go('Home')}>Early Access</button>
        <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>
      {menuOpen && (
        <div className="mobile-menu">
          {links.map(l => (
            <button key={l} className={`mobile-link ${page === l ? 'active' : ''}`} onClick={() => go(l)}>{l}</button>
          ))}
          <button className="mobile-cta" onClick={() => go('Home')}>Early Access</button>
        </div>
      )}
    </>
  );
}
