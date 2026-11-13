import { auth } from './firebase.js';
import { cases, categories, contacts, forms, gaps, offices, sources, LAST_CHECKED, SITE_LAST_UPDATE } from './data/passport.js';
import * as lic from './data/license.js';
import { calculateFees, feesTable } from './lib/fees.js';
import { askAssistant } from './lib/assistant.js';
import { listJourneys, getJourney, saveJourney, deleteJourney } from './lib/journeys.js';
import { localizeCase, localizeCategories, localizeForms, localizeOffices, localizeContacts, localizeGaps } from './lib/localize.js';

export class ApiError extends Error {
  constructor(message, status, fields) {
    super(message);
    this.status = status;
    this.fields = fields || {};
  }
}

const withSource = (c, srcMap) => ({ ...c, source: { ...srcMap[c.source], lastChecked: LAST_CHECKED } });
const summary = ({ id, number, category, title, summary, where, fee, duration }) =>
  ({ id, number, category, title, summary, where, fee, duration });

function requireUid() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new ApiError('Please sign in to continue.', 401);
  return uid;
}

function casesList(allCases, query, lang) {
  let list = allCases.map((c) => localizeCase(c, lang));
  if (query.category) list = list.filter((c) => c.category.includes(query.category));
  if (query.q) {
    const needle = query.q.toLowerCase();
    list = list.filter((c) => [c.title, c.summary, ...c.keywords].join(' ').toLowerCase().includes(needle));
  }
  return { cases: list.map(summary), lastChecked: LAST_CHECKED };
}

// Mirrors the previous HTTP api(path, { method, body }) contract so every page
// component keeps working unchanged, now backed by local data + Firestore
// instead of an Express server. `lang` (si/ta/en) localizes passport content.
export async function api(path, { method = 'GET', body } = {}) {
  try {
    const [route, qs] = path.split('?');
    const query = Object.fromEntries(new URLSearchParams(qs || ''));
    const lang = query.lang || body?.lang || 'en';

    if (route === '/passport/meta' && method === 'GET') {
      return { lastChecked: LAST_CHECKED, siteLastUpdate: SITE_LAST_UPDATE, sources, gaps: localizeGaps(gaps, lang), categories: localizeCategories(categories, lang), totalCases: cases.length };
    }
    if (route === '/passport/cases' && method === 'GET') return casesList(cases, query, lang);
    const caseMatch = route.match(/^\/passport\/cases\/([^/]+)$/);
    if (caseMatch && method === 'GET') {
      const found = cases.find((c) => c.id === caseMatch[1]);
      if (!found) throw new ApiError('Case not found.', 404);
      const { keywords, ...rest } = withSource(localizeCase(found, lang), sources);
      return { case: rest };
    }
    if (route === '/passport/fees' && method === 'GET') return feesTable(lang);
    if (route === '/passport/fees/calculate' && method === 'POST') {
      try { return calculateFees(body, lang); } catch (e) { throw new ApiError(e.message, e.status || 400); }
    }
    if (route === '/passport/forms' && method === 'GET') return { forms: localizeForms(forms, lang), downloads: sources.downloads, lastChecked: LAST_CHECKED };
    if (route === '/passport/offices' && method === 'GET') return { offices: localizeOffices(offices, lang), map: sources.map, lastChecked: LAST_CHECKED };
    if (route === '/passport/contacts' && method === 'GET') return { contacts: localizeContacts(contacts, lang), source: sources.contact, lastChecked: LAST_CHECKED };

    // Driving licence service — same shape as /passport/* above.
    if (route === '/license/meta' && method === 'GET') {
      return { lastChecked: lic.LAST_CHECKED, gaps: localizeGaps(lic.gaps, lang), categories: localizeCategories(lic.categories, lang), totalCases: lic.cases.length, vehicleClasses: lic.vehicleClasses };
    }
    if (route === '/license/cases' && method === 'GET') return casesList(lic.cases, query, lang);
    const licCaseMatch = route.match(/^\/license\/cases\/([^/]+)$/);
    if (licCaseMatch && method === 'GET') {
      const found = lic.cases.find((c) => c.id === licCaseMatch[1]);
      if (!found) throw new ApiError('Case not found.', 404);
      const { keywords, ...rest } = withSource(localizeCase(found, lang), lic.sources);
      return { case: rest };
    }
    if (route === '/license/fees' && method === 'GET') return { fees: lic.fees, source: { ...lic.sources.charges, lastChecked: lic.LAST_CHECKED } };
    if (route === '/license/offices' && method === 'GET') return { offices: lic.offices, source: lic.sources.contact, lastChecked: lic.LAST_CHECKED };
    if (route === '/license/contacts' && method === 'GET') return { contacts: lic.contacts, source: lic.sources.contact, lastChecked: lic.LAST_CHECKED };

    if (route === '/assistant/ask' && method === 'POST') {
      const question = String(body?.question || '').trim().slice(0, 500);
      if (question.length < 3) throw new ApiError('Please type your question.', 400);
      return askAssistant(question, auth.currentUser?.uid ?? null);
    }

    // Journeys: /journeys (passport, legacy path) and /license/journeys share the same
    // backing store, namespaced by service inside lib/journeys.js.
    const journeysService = route.startsWith('/license/journeys') ? 'license' : 'passport';
    const journeysBase = journeysService === 'license' ? '/license/journeys' : '/journeys';
    if (route === journeysBase && method === 'GET') return { journeys: await listJourneys(requireUid(), lang, journeysService) };
    const journeyMatch = route === journeysBase ? null : route.match(new RegExp(`^${journeysBase}/([^/]+)$`));
    if (journeyMatch) {
      const uid = requireUid();
      const caseId = journeyMatch[1];
      if (method === 'GET') return { journey: await getJourney(uid, caseId, lang, journeysService) };
      if (method === 'PUT') return { journey: await saveJourney(uid, caseId, body?.steps || [], body?.docs || [], lang, journeysService) };
      if (method === 'DELETE') { await deleteJourney(uid, caseId, journeysService); return { ok: true }; }
    }

    throw new ApiError('Not found.', 404);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || 'Something went wrong.', err.status || 500);
  }
}

export const lkr = (n) => `LKR ${Number(n).toLocaleString('en-LK')}`;
