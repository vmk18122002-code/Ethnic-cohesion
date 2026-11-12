import { fees, sources, LAST_CHECKED } from '../data/passport.js';

// Fee calculator: everything is computed from the verified fee table.
export function calculateFees({ passportType = 'ordinary', service = 'normal', lost = 'none', alterations = 0, certifiedCopies = 0, arabic = 0, courier = 0 } = {}) {
  const passport = fees.passports.find((p) => p.key === passportType);
  const fine = fees.lostFines.find((f) => f.key === lost);
  if (!passport || !fine || !['normal', 'urgent', 'none'].includes(service)) {
    const err = new Error('Invalid selection.');
    err.status = 400;
    throw err;
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
  return {
    lines,
    total,
    delivery: service === 'urgent' ? fees.delivery.urgent : service === 'normal' ? fees.delivery.normal : null,
    notes: [
      ...(service === 'urgent' ? ['Urgent service is available at the Head Office, Battaramulla only.'] : []),
      ...(fine.amount ? ['The fine applies only if the lost passport was still valid.'] : []),
      'Our own calculation from the official fee table – confirm at the counter.',
    ],
    lastChecked: LAST_CHECKED,
  };
}

export function feesTable() {
  return { fees, source: { ...sources.issue, lastChecked: LAST_CHECKED } };
}
