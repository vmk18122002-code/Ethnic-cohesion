import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db, publicUser } from '../db.js';
import { requireAuth, signToken } from '../middleware/auth.js';

const router = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NIC_RE = /^(\d{9}[VvXx]|\d{12})$/; // old (9 digits + V/X) or new (12 digits) NIC
const PHONE_RE = /^\+?\d[\d\s-]{8,14}$/;
const LANGS = ['en', 'si', 'ta'];
const strongPassword = (p) => typeof p === 'string' && p.length >= 8 && /[A-Za-z]/.test(p) && /\d/.test(p);

// Simple in-memory throttle for login attempts (per IP + email).
const attempts = new Map();
function throttled(key) {
  const now = Date.now();
  const rec = attempts.get(key) || { count: 0, first: now };
  if (now - rec.first > 15 * 60 * 1000) { rec.count = 0; rec.first = now; }
  rec.count += 1;
  attempts.set(key, rec);
  return rec.count > 10;
}

function validateProfile({ fullName, nic, phone, preferredLang }, errors) {
  if (fullName !== undefined && (typeof fullName !== 'string' || fullName.trim().length < 2 || fullName.trim().length > 100)) {
    errors.fullName = 'Enter your full name (2-100 characters).';
  }
  if (nic && !NIC_RE.test(String(nic).trim())) errors.nic = 'Enter a valid NIC (e.g. 199912345678 or 991234567V).';
  if (phone && !PHONE_RE.test(String(phone).trim())) errors.phone = 'Enter a valid phone number.';
  if (preferredLang && !LANGS.includes(preferredLang)) errors.preferredLang = 'Choose English, Sinhala or Tamil.';
}

const getUser = (id) => db.prepare('SELECT * FROM users WHERE id = ?').get(id);

router.post('/register', (req, res) => {
  const { fullName, email, password, nic, phone, preferredLang = 'en' } = req.body || {};
  const errors = {};
  validateProfile({ fullName: fullName ?? '', nic, phone, preferredLang }, errors);
  if (!email || !EMAIL_RE.test(String(email).trim())) errors.email = 'Enter a valid email address.';
  if (!strongPassword(password)) errors.password = 'Use at least 8 characters with letters and numbers.';
  if (Object.keys(errors).length) return res.status(400).json({ error: 'Please fix the highlighted fields.', fields: errors });

  const normalizedEmail = String(email).trim().toLowerCase();
  if (db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail)) {
    return res.status(409).json({ error: 'An account with this email already exists.', fields: { email: 'Already registered.' } });
  }

  const info = db.prepare(
    'INSERT INTO users (full_name, email, nic, phone, preferred_lang, password_hash) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(
    fullName.trim(),
    normalizedEmail,
    nic ? String(nic).trim().toUpperCase() : null,
    phone ? String(phone).trim() : null,
    preferredLang,
    bcrypt.hashSync(password, 10)
  );

  const user = getUser(info.lastInsertRowid);
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Enter your email and password.' });
  const normalizedEmail = String(email).trim().toLowerCase();
  const key = `${req.ip}:${normalizedEmail}`;
  if (throttled(key)) return res.status(429).json({ error: 'Too many attempts. Please wait 15 minutes and try again.' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }
  attempts.delete(key);
  res.json({ token: signToken(user), user: publicUser(user) });
});

router.get('/me', requireAuth, (req, res) => {
  const user = getUser(req.userId);
  if (!user) return res.status(404).json({ error: 'Account not found.' });
  res.json({ user: publicUser(user) });
});

router.put('/me', requireAuth, (req, res) => {
  const { fullName, nic, phone, preferredLang } = req.body || {};
  const errors = {};
  validateProfile({ fullName, nic, phone, preferredLang }, errors);
  if (Object.keys(errors).length) return res.status(400).json({ error: 'Please fix the highlighted fields.', fields: errors });

  const current = getUser(req.userId);
  if (!current) return res.status(404).json({ error: 'Account not found.' });
  db.prepare('UPDATE users SET full_name = ?, nic = ?, phone = ?, preferred_lang = ? WHERE id = ?').run(
    fullName !== undefined ? fullName.trim() : current.full_name,
    nic !== undefined ? (nic ? String(nic).trim().toUpperCase() : null) : current.nic,
    phone !== undefined ? (phone ? String(phone).trim() : null) : current.phone,
    preferredLang || current.preferred_lang,
    req.userId
  );
  res.json({ user: publicUser(getUser(req.userId)) });
});

router.put('/password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  const user = getUser(req.userId);
  if (!user || !bcrypt.compareSync(currentPassword || '', user.password_hash)) {
    return res.status(400).json({ error: 'Current password is incorrect.', fields: { currentPassword: 'Incorrect password.' } });
  }
  if (!strongPassword(newPassword)) {
    return res.status(400).json({ error: 'Use at least 8 characters with letters and numbers.', fields: { newPassword: 'Too weak.' } });
  }
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(newPassword, 10), req.userId);
  res.json({ ok: true });
});

export default router;
