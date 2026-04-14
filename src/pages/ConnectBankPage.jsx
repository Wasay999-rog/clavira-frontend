import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { api } from '../api';
import Section from '../components/Section.jsx';
import './ConnectBankPage.css';

export default function ConnectBankPage({ navigate, showToast }) {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const isPremium = user?.tier === 'premium' || user?.tier === 'business';
  const FREE_LIMIT = 3;
  const institutions = [...new Set(accounts.map(a => a.institution))];
  const atLimit = !isPremium && institutions.length >= FREE_LIMIT;

  useEffect(() => {
    api.getAccounts()
      .then(data => setAccounts(data?.accounts || []))
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleConnect = async () => {
    if (atLimit) return;
    setConnecting(true);
    try {
      const { link_token } = await api.createLinkToken();
      const handler = window.Plaid.create({
        token: link_token,
        onSuccess: async (public_token, metadata) => {
          try {
            await api.exchangeToken(public_token, metadata.institution?.name);
            showToast('Bank connected successfully!');
            const data = await api.getAccounts();
            setAccounts(data?.accounts || []);
          } catch (err) {
            showToast('Failed to link account. Please try again.');
          }
        },
        onExit: (err) => {
          if (err) console.error('Plaid exit error:', err);
          setConnecting(false);
        },
      });
      handler.open();
    } catch (err) {
      showToast('Could not start bank connection. Please try again.');
      setConnecting(false);
    }
  };

  const handleDisconnect = async (accountId) => {
    if (!confirm('Disconnect this account? Your transaction history will be removed.')) return;
    try {
      await api.disconnectAccount(accountId);
      setAccounts(prev => prev.filter(a => a.id !== accountId));
      showToast('Account disconnected');
    } catch {
      showToast('Failed to disconnect');
    }
  };

  const UNLOCK_HINTS = [
    { icon: '💳', label: 'Connect your primary credit card', unlock: 'Unlock card optimizer + rewards tracking' },
    { icon: '🏦', label: 'Connect your checking account', unlock: 'Unlock payoff strategy + income detection' },
    { icon: '💰', label: 'Connect a second credit card', unlock: 'Unlock 2-card combo strategy' },
  ];

  if (loading) {
    return (
      <div className="connect-loading">
        <div className="connect-spinner" />
        <p>Loading accounts...</p>
      </div>
    );
  }

  return (
    <div className="connect-page">
      <Section style={{ paddingTop: 48, paddingBottom: 0 }}>
        <div className="connect-header">
          <h1>🏦 Connected Accounts</h1>
          <p>Connect your accounts to unlock personalized insights. Start with one — add more when you're ready.</p>
        </div>
      </Section>

      {/* Security badges */}
      <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
        <div className="connect-security">
          {[
            { icon: '🔒', title: 'Bank-grade encryption', desc: '256-bit AES, TLS 1.3' },
            { icon: '👁', title: 'Read-only access', desc: 'We never move your money' },
            { icon: '🏛', title: 'Powered by Plaid', desc: 'Trusted by 12,000+ banks' },
            { icon: '🗑', title: 'Delete anytime', desc: 'One-click disconnect' },
          ].map(b => (
            <div key={b.title} className="connect-badge">
              <span className="connect-badge-icon">{b.icon}</span>
              <div>
                <div className="connect-badge-title">{b.title}</div>
                <div className="connect-badge-desc">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Progressive unlock hints */}
      {accounts.length < 3 && (
        <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
          <h2 className="connect-section-title">Unlock More Insights</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {UNLOCK_HINTS.map((hint, i) => {
              const done = i < institutions.length;
              return (
                <div key={i} style={{
                  background: done ? 'rgba(16,185,129,0.06)' : '#0F0D1F',
                  border: `1px solid ${done ? 'rgba(16,185,129,0.2)' : 'rgba(124,58,237,0.1)'}`,
                  borderRadius: 14, padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                    background: done ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                  }}>
                    {done ? '✅' : hint.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: done ? '#10B981' : '#F0EEFF', fontWeight: 600, fontSize: 14 }}>
                      {done ? 'Connected' : hint.label}
                    </div>
                    <div style={{ color: done ? '#10B981' : '#6B6490', fontSize: 12, marginTop: 2 }}>
                      {done ? 'Unlocked ✓' : hint.unlock}
                    </div>
                  </div>
                  {!done && (
                    <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 600 }}>
                      {i === institutions.length ? 'Connect →' : '🔒 Locked'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Connected accounts list */}
      {accounts.length > 0 && (
        <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
          <h2 className="connect-section-title">Linked Accounts ({accounts.length})</h2>
          <div className="connect-accounts">
            {accounts.map(acc => (
              <div key={acc.id} className="connect-account-card">
                <div className="connect-account-left">
                  <div className="connect-account-icon">
                    {acc.type === 'credit' ? '💳' : acc.type === 'depository' ? '🏦' : '📄'}
                  </div>
                  <div>
                    <div className="connect-account-name">{acc.name}</div>
                    <div className="connect-account-institution">{acc.institution} · ····{acc.mask}</div>
                  </div>
                </div>
                <div className="connect-account-right">
                  <div className="connect-account-balance">
                    ${acc.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <div className="connect-account-type">{acc.subtype}</div>
                </div>
                <button className="connect-disconnect" onClick={() => handleDisconnect(acc.id)}>
                  Disconnect
                </button>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Add account / limit section */}
      <Section style={{ paddingTop: 24, paddingBottom: 60 }}>
        {atLimit ? (
          <div style={{
            background: 'linear-gradient(135deg, #1A0E3A, #0F0D1F)',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: 20, padding: 32, textAlign: 'center',
          }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🔒</div>
            <h3 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 20, marginBottom: 12 }}>
              Connect Unlimited Accounts
            </h3>
            <p style={{ color: '#6B6490', fontSize: 14, lineHeight: 1.7, marginBottom: 8, maxWidth: 360, margin: '0 auto 8px' }}>
              Free accounts are limited to {FREE_LIMIT} bank connections. Upgrade to Premium to:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300, margin: '0 auto 24px', textAlign: 'left' }}>
              {[
                '✦ Connect unlimited banks and cards',
                '✦ Full 2-card combo optimizer',
                '✦ Complete spending analysis',
                '✦ All payoff strategies unlocked',
              ].map((f, i) => (
                <div key={i} style={{ color: '#A78BFA', fontSize: 14 }}>{f}</div>
              ))}
            </div>

            <div style={{ position: 'relative', marginBottom: 20 }}>
              <div style={{ filter: 'blur(3px)', pointerEvents: 'none' }}>
                <button style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 700, width: '100%' }}>
                  + Connect Another Account
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate('/pricing')}
              style={{ background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' }}
            >
              Upgrade to Premium →
            </button>
            <div style={{ color: '#4A4368', fontSize: 12, marginTop: 12 }}>$9.99/month · Cancel anytime</div>
          </div>
        ) : (
          <>
            <button
              className="connect-add-btn"
              onClick={handleConnect}
              disabled={connecting}
            >
              {connecting ? 'Opening Plaid...' : accounts.length > 0 ? '+ Connect Another Account' : '🏦 Connect Your First Account'}
            </button>

            {!isPremium && (
              <div style={{ textAlign: 'center', marginTop: 16, color: '#6B6490', fontSize: 13 }}>
                {institutions.length} of {FREE_LIMIT} free connections used
                <button
                  onClick={() => navigate('/pricing')}
                  style={{ background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer', fontSize: 13, fontWeight: 600, marginLeft: 8 }}
                >
                  Upgrade for unlimited →
                </button>
              </div>
            )}

            {accounts.length === 0 && (
              <div className="connect-demo-note">
                <p>Not ready to connect? Explore Clavira first.</p>
                <button className="connect-demo-btn" onClick={() => navigate('/')}>
                  Continue without connecting →
                </button>
              </div>
            )}
          </>
        )}
      </Section>
    </div>
  );
}
