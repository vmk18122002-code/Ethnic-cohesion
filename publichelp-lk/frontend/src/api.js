import { auth } from './firebase.js';
import { cases, categories, contacts, forms, gaps, offices, sources, LAST_CHECKED, SITE_LAST_UPDATE } from './data/passport.js';
import { calculateFees, feesTable } from './lib/fees.js';
import { askAssistant } from './lib/assistant.js';
import { listJourneys, getJourney, saveJourney, deleteJourney } from './lib/journeys.js';

export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message);
    this.status = status;
    this.fields = fields || {};
  }
}

const withSource = (c) => ({ ...c, source: { ...sources[c.source], lastChecked: LAST_CHECKED } });
const summary = ({ id, number, category, title, summary, where, fee, duration }) =>
  ({ id, number, category, title, summary, where, fee, duration });

function requireUid() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new ApiError('Please sign in to continue.', 401);
  return uid;
}

// Mirrors the previous HTTP api(path, { method, body }) contract so every page
// component keeps working unchanged, now backed by local data + Firestore
// instead of an Express server.
export async function api(path, { method = 'GET', body } = {}) {
  try {
    const [route, qs] = path.split('?');
    const query = Object.fromEntries(new URLSearchParams(qs || ''));

    if (route === '/passport/meta' && method === 'GET') {
      return { lastChecked: LAST_CHECKED, siteLastUpdate: SITE_LAST_UPDATE, sources, gaps, categories, totalCases: cases.length };
    }
    if (route === '/passport/cases' && method === 'GET') {
      let list = cases;
      if (query.category) list = list.filter((c) => c.category.includes(query.category));
      if (query.q) {
        const needle = query.q.toLowerCase();
        list = list.filter((c) => [c.title, c.summary, ...c.keywords].join(' ').toLowerCase().includes(needle));
      }
      return { cases: list.map(summary), lastChecked: LAST_CHECKED };
    }
    const caseMatch = route.match(/^\/passport\/cases\/([^/]+)$/);
    if (caseMatch && method === 'GET') {
      const found = cases.find((c) => c.id === caseMatch[1]);
      if (!found) throw new ApiError('Case not found.', 404);
      const { keywords, ...rest } = withSource(found);
      return { case: rest };
    }
    if (route === '/passport/fees' && method === 'GET') return feesTable();
    if (route === '/passport/fees/calculate' && method === 'POST') {
      try { return calculateFees(body); } catch (e) { throw new ApiError(e.message, e.status || 400); }
    }
    if (route === '/passport/forms' && method === 'GET') return { forms, downloads: sources.downloads, lastChecked: LAST_CHECKED };
    if (route === '/passport/offices' && method === 'GET') return { offices, map: sources.map, lastChecked: LAST_CHECKED };
    if (route === '/passport/contacts' && method === 'GET') return { contacts, source: sources.contact, lastChecked: LAST_CHECKED };

    if (route === '/assistant/ask' && method === 'POST') {
      const question = String(body?.question || '').trim().slice(0, 500);
      if (question.length < 3) throw new ApiError('Please type your question.', 400);
      return askAssistant(question, auth.currentUser?.uid ?? null);
    }

    if (route === '/journeys' && method === 'GET') return { journeys: await listJourneys(requireUid()) };
    const journeyMatch = route.match(/^\/journeys\/([^/]+)$/);
    if (journeyMatch) {
      const uid = requireUid();
      const caseId = journeyMatch[1];
      if (method === 'GET') return { journey: await getJourney(uid, caseId) };
      if (method === 'PUT') return { journey: await saveJourney(uid, caseId, body?.steps || [], body?.docs || []) };
      if (method === 'DELETE') { await deleteJourney(uid, caseId); return { ok: true }; }
    }

    throw new ApiError('Not found.', 404);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || 'Something went wrong.', err.status || 500);
  }
}

export const lkr = (n) => `LKR ${Number(n).toLocaleString('en-LK')}`;
