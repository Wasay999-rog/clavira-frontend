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

  useEffect(() => {
    api.getAccounts()
      .then(data => setAccounts(data?.accounts || []))
      .catch(() => setAccounts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      // Get link token from backend
      const { link_token } = await api.createPlaidLink();

      // Open Plaid Link
      const handler = window.Plaid.create({
        token: link_token,
        onSuccess: async (public_token, metadata) => {
          try {
            await api.exchangePlaidToken(public_token, metadata.institution?.name);
            showToast('Bank connected successfully!');
            // Refresh accounts
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
          <p>Securely link your bank accounts to get real-time balances, transactions, and AI-powered insights.</p>
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

      {/* Connected accounts list */}
      {accounts.length > 0 && (
        <Section style={{ paddingTop: 24, paddingBottom: 0 }}>
          <h2 className="connect-section-title">Linked Accounts</h2>
          <div className="connect-accounts">
            {accounts.map(acc => (
              <div key={acc.id} className="connect-account-card">
                <div className="connect-account-left">
                  <div className="connect-account-icon">🏦</div>
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

      {/* Add account button */}
      <Section style={{ paddingTop: 24, paddingBottom: 60 }}>
        <button
          className="connect-add-btn"
          onClick={handleConnect}
          disabled={connecting}
        >
          {connecting ? 'Opening Plaid...' : accounts.length > 0 ? '+ Connect Another Account' : '🏦 Connect Your First Account'}
        </button>

        {accounts.length === 0 && (
          <div className="connect-demo-note">
            <p>Don't want to connect yet? You can still explore Clavira with demo data.</p>
            <button className="connect-demo-btn" onClick={() => navigate('/')}>
              Continue with demo data →
            </button>
          </div>
        )}
      </Section>
    </div>
  );
}
