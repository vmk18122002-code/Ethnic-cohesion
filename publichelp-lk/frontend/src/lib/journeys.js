import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import { cases } from '../data/passport.js';
import { localizeCase } from './localize.js';

// A "journey" is a citizen's personal progress through one passport case:
// which steps they have completed and which documents they have ready.
// Stored per-user in Firestore at users/{uid}/journeys/{caseId}.

const caseById = (id) => cases.find((c) => c.id === id);
const journeysRef = (uid) => collection(db, 'users', uid, 'journeys');
const journeyRef = (uid, caseId) => doc(db, 'users', uid, 'journeys', caseId);

function shape(caseId, row, lang) {
  const c = localizeCase(caseById(caseId), lang);
  const steps = row.steps || [];
  const docs = row.docs || [];
  const total = c.steps.length + c.documents.length;
  const done = steps.filter(Boolean).length + docs.filter(Boolean).length;
  return {
    caseId,
    number: c.number,
    title: c.title,
    steps,
    docs,
    progress: total ? Math.round((done / total) * 100) : 0,
    updatedAt: row.updatedAt,
  };
}

export async function listJourneys(uid, lang = 'en') {
  const snap = await getDocs(journeysRef(uid));
  return snap.docs
    .filter((d) => caseById(d.id))
    .map((d) => shape(d.id, d.data(), lang))
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
}

export async function getJourney(uid, caseId, lang = 'en') {
  if (!caseById(caseId)) { const e = new Error('Case not found.'); e.status = 404; throw e; }
  const snap = await getDoc(journeyRef(uid, caseId));
  return snap.exists() ? shape(caseId, snap.data(), lang) : null;
}

export async function saveJourney(uid, caseId, steps, docs, lang = 'en') {
  const c = caseById(caseId);
  if (!c) { const e = new Error('Case not found.'); e.status = 404; throw e; }
  const clean = (arr, len) => Array.from({ length: len }, (_, i) => Boolean(Array.isArray(arr) && arr[i]));
  const row = { steps: clean(steps, c.steps.length), docs: clean(docs, c.documents.length), updatedAt: new Date().toISOString() };
  await setDoc(journeyRef(uid, caseId), row);
  return shape(caseId, row, lang);
}

export async function deleteJourney(uid, caseId) {
  await deleteDoc(journeyRef(uid, caseId));
}
