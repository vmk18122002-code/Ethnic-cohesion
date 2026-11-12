import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, tokenStore } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(tokenStore.get()));

  useEffect(() => {
    if (!tokenStore.get()) return;
    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  const finish = (d) => { tokenStore.set(d.token); setUser(d.user); return d.user; };
  const login = useCallback((email, password) => api('/auth/login', { method: 'POST', body: { email, password } }).then(finish), []);
  const register = useCallback((payload) => api('/auth/register', { method: 'POST', body: payload }).then(finish), []);
  const logout = useCallback(() => { tokenStore.clear(); setUser(null); }, []);
  const updateProfile = useCallback((payload) => api('/auth/me', { method: 'PUT', body: payload }).then((d) => { setUser(d.user); return d.user; }), []);

  const value = useMemo(() => ({ user, loading, login, register, logout, updateProfile }), [user, loading, login, register, logout, updateProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
