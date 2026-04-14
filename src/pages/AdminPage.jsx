import { useState, useEffect } from 'react';

const ADMIN_KEY = 'clv-admin-2026-secret';
const API = 'https://clavira-backend.onrender.com/api';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const handleLogin = () => {
    if (keyInput === ADMIN_KEY) { setAuthed(true); setError(''); }
    else setError('Invalid admin key');
  };

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    Promise.all([
      fetch(`${API}/admin/stats`, { headers: { 'x-admin-key': ADMIN_KEY } }).then(r => r.json()),
      fetch(`${API}/admin/users`, { headers: { 'x-admin-key': ADMIN_KEY } }).then(r => r.json()),
    ]).then(([s, u]) => {
      setStats(s);
      setUsers(u.users || []);
    }).finally(() => setLoading(false));
  }, [authed]);

  const filtered = users.filter(u => {
    const matchSearch = u.email.toLowerCase().includes(search.toLowerCase()) ||
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || u.tier === filter ||
      (filter === 'verified' && u.is_verified) || (filter === 'unverified' && !u.is_verified);
    return matchSearch && matchFilter;
  });

  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05040F' }}>
      <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 24, padding: 48, width: 380, textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 26 }}>🔐</div>
        <h2 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 22, marginBottom: 8 }}>Admin Access</h2>
        <p style={{ color: '#6B6490', fontSize: 14, marginBottom: 28 }}>Clavira Finance Dashboard</p>
        {error && <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 10, padding: '10px 16px', color: '#F43F5E', fontSize: 13, marginBottom: 16 }}>{error}</div>}
        <input
          type="password" value={keyInput}
          onChange={e => setKeyInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="Enter admin key"
          style={{ width: '100%', background: '#07060E', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10, padding: '12px 16px', color: '#F0EEFF', fontSize: 15, marginBottom: 14, boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' }}
        />
        <button onClick={handleLogin} style={{ width: '100%', background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', color: '#fff', border: 'none', borderRadius: 10, padding: 13, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          Access Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#05040F', padding: 32, fontFamily: 'inherit' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18 }}>C</div>
            <h1 style={{ color: '#F0EEFF', fontWeight: 800, fontSize: 22, margin: 0 }}>Clavira Admin</h1>
          </div>
          <button onClick={() => setAuthed(false)} style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#F43F5E', borderRadius: 10, padding: '8px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>Sign Out</button>
        </div>

        {loading ? <div style={{ textAlign: 'center', padding: 80, color: '#6B6490' }}>Loading...</div> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
              {[
                { label: 'Total Users', value: stats?.total_users || 0, color: '#A78BFA', icon: '👤' },
                { label: 'Verified', value: stats?.verified_users || 0, color: '#10B981', icon: '✅' },
                { label: 'Premium', value: stats?.tiers?.premium || 0, color: '#F59E0B', icon: '⭐' },
                { label: 'MRR', value: `$${((stats?.tiers?.premium || 0) * 9.99).toFixed(0)}`, color: '#A78BFA', icon: '💰' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 16, padding: '20px 24px' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
                  <div style={{ color: '#6B6490', fontSize: 13 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(124,58,237,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                <h2 style={{ color: '#F0EEFF', fontWeight: 700, fontSize: 16, margin: 0 }}>Users ({filtered.length})</h2>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ background: '#07060E', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 8, padding: '8px 12px', color: '#F0EEFF', fontSize: 13, width: 200, fontFamily: 'inherit', outline: 'none' }} />
                  <select value={filter} onChange={e => setFilter(e.target.value)} style={{ background: '#07060E', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 8, padding: '8px 12px', color: '#F0EEFF', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}>
                    <option value="all">All</option>
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(124,58,237,0.1)' }}>
                    {['Name', 'Email', 'Tier', 'Verified', 'Signed Up'].map((h, i) => (
                      <th key={i} style={{ textAlign: 'left', padding: '10px 24px', color: '#6B6490', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user, i) => (
                    <tr key={user.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(124,58,237,0.06)' : 'none' }}>
                      <td style={{ padding: '14px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A78BFA', fontWeight: 700, fontSize: 14 }}>
                            {user.first_name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <span style={{ color: '#F0EEFF', fontSize: 14, fontWeight: 500 }}>{user.first_name} {user.last_name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 24px', color: '#6B6490', fontSize: 13 }}>{user.email}</td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ background: user.tier === 'premium' ? 'rgba(245,158,11,0.15)' : 'rgba(124,58,237,0.1)', color: user.tier === 'premium' ? '#F59E0B' : '#A78BFA', border: `1px solid ${user.tier === 'premium' ? 'rgba(245,158,11,0.3)' : 'rgba(124,58,237,0.2)'}`, borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 700, textTransform: 'capitalize' }}>
                          {user.tier}
                        </span>
                      </td>
                      <td style={{ padding: '14px 24px', color: user.is_verified ? '#10B981' : '#F43F5E', fontSize: 13, fontWeight: 600 }}>
                        {user.is_verified ? '✓ Verified' : '✗ Unverified'}
                      </td>
                      <td style={{ padding: '14px 24px', color: '#6B6490', fontSize: 13 }}>{formatDate(user.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#6B6490' }}>No users found</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}