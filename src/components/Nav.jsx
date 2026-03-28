import { useState } from 'react';
import './Nav.css';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Features', path: '/features' },
  { label: 'Calculator', path: '/calculator' },
  { label: 'Rewards', path: '/rewards' },
  { label: 'Credit Score', path: '/credit-score' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Contact', path: '/contact' },
];

export default function Nav({ navigate, user, isAuthenticated, logout, currentPath }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="nav-brand" onClick={() => handleNav('/')}>
          <div className="nav-logo">C</div>
          <span className="nav-name">Clavira</span>
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map(link => (
            <button
              key={link.path}
              className={`nav-link ${currentPath === link.path ? 'active' : ''}`}
              onClick={() => handleNav(link.path)}
            >
              {link.label}
            </button>
          ))}

          {/* Auth buttons inside mobile menu */}
          <div className="nav-auth-mobile">
            {isAuthenticated ? (
              <>
                <span className="nav-user-greeting">Hi, {user?.first_name || 'User'}</span>
                <button className="nav-link" onClick={handleLogout}>Sign Out</button>
              </>
            ) : (
              <>
                <button className="nav-link" onClick={() => handleNav('/login')}>Sign In</button>
                <button className="nav-cta-mobile" onClick={() => handleNav('/register')}>Get Started</button>
              </>
            )}
          </div>
        </div>

        {/* Desktop auth */}
        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="nav-user-menu-wrap">
              <button
                className="nav-user-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="nav-avatar">{(user?.first_name?.[0] || 'U').toUpperCase()}</span>
                <span className="nav-user-name">{user?.first_name || 'User'}</span>
                <span className="nav-chevron">▾</span>
              </button>
              {userMenuOpen && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <div className="nav-dropdown-name">{user?.first_name} {user?.last_name}</div>
                    <div className="nav-dropdown-email">{user?.email}</div>
                    <div className="nav-dropdown-tier">{user?.tier || 'Free'} Plan</div>
                    {!user?.is_verified && (
                      <div className="nav-dropdown-badge">Email not verified</div>
                    )}
                  </div>
                  <div className="nav-dropdown-divider" />
                  <button className="nav-dropdown-item" onClick={() => handleNav('/connect-bank')}>
                    🏦 Connect Bank
                  </button>
                  <button className="nav-dropdown-item" onClick={() => handleNav('/pricing')}>
                    ⭐ Upgrade Plan
                  </button>
                  <div className="nav-dropdown-divider" />
                  <button className="nav-dropdown-item" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="nav-signin" onClick={() => handleNav('/login')}>Sign In</button>
              <button className="nav-cta" onClick={() => handleNav('/register')}>Get Started</button>
            </>
          )}
        </div>

        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
