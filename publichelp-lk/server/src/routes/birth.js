import { Router } from 'express';
import { AGENCY, cases, categories, fees, gaps, sources, LAST_CHECKED } from '../data/birth.js';

const router = Router();

const summary = ({ id, number, category, title, summary, where, fee, duration }) =>
  ({ id, number, category, title, summary, where, fee, duration });

router.get('/meta', (_req, res) => {
  res.json({ lastChecked: LAST_CHECKED, agency: AGENCY, sources, gaps, categories, fees, totalCases: cases.length });
});

router.get('/cases', (req, res) => {
  const { category } = req.query;
  const list = category ? cases.filter((c) => c.category.includes(category)) : cases;
  res.json({ cases: list.map(summary), lastChecked: LAST_CHECKED });
});

router.get('/cases/:id', (req, res) => {
  const found = cases.find((c) => c.id === req.params.id);
  if (!found) return res.status(404).json({ error: 'Case not found.' });
  res.json({ case: { ...found, source: { ...sources[found.source], agency: AGENCY, lastChecked: LAST_CHECKED } } });
});

export default router;
