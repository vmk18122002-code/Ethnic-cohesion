import { Router } from 'express';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { cases } from '../data/passport.js';

// A "journey" is a citizen's personal progress through one passport case:
// which steps they have completed and which documents they have ready.
const router = Router();
router.use(requireAuth);

const caseById = (id) => cases.find((c) => c.id === id);

function shape(row) {
  const c = caseById(row.case_id);
  const steps = JSON.parse(row.steps);
  const docs = JSON.parse(row.docs);
  const total = c.steps.length + c.documents.length;
  const done = steps.filter(Boolean).length + docs.filter(Boolean).length;
  return {
    caseId: row.case_id,
    number: c.number,
    title: c.title,
    steps,
    docs,
    progress: total ? Math.round((done / total) * 100) : 0,
    updatedAt: row.updated_at,
  };
}

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM journeys WHERE user_id = ? ORDER BY updated_at DESC').all(req.userId);
  res.json({ journeys: rows.filter((r) => caseById(r.case_id)).map(shape) });
});

router.get('/:caseId', (req, res) => {
  if (!caseById(req.params.caseId)) return res.status(404).json({ error: 'Case not found.' });
  const row = db.prepare('SELECT * FROM journeys WHERE user_id = ? AND case_id = ?').get(req.userId, req.params.caseId);
  res.json({ journey: row ? shape(row) : null });
});

router.put('/:caseId', (req, res) => {
  const c = caseById(req.params.caseId);
  if (!c) return res.status(404).json({ error: 'Case not found.' });
  const { steps = [], docs = [] } = req.body || {};
  const clean = (arr, len) => Array.from({ length: len }, (_, i) => Boolean(Array.isArray(arr) && arr[i]));
  db.prepare(`
    INSERT INTO journeys (user_id, case_id, steps, docs, updated_at) VALUES (?, ?, ?, ?, datetime('now'))
    ON CONFLICT(user_id, case_id) DO UPDATE SET steps = excluded.steps, docs = excluded.docs, updated_at = excluded.updated_at
  `).run(req.userId, c.id, JSON.stringify(clean(steps, c.steps.length)), JSON.stringify(clean(docs, c.documents.length)));
  const row = db.prepare('SELECT * FROM journeys WHERE user_id = ? AND case_id = ?').get(req.userId, c.id);
  res.json({ journey: shape(row) });
});

router.delete('/:caseId', (req, res) => {
  db.prepare('DELETE FROM journeys WHERE user_id = ? AND case_id = ?').run(req.userId, req.params.caseId);
  res.json({ ok: true });
});

export default router;
