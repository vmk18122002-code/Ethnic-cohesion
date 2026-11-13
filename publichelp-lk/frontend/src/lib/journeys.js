import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { cases as passportCases } from '../data/passport.js';
import { cases as licenseCases } from '../data/license.js';
import { localizeCase } from './localize.js';

// A "journey" is a citizen's personal progress through one case (passport or
// driving licence): which steps they have completed and which documents they
// have ready. Stored per-user in Firestore at users/{uid}/journeys/{docId}.
// Passport journeys keep their original unprefixed docId for backward
// compatibility with progress saved before the licence service existed;
// every other service is prefixed "{service}:{caseId}" to avoid collisions.

const DATASETS = { passport: passportCases, license: licenseCases };
const caseById = (service, id) => (DATASETS[service] || passportCases).find((c) => c.id === id);
const docId = (service, caseId) => (service === 'passport' ? caseId : `${service}:${caseId}`);

const journeysRef = (uid) => collection(db, 'users', uid, 'journeys');
const journeyRef = (uid, service, caseId) => doc(db, 'users', uid, 'journeys', docId(service, caseId));

function shape(service, caseId, row, lang) {
  const c = localizeCase(caseById(service, caseId), lang);
  const steps = row.steps || [];
  const docs = row.docs || [];
  const total = c.steps.length + c.documents.length;
  const done = steps.filter(Boolean).length + docs.filter(Boolean).length;
  return {
    caseId,
    service,
    number: c.number,
    title: c.title,
    steps,
    docs,
    progress: total ? Math.round((done / total) * 100) : 0,
    updatedAt: row.updatedAt,
  };
}

function parseDocId(id) {
  const i = id.indexOf(':');
  return i === -1 ? { service: 'passport', caseId: id } : { service: id.slice(0, i), caseId: id.slice(i + 1) };
}

export async function listJourneys(uid, lang = 'en', service = null) {
  const snap = await getDocs(journeysRef(uid));
  return snap.docs
    .map((d) => ({ id: d.id, ...parseDocId(d.id), data: d.data() }))
    .filter((d) => (!service || d.service === service) && caseById(d.service, d.caseId))
    .map((d) => shape(d.service, d.caseId, d.data, lang))
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
}

export async function getJourney(uid, caseId, lang = 'en', service = 'passport') {
  if (!caseById(service, caseId)) { const e = new Error('Case not found.'); e.status = 404; throw e; }
  const snap = await getDoc(journeyRef(uid, service, caseId));
  return snap.exists() ? shape(service, caseId, snap.data(), lang) : null;
}

export async function saveJourney(uid, caseId, steps, docs, lang = 'en', service = 'passport') {
  const c = caseById(service, caseId);
  if (!c) { const e = new Error('Case not found.'); e.status = 404; throw e; }
  const clean = (arr, len) => Array.from({ length: len }, (_, i) => Boolean(Array.isArray(arr) && arr[i]));
  const row = { steps: clean(steps, c.steps.length), docs: clean(docs, c.documents.length), updatedAt: new Date().toISOString() };
  await setDoc(journeyRef(uid, service, caseId), row);
  return shape(service, caseId, row, lang);
}

export async function deleteJourney(uid, caseId, service = 'passport') {
  await deleteDoc(journeyRef(uid, service, caseId));
}
