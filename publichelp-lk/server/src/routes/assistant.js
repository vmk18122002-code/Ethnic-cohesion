import { Router } from 'express';
import { db } from '../db.js';
import { optionalAuth } from '../middleware/auth.js';
import { cases, sources, LAST_CHECKED } from '../data/passport.js';

// Task-oriented guidance (proposal steps 1-5):
// 1 ask a real-life question -> 2 detect goal + language -> 3 retrieve official evidence
// -> 4 present a clear sequence -> 5 link to the responsible agency.
// This is a transparent rule-based matcher; it can later be swapped for an LLM + retrieval
// pipeline, as long as answers still come only from the verified case data.

const router = Router();

function detectLanguage(text) {
  if (/[඀-෿]/.test(text)) return 'si';
  if (/[஀-௿]/.test(text)) return 'ta';
  return 'en';
}

// Concept words in Sinhala and Tamil, mapped onto English signal words.
const CONCEPTS = {
  lost: ['lost', 'stolen', 'missing', 'නැති', 'සොරකම්', 'தொலை', 'திருட'],
  abroad: [
    'abroad', 'overseas', 'embassy', 'consulate', 'high commission', 'mission', 'outside sri lanka', 'foreign country',
    // Common destinations for Sri Lankan workers and students
    'dubai', 'uae', 'abu dhabi', 'qatar', 'doha', 'kuwait', 'saudi', 'riyadh', 'oman', 'bahrain', 'jordan', 'israel', 'maldives',
    'india', 'singapore', 'malaysia', 'japan', 'korea', 'australia', 'new zealand', 'canada', 'usa', 'america',
    'uk', 'london', 'england', 'italy', 'france', 'germany', 'cyprus', 'romania', 'poland',
    'විදේශ', 'තානාපති', 'ඩුබායි', 'කටාර්', 'කුවේට්', 'වෙනත් රට', 'வெளிநாடு', 'தூதரக', 'துபா', 'கட்டார்', 'குவைத்',
  ],
  child: ['child', 'baby', 'son', 'daughter', 'kid', 'minor', 'ළමා', 'දරුව', 'බබා', 'குழந்தை', 'மகன்', 'மகள்'],
  urgent: ['urgent', 'same day', 'one day', 'one-day', 'today', 'tomorrow', 'quick', 'fast', 'හදිසි', 'அவசர'],
  new: ['new', 'renew', 'expired', 'first passport', 'අලුත්', 'නව', 'අලුත් කිරීම', 'புதிய', 'புதுப்பி'],
  amend: ['change', 'amend', 'alter', 'correct', 'වෙනස්', 'නිවැරදි', 'மாற்ற', 'திருத்த'],
};

// English words must start at a word boundary ("son" should not match "person");
// Sinhala / Tamil stems are matched anywhere because they take suffixes.
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const matchWord = (text, w) => (/^[\x00-\x7F]+$/.test(w) ? new RegExp(`\\b${escapeRe(w)}`).test(text) : text.includes(w));
const has = (text, words) => words.some((w) => matchWord(text, w));

// The question must be about passports at all; otherwise we do not guess (safety rule).
const DOMAIN = ['passport', 'travel document', 'nmrp', 'fingerprint', 'immigration', 'k 35', 'identification certificate',
  'ගමන් බලපත්', 'පාස්පෝට්', 'கடவுச்சீட்டு', 'கடவுச் சீட்டு', 'பாஸ்போர்ட்'];

function score(text) {
  const signal = Object.fromEntries(Object.entries(CONCEPTS).map(([k, words]) => [k, has(text, words)]));
  const scores = cases.map((c) => {
    let s = 0;
    for (const kw of c.keywords) if (matchWord(text, kw)) s += kw.includes(' ') ? 3 : 2;
    return { c, s };
  });
  const bump = (id, n) => { const row = scores.find((x) => x.c.id === id); row.s += n; };

  if (signal.lost && signal.abroad) bump('lost-abroad', 6);
  else if (signal.lost) bump('lost-sri-lanka', 4);
  if (signal.child) bump('child', 4);
  if (signal.urgent && !signal.lost) bump('urgent', 3);
  if (signal.abroad && !signal.lost) bump('overseas-application', 3);
  if (signal.amend) bump('amendments', 3);
  if (signal.new && !signal.child && !signal.abroad && !signal.lost) bump('ordinary-normal', 2);

  return scores.sort((a, b) => b.s - a.s);
}

router.post('/ask', optionalAuth, (req, res) => {
  const question = String(req.body?.question || '').trim().slice(0, 500);
  if (question.length < 3) return res.status(400).json({ error: 'Please type your question.' });

  const language = detectLanguage(question);
  const text = question.toLowerCase();
  const ranked = has(text, DOMAIN) ? score(text) : cases.map((c) => ({ c, s: 0 }));
  const [top, second] = ranked;

  db.prepare('INSERT INTO questions (user_id, question, language, matched) VALUES (?, ?, ?, ?)').run(
    req.userId ?? null, question, language, top.s > 0 ? top.c.id : null
  );

  if (top.s === 0) {
    return res.json({
      language,
      match: null,
      message: "We could not find confirmed official guidance for this question. To be safe, please contact the Department of Immigration and Emigration on 1962.",
      lastChecked: LAST_CHECKED,
    });
  }

  const confidence = top.s >= 6 && top.s >= second.s * 1.5 ? 'high' : 'medium';
  const c = top.c;
  res.json({
    language,
    confidence,
    match: {
      id: c.id,
      number: c.number,
      title: c.title,
      summary: c.summary,
      where: c.where,
      fee: c.fee,
      duration: c.duration,
      steps: c.steps.slice(0, 4).map((s) => s.text),
      totalSteps: c.steps.length,
      source: { ...sources[c.source], lastChecked: LAST_CHECKED },
    },
    alternatives: ranked.slice(1, 3).filter((r) => r.s > 0).map((r) => ({ id: r.c.id, number: r.c.number, title: r.c.title })),
  });
});

export default router;
