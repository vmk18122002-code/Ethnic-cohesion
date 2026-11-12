import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret-change-me';
if (!process.env.JWT_SECRET) {
  console.warn('[auth] JWT_SECRET not set - using an insecure development secret.');
}

export function signToken(user) {
  return jwt.sign({ sub: String(user.id), email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function readToken(req) {
  const header = req.headers.authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

export function requireAuth(req, res, next) {
  const token = readToken(req);
  if (!token) return res.status(401).json({ error: 'Please sign in to continue.' });
  try {
    req.userId = Number(jwt.verify(token, JWT_SECRET).sub);
    next();
  } catch {
    res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
  }
}

export function optionalAuth(req, _res, next) {
  const token = readToken(req);
  if (token) {
    try { req.userId = Number(jwt.verify(token, JWT_SECRET).sub); } catch { /* anonymous */ }
  }
  next();
}
