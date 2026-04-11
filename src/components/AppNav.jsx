import { useState } from 'react';
import './AppNav.css';

export default function AppNav({ navigate, user, logout, currentPath }) {
  var [userMenuOpen, setUserMenuOpen] = useState(false);
  var [mobileOpen, setMobileOpen] = useState(false);

  var isPremium = user && (user.tier === 'premium' || user.tier === 'business');
  var isBusiness = user && user.tier === 'business';

  var NAV_ITEMS = [
    { icon: '\u{1F4CA}', label: 'Dashboard', path: '/' },
    { icon: '\u{1F4B3}', label: 'Calculator', path: '/calculator' },
    { icon: '\u{1F3C6}', label: 'Rewards', path: '/rewards' },
    { icon: '\u{1F4C8}', label: 'Credit Score', path: '/credit-score' },
    { icon: '\u{1F3E6}', label: 'Accounts', path: '/connect-bank' },
    { icon: '✦', label: 'Optimizer', path: '/optimizer' },
  ];

  function handleNav(path) { navigate(path); setMobileOpen(false); setUserMenuOpen(false); }
  function handleLogout() { logout(); navigate('/'); }

  var tierLabel = isBusiness ? 'Business' : isPremium ? 'Premium' : 'Free';
  var tierColor = isBusiness ? 'var(--blue)' : isPremium ? 'var(--gold)' : 'var(--muted)';

  return (
    <nav className="app-nav">
      <div className="app-nav-inner">
        <button className="app-nav-brand" onClick={function() { handleNav('/'); }}>
          <div className="app-nav-logo">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <text x="16" y="23" textAnchor="middle" fontFamily="Inter,sans-serif" fontWeight="800" fontSize="20" fill="white">C</text>
            </svg>
          </div>
          <span className="app-nav-name">Clavira</span>
        </button>

        <div className={'app-nav-links' + (mobileOpen ? ' open' : '')}>
          {NAV_ITEMS.map(function(item) {
            return (
              <button key={item.path}
                className={'app-nav-item' + (currentPath === item.path ? ' active' : '')}
                onClick={function() { handleNav(item.path); }}>
                <span className="app-nav-item-icon">{item.icon}</span>
                <span className="app-nav-item-label">{item.label}</span>
              </button>
            );
          })}

          <div className="app-nav-mobile-user">
            <div className="app-nav-mobile-info">
              <span>{user ? user.first_name : ''} {user ? user.last_name : ''}</span>
              <span className="app-nav-mobile-tier" style={{ color: tierColor }}>{tierLabel}</span>
            </div>
            {!isPremium && (
              <button className="app-nav-upgrade-mobile" onClick={function() { handleNav('/pricing'); }}>
                Upgrade to Premium
              </button>
            )}
            <button className="app-nav-item" onClick={handleLogout}>
              <span className="app-nav-item-icon">{'\u{1F6AA}'}</span>
              <span className="app-nav-item-label">Sign Out</span>
            </button>
          </div>
        </div>

        <div className="app-nav-right">
          {!isPremium && (
            <button className="app-nav-upgrade" onClick={function() { handleNav('/pricing'); }}>
              Upgrade
            </button>
          )}

          <div className="app-nav-user-wrap">
            <button className="app-nav-user-btn" onClick={function() { setUserMenuOpen(!userMenuOpen); }}>
              <span className="app-nav-avatar">{(user && user.first_name ? user.first_name[0] : 'U').toUpperCase()}</span>
              <span className="app-nav-user-name">{user ? user.first_name : ''}</span>
              <span className="app-nav-tier-dot" style={{ background: tierColor }} />
            </button>
            {userMenuOpen && (
              <>
                <div className="app-nav-overlay" onClick={function() { setUserMenuOpen(false); }} />
                <div className="app-nav-dropdown">
                  <div className="app-nav-dd-header">
                    <div className="app-nav-dd-name">{user ? user.first_name : ''} {user ? user.last_name : ''}</div>
                    <div className="app-nav-dd-email">{user ? user.email : ''}</div>
                    <div className="app-nav-dd-tier" style={{ color: tierColor, borderColor: tierColor }}>
                      {tierLabel} Plan
                    </div>
                  </div>
                  <div className="app-nav-dd-divider" />
                  {!isPremium && (
                    <button className="app-nav-dd-item app-nav-dd-upgrade" onClick={function() { handleNav('/pricing'); }}>
                      {'\u2B50'} Upgrade to Premium
                    </button>
                  )}
                  <div className="app-nav-dd-divider" />
                  <button className="app-nav-dd-item" onClick={handleLogout}>
                    {'\u{1F6AA}'} Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <button className={'app-nav-hamburger' + (mobileOpen ? ' open' : '')}
          onClick={function() { setMobileOpen(!mobileOpen); }} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}