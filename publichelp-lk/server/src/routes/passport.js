import { Router } from 'express';
import {
  cases, categories, contacts, fees, forms, gaps, offices, sources, LAST_CHECKED, SITE_LAST_UPDATE,
} from '../data/passport.js';

const router = Router();

const withSource = (c) => ({ ...c, source: { ...sources[c.source], lastChecked: LAST_CHECKED } });
const summary = ({ id, number, category, title, summary, where, fee, duration }) =>
  ({ id, number, category, title, summary, where, fee, duration });

router.get('/meta', (_req, res) => {
  res.json({ lastChecked: LAST_CHECKED, siteLastUpdate: SITE_LAST_UPDATE, sources, gaps, categories, totalCases: cases.length });
});

router.get('/cases', (req, res) => {
  const { category, q } = req.query;
  let list = cases;
  if (category) list = list.filter((c) => c.category.includes(category));
  if (q) {
    const needle = String(q).toLowerCase();
    list = list.filter((c) => [c.title, c.summary, ...c.keywords].join(' ').toLowerCase().includes(needle));
  }
  res.json({ cases: list.map(summary), lastChecked: LAST_CHECKED });
});

router.get('/cases/:id', (req, res) => {
  const found = cases.find((c) => c.id === req.params.id);
  if (!found) return res.status(404).json({ error: 'Case not found.' });
  const { keywords, ...rest } = withSource(found);
  res.json({ case: rest });
});

router.get('/fees', (_req, res) => res.json({ fees, source: { ...sources.issue, lastChecked: LAST_CHECKED } }));
router.get('/forms', (_req, res) => res.json({ forms, downloads: sources.downloads, lastChecked: LAST_CHECKED }));
router.get('/offices', (_req, res) => res.json({ offices, map: sources.map, lastChecked: LAST_CHECKED }));
router.get('/contacts', (_req, res) => res.json({ contacts, source: sources.contact, lastChecked: LAST_CHECKED }));

// Fee calculator: everything is computed from the verified fee table.
router.post('/fees/calculate', (req, res) => {
  const { passportType = 'ordinary', service = 'normal', lost = 'none', alterations = 0, certifiedCopies = 0, arabic = 0, courier = 0 } = req.body || {};
  const passport = fees.passports.find((p) => p.key === passportType);
  const fine = fees.lostFines.find((f) => f.key === lost);
  if (!passport || !fine || !['normal', 'urgent', 'none'].includes(service)) {
    return res.status(400).json({ error: 'Invalid selection.' });
  }
  const count = (n) => Math.max(0, Math.min(20, Math.floor(Number(n) || 0)));
  const svc = Object.fromEntries(fees.services.map((s) => [s.key, s]));

  const lines = [];
  if (service !== 'none') lines.push({ label: `${passport.label} – ${service}`, amount: passport[service] });
  if (fine.amount) lines.push({ label: `Fine: ${fine.label.toLowerCase()}`, amount: fine.amount });
  const extras = [['alteration', alterations], ['certifiedCopy', certifiedCopies], ['arabic', arabic], ['courier', courier]];
  for (const [key, n] of extras) {
    const qty = count(n);
    if (qty) lines.push({ label: `${svc[key].label} × ${qty}`, amount: svc[key].amount * qty });
  }
  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  res.json({
    lines,
    total,
    delivery: service === 'urgent' ? fees.delivery.urgent : service === 'normal' ? fees.delivery.normal : null,
    notes: [
      ...(service === 'urgent' ? ['Urgent service is available at the Head Office, Battaramulla only.'] : []),
      ...(fine.amount ? ['The fine applies only if the lost passport was still valid.'] : []),
      'Our own calculation from the official fee table – confirm at the counter.',
    ],
    lastChecked: LAST_CHECKED,
  });
});

export default router;
