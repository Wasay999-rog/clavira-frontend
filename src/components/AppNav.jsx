import { useState } from 'react';
import './AppNav.css';

export default function AppNav({ navigate, user, logout, currentPath }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPremium = user?.tier === 'premium' || user?.tier === 'business';
  const isBusiness = user?.tier === 'business';

  const NAV_ITEMS = [
    { icon: '📊', label: 'Dashboard', path: '/' },
    { icon: '💳', label: 'Calculator', path: '/calculator' },
    { icon: '🏆', label: 'Rewards', path: '/rewards' },
    { icon: '📈', label: 'Credit Score', path: '/credit-score' },
    { icon: '🏦', label: 'Accounts', path: '/connect-bank' },
  ];

  const handleNav = (path) => { navigate(path); setMobileOpen(false); setUserMenuOpen(false); };
  const handleLogout = () => { logout(); navigate('/'); };

  const tierLabel = user?.tier === 'business' ? 'Business' : user?.tier === 'premium' ? 'Premium' : 'Free';
  const tierColor = isBusiness ? 'var(--blue)' : isPremium ? 'var(--gold)' : 'var(--muted)';

  return (
    <nav className="app-nav">
      <div className="app-nav-inner">
        {/* Logo */}
        <button className="app-nav-brand" onClick={() => handleNav('/')}>
          <div className="app-nav-logo">C</div>
          <span className="app-nav-name">Clavira</span>
        </button>

        {/* Desktop nav items */}
        <div className={`app-nav-links ${mobileOpen ? 'open' : ''}`}>
          {NAV_ITEMS.map(item => (
            <button key={item.path}
              className={`app-nav-item ${currentPath === item.path ? 'active' : ''}`}
              onClick={() => handleNav(item.path)}>
              <span className="app-nav-item-icon">{item.icon}</span>
              <span className="app-nav-item-label">{item.label}</span>
            </button>
          ))}

          {/* Mobile user section */}
          <div className="app-nav-mobile-user">
            <div className="app-nav-mobile-info">
              <span>{user?.first_name} {user?.last_name}</span>
              <span className="app-nav-mobile-tier" style={{ color: tierColor }}>{tierLabel}</span>
            </div>
            {!isPremium && (
              <button className="app-nav-upgrade-mobile" onClick={() => handleNav('/pricing')}>
                ⭐ Upgrade
              </button>
            )}
            <button className="app-nav-item" onClick={handleLogout}>
              <span className="app-nav-item-icon">🚪</span>
              <span className="app-nav-item-label">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="app-nav-right">
          {!isPremium && (
            <button className="app-nav-upgrade" onClick={() => {
              // Open pricing in new tab since logged-in users don't have pricing page
              window.open('https://clavirafinance.com/pricing', '_blank');
            }}>
              ⭐ Upgrade
            </button>
          )}

          {/* User menu */}
          <div className="app-nav-user-wrap">
            <button className="app-nav-user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
              <span className="app-nav-avatar">{(user?.first_name?.[0] || 'U').toUpperCase()}</span>
              <span className="app-nav-user-name">{user?.first_name}</span>
              <span className="app-nav-tier-dot" style={{ background: tierColor }} />
            </button>
            {userMenuOpen && (
              <>
                <div className="app-nav-overlay" onClick={() => setUserMenuOpen(false)} />
                <div className="app-nav-dropdown">
                  <div className="app-nav-dd-header">
                    <div className="app-nav-dd-name">{user?.first_name} {user?.last_name}</div>
                    <div className="app-nav-dd-email">{user?.email}</div>
                    <div className="app-nav-dd-tier" style={{ color: tierColor, borderColor: tierColor }}>
                      {tierLabel} Plan
                    </div>
                  </div>
                  <div className="app-nav-dd-divider" />
                  <button className="app-nav-dd-item" onClick={() => handleNav('/connect-bank')}>
                    🏦 Manage Accounts
                  </button>
                  {isBusiness && (
                    <button className="app-nav-dd-item" onClick={() => handleNav('/')}>
                      👥 Team Settings
                    </button>
                  )}
                  <div className="app-nav-dd-divider" />
                  <button className="app-nav-dd-item" onClick={handleLogout}>
                    🚪 Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button className={`app-nav-hamburger ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}