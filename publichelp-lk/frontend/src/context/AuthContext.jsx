import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,
  updateProfile as updateAuthProfile, EmailAuthProvider, reauthenticateWithCredential, updatePassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.js';
import { ApiError } from '../api.js';

const AuthContext = createContext(null);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NIC_RE = /^(\d{9}[VvXx]|\d{12})$/; // old (9 digits + V/X) or new (12 digits) NIC
const PHONE_RE = /^\+?\d[\d\s-]{8,14}$/;
const LANGS = ['en', 'si', 'ta'];
const strongPassword = (p) => typeof p === 'string' && p.length >= 8 && /[A-Za-z]/.test(p) && /\d/.test(p);

function validateProfile({ fullName, nic, phone, preferredLang }, errors) {
  if (fullName !== undefined && (typeof fullName !== 'string' || fullName.trim().length < 2 || fullName.trim().length > 100)) {
    errors.fullName = 'Enter your full name (2-100 characters).';
  }
  if (nic && !NIC_RE.test(String(nic).trim())) errors.nic = 'Enter a valid NIC (e.g. 199912345678 or 991234567V).';
  if (phone && !PHONE_RE.test(String(phone).trim())) errors.phone = 'Enter a valid phone number.';
  if (preferredLang && !LANGS.includes(preferredLang)) errors.preferredLang = 'Choose English, Sinhala or Tamil.';
}

function authErrorMessage(err) {
  const map = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/weak-password': 'Use at least 8 characters with letters and numbers.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/wrong-password': 'Incorrect email or password.',
    'auth/user-not-found': 'Incorrect email or password.',
    'auth/too-many-requests': 'Too many attempts. Please wait a while and try again.',
  };
  return map[err.code] || 'Something went wrong.';
}

// Firestore can briefly stall (cold start, a flaky network, a brand-new database still
// warming up) and the SDK's internal retries can take a while to surface as a rejection.
// Never let that hang the whole app blank — fall back to auth-only data and let the
// profile fields fill in whenever Firestore actually answers.
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

async function loadProfile(uid) {
  const snap = await withTimeout(getDoc(doc(db, 'users', uid)), 6000);
  return snap?.exists() ? snap.data() : null;
}

function buildUser(authUser, profile) {
  return {
    id: authUser.uid,
    fullName: profile?.fullName || authUser.displayName || '',
    email: authUser.email,
    nic: profile?.nic || null,
    phone: profile?.phone || null,
    preferredLang: profile?.preferredLang || 'en',
    createdAt: profile?.createdAt || authUser.metadata.creationTime,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) { setUser(null); setLoading(false); return; }
      try {
        const profile = await loadProfile(authUser.uid);
        setUser(buildUser(authUser, profile));
      } catch {
        setUser(buildUser(authUser, null));
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const login = useCallback(async (email, password) => {
    if (!email || !password) throw new ApiError('Enter your email and password.', 400);
    let cred;
    try {
      cred = await signInWithEmailAndPassword(auth, String(email).trim().toLowerCase(), password);
    } catch (err) {
      throw new ApiError(authErrorMessage(err), 401);
    }
    const profile = await loadProfile(cred.user.uid);
    const u = buildUser(cred.user, profile);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (payload) => {
    const { fullName, email, password, nic, phone, preferredLang = 'en' } = payload;
    const errors = {};
    validateProfile({ fullName: fullName ?? '', nic, phone, preferredLang }, errors);
    if (!email || !EMAIL_RE.test(String(email).trim())) errors.email = 'Enter a valid email address.';
    if (!strongPassword(password)) errors.password = 'Use at least 8 characters with letters and numbers.';
    if (Object.keys(errors).length) throw new ApiError('Please fix the highlighted fields.', 400, errors);

    const normalizedEmail = String(email).trim().toLowerCase();
    let cred;
    try {
      cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        throw new ApiError('An account with this email already exists.', 409, { email: 'Already registered.' });
      }
      throw new ApiError(authErrorMessage(err), 400);
    }
    await updateAuthProfile(cred.user, { displayName: fullName.trim() });
    const profile = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      nic: nic ? String(nic).trim().toUpperCase() : null,
      phone: phone ? String(phone).trim() : null,
      preferredLang,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', cred.user.uid), profile);
    const u = buildUser(cred.user, profile);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => signOut(auth), []);

  const updateProfile = useCallback(async (payload) => {
    const { fullName, nic, phone, preferredLang } = payload;
    const errors = {};
    validateProfile({ fullName, nic, phone, preferredLang }, errors);
    if (Object.keys(errors).length) throw new ApiError('Please fix the highlighted fields.', 400, errors);

    const authUser = auth.currentUser;
    if (!authUser) throw new ApiError('Please sign in to continue.', 401);
    const current = (await loadProfile(authUser.uid)) || {};
    const next = {
      ...current,
      fullName: fullName !== undefined ? fullName.trim() : current.fullName,
      nic: nic !== undefined ? (nic ? String(nic).trim().toUpperCase() : null) : current.nic,
      phone: phone !== undefined ? (phone ? String(phone).trim() : null) : current.phone,
      preferredLang: preferredLang || current.preferredLang,
    };
    await setDoc(doc(db, 'users', authUser.uid), next, { merge: true });
    if (fullName !== undefined) await updateAuthProfile(authUser, { displayName: next.fullName });
    const u = buildUser(authUser, next);
    setUser(u);
    return u;
  }, []);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    if (!strongPassword(newPassword)) {
      throw new ApiError('Use at least 8 characters with letters and numbers.', 400, { newPassword: 'Too weak.' });
    }
    const authUser = auth.currentUser;
    try {
      await reauthenticateWithCredential(authUser, EmailAuthProvider.credential(authUser.email, currentPassword || ''));
    } catch {
      throw new ApiError('Current password is incorrect.', 400, { currentPassword: 'Incorrect password.' });
    }
    await updatePassword(authUser, newPassword);
    return { ok: true };
  }, []);

  const value = useMemo(() => ({ user, loading, login, register, logout, updateProfile, changePassword }),
    [user, loading, login, register, logout, updateProfile, changePassword]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
