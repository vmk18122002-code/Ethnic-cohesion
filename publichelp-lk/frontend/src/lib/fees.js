import { fees, sources, LAST_CHECKED } from '../data/passport.js';
import { localizeFees } from './localize.js';

const NOTE_STRINGS = {
  en: { urgent: 'Urgent service is available at the Head Office, Battaramulla only.', fine: 'The fine applies only if the lost passport was still valid.', own: 'Our own calculation from the official fee table – confirm at the counter.' },
  si: { urgent: 'හදිසි සේවාව ලබාගත හැක්කේ බත්තරමුල්ල ප්‍රධාන කාර්යාලයේදී පමණි.', fine: 'දඩය අදාළ වන්නේ නැතිවූ ගමන් බලපත්‍රය තවමත් වලංගු නම් පමණි.', own: 'මෙය නිල ගාස්තු වගුවෙන් අප විසින්ම කළ ගණනයකි – කවුන්ටරයේදී තහවුරු කරගන්න.' },
  ta: { urgent: 'அவசர சேவை தலைமை அலுவலகம், பத்தரமுல்லவில் மட்டுமே கிடைக்கும்.', fine: 'தொலைந்த கடவுச்சீட்டு இன்னும் செல்லுபடியாகியிருந்தால் மட்டுமே அபராதம் பொருந்தும்.', own: 'இது அதிகாரபூர்வ கட்டண அட்டவணையிலிருந்து எங்கள் சொந்த கணக்கீடு – கவுண்டரில் உறுதிப்படுத்தவும்.' },
};

// Fee calculator: everything is computed from the verified fee table.
export function calculateFees({ passportType = 'ordinary', service = 'normal', lost = 'none', alterations = 0, certifiedCopies = 0, arabic = 0, courier = 0 } = {}, lang = 'en') {
  const localized = localizeFees(fees, lang);
  const passport = localized.passports.find((p) => p.key === passportType);
  const fine = localized.lostFines.find((f) => f.key === lost);
  if (!passport || !fine || !['normal', 'urgent', 'none'].includes(service)) {
    const err = new Error('Invalid selection.');
    err.status = 400;
    throw err;
  }
  const count = (n) => Math.max(0, Math.min(20, Math.floor(Number(n) || 0)));
  const svc = Object.fromEntries(localized.services.map((s) => [s.key, s]));

  const lines = [];
  if (service !== 'none') lines.push({ label: `${passport.label} – ${service}`, amount: passport[service] });
  if (fine.amount) lines.push({ label: `${lang === 'en' ? 'Fine' : ''}: ${fine.label.toLowerCase()}`.trim(), amount: fine.amount });
  const extras = [['alteration', alterations], ['certifiedCopy', certifiedCopies], ['arabic', arabic], ['courier', courier]];
  for (const [key, n] of extras) {
    const qty = count(n);
    if (qty) lines.push({ label: `${svc[key].label} × ${qty}`, amount: svc[key].amount * qty });
  }
  const total = lines.reduce((sum, l) => sum + l.amount, 0);
  const strings = NOTE_STRINGS[lang] || NOTE_STRINGS.en;
  return {
    lines,
    total,
    delivery: service === 'urgent' ? localized.delivery.urgent : service === 'normal' ? localized.delivery.normal : null,
    notes: [
      ...(service === 'urgent' ? [strings.urgent] : []),
      ...(fine.amount ? [strings.fine] : []),
      strings.own,
    ],
    lastChecked: LAST_CHECKED,
  };
}

export function feesTable(lang = 'en') {
  return { fees: localizeFees(fees, lang), source: { ...sources.issue, lastChecked: LAST_CHECKED } };
}
