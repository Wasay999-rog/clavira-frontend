import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api, setAuth, clearAuth, getUser, isLoggedIn } from '../api';

const AuthContext = createContext(null);

var IDLE_TIMEOUT_MS = 15 * 60 * 1000;

export function AuthProvider({ children }) {
  var [user, setUser] = useState(function() { return getUser(); });
  var [loading, setLoading] = useState(true);
  var idleTimer = useRef(null);

  useEffect(function() {
    if (isLoggedIn()) {
      if (!sessionStorage.getItem('clavira_session_active')) {
        clearAuth();
        setUser(null);
        setLoading(false);
        return;
      }
      api.getMe()
        .then(function(data) {
          setUser(data.user);
          setAuth(null, null, data.user);
        })
        .catch(function() {
          clearAuth();
          setUser(null);
        })
        .finally(function() { setLoading(false); });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(function() {
    var handler = function() {
      setUser(null);
      clearAuth();
      sessionStorage.removeItem('clavira_session_active');
    };
    window.addEventListener('clavira:logout', handler);
    return function() { window.removeEventListener('clavira:logout', handler); };
  }, []);

  var resetIdleTimer = useCallback(function() {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (isLoggedIn()) {
      idleTimer.current = setTimeout(function() {
        clearAuth();
        setUser(null);
        sessionStorage.removeItem('clavira_session_active');
        window.location.href = '/login';
      }, IDLE_TIMEOUT_MS);
    }
  }, []);

  useEffect(function() {
    if (!user) return;
    var events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(function(e) { window.addEventListener(e, resetIdleTimer, { passive: true }); });
    resetIdleTimer();
    return function() {
      events.forEach(function(e) { window.removeEventListener(e, resetIdleTimer); });
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [user, resetIdleTimer]);

  var login = useCallback(async function(email, password) {
    var data = await api.login(email, password);
    setAuth(data.access_token, data.refresh_token, data.user);
    setUser(data.user);
    sessionStorage.setItem('clavira_session_active', '1');
    return data;
  }, []);

  var register = useCallback(async function(email, password, firstName, lastName) {
    var data = await api.register(email, password, firstName, lastName);
    setAuth(data.access_token, data.refresh_token, data.user);
    setUser(data.user);
    sessionStorage.setItem('clavira_session_active', '1');
    return data;
  }, []);

  var logout = useCallback(function() {
    clearAuth();
    setUser(null);
    sessionStorage.removeItem('clavira_session_active');
  }, []);

  var refreshUser = useCallback(async function() {
    try {
      var data = await api.getMe();
      setUser(data.user);
      setAuth(null, null, data.user);
    } catch (e) { /* silent */ }
  }, []);

  return (
    <AuthContext.Provider value={{ user: user, loading: loading, login: login, register: register, logout: logout, refreshUser: refreshUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  var ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}