import { useState } from 'react';
import './Nav.css';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Features', path: '/features' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Contact', path: '/contact' },
];

export default function VisitorNav({ navigate, currentPath }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (path) => { navigate(path); setMenuOpen(false); };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="nav-brand" onClick={() => handleNav('/')}>
          <div className="nav-logo">C</div>
          <span className="nav-name">Clavira</span>
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map(link => (
            <button key={link.path}
              className={`nav-link ${currentPath === link.path ? 'active' : ''}`}
              onClick={() => handleNav(link.path)}>
              {link.label}
            </button>
          ))}
          <div className="nav-auth-mobile">
            <button className="nav-link" onClick={() => handleNav('/login')}>Sign In</button>
            <button className="nav-cta-mobile" onClick={() => handleNav('/register')}>Get Started Free</button>
          </div>
        </div>

        <div className="nav-auth">
          <button className="nav-signin" onClick={() => handleNav('/login')}>Sign In</button>
          <button className="nav-cta" onClick={() => handleNav('/register')}>Get Started Free</button>
        </div>

        <button className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}