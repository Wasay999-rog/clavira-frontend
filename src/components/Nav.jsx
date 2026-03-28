import { useState } from 'react';
import './Nav.css';

const NAV_LINKS = ['Home', 'Features', 'Calculator', 'Rewards', 'Credit Score', 'Pricing', 'Contact'];

export default function Nav({ page, setPage, user, isAuthenticated, logout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleNav = (p) => {
    setPage(p);
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setPage('Home');
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="nav-brand" onClick={() => handleNav('Home')}>
          <div className="nav-logo">C</div>
          <span className="nav-name">Clavira</span>
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map(link => (
            <button
              key={link}
              className={`nav-link ${page === link ? 'active' : ''}`}
              onClick={() => handleNav(link)}
            >
              {link}
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
                <button className="nav-link" onClick={() => handleNav('Login')}>Sign In</button>
                <button className="nav-cta-mobile" onClick={() => handleNav('Register')}>Get Started</button>
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
                    {!user?.is_verified && (
                      <div className="nav-dropdown-badge">Email not verified</div>
                    )}
                  </div>
                  <div className="nav-dropdown-divider" />
                  <button className="nav-dropdown-item" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="nav-signin" onClick={() => handleNav('Login')}>Sign In</button>
              <button className="nav-cta" onClick={() => handleNav('Register')}>Get Started</button>
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
