import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setAuth, clearAuth, getUser, isLoggedIn } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn()) {
      api.getMe()
        .then(data => {
          setUser(data.user);
          setAuth(null, null, data.user);
        })
        .catch(() => {
          clearAuth();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      setUser(null);
      clearAuth();
    };
    window.addEventListener('clavira:logout', handler);
    return () => window.removeEventListener('clavira:logout', handler);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    setAuth(data.access_token, data.refresh_token, data.user);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = await api.register(email, password, firstName, lastName);
    setAuth(data.access_token, data.refresh_token, data.user);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await api.getMe();
      setUser(data.user);
      setAuth(null, null, data.user);
    } catch { /* silent */ }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
