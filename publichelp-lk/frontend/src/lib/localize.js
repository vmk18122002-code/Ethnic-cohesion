import {
  caseTranslations, categoryTranslations, feesTranslations, formTranslations,
  officeTranslations, contactTranslations, gapsTranslations,
} from '../data/translations.js';

const merge = (base, tr) => (tr === undefined ? base : tr);

export function localizeCase(c, lang) {
  const tr = caseTranslations[lang]?.[c.id];
  if (!tr) return c;
  return {
    ...c,
    title: merge(c.title, tr.title),
    summary: merge(c.summary, tr.summary),
    where: merge(c.where, tr.where),
    duration: merge(c.duration, tr.duration),
    steps: c.steps.map((s, i) => ({ ...s, text: merge(s.text, tr.steps?.[i]?.text), detail: merge(s.detail, tr.steps?.[i]?.detail) })),
    documents: c.documents.map((d, i) => ({ ...d, name: merge(d.name, tr.documents?.[i]?.name), note: merge(d.note, tr.documents?.[i]?.note) })),
    special: c.special?.map((s, i) => ({ ...s, situation: merge(s.situation, tr.special?.[i]?.situation), docs: merge(s.docs, tr.special?.[i]?.docs) })),
    warnings: c.warnings?.map((w, i) => merge(w, tr.warnings?.[i])),
    notes: c.notes?.map((n, i) => merge(n, tr.notes?.[i])),
  };
}

export function localizeCategories(categories, lang) {
  const tr = categoryTranslations[lang];
  if (!tr) return categories;
  return categories.map((c) => ({ ...c, label: merge(c.label, tr[c.key]?.label), description: merge(c.description, tr[c.key]?.description) }));
}

export function localizeFees(fees, lang) {
  const tr = feesTranslations[lang];
  if (!tr) return fees;
  return {
    ...fees,
    passports: fees.passports.map((p) => ({ ...p, label: merge(p.label, tr.passports?.[p.key]) })),
    services: fees.services.map((s) => ({ ...s, label: merge(s.label, tr.services?.[s.key]?.label), unit: merge(s.unit, tr.services?.[s.key]?.unit), note: merge(s.note, tr.services?.[s.key]?.note) })),
    lostFines: fees.lostFines.map((f) => ({ ...f, label: merge(f.label, tr.lostFines?.[f.key]) })),
    delivery: { normal: merge(fees.delivery.normal, tr.delivery?.normal), urgent: merge(fees.delivery.urgent, tr.delivery?.urgent), alteration: merge(fees.delivery.alteration, tr.delivery?.alteration) },
    validity: fees.validity.map((v, i) => merge(v, tr.validity?.[i])),
  };
}

export function localizeForms(forms, lang) {
  const tr = formTranslations[lang];
  if (!tr) return forms;
  return forms.map((f) => ({ ...f, name: merge(f.name, tr[f.name]) }));
}

export function localizeOffices(offices, lang) {
  const tr = officeTranslations[lang];
  if (!tr) return offices;
  return {
    ...offices,
    headOffice: { ...offices.headOffice, name: merge(offices.headOffice.name, tr.headOfficeName), notes: offices.headOffice.notes.map((n, i) => merge(n, tr.headOfficeNotes?.[i])) },
    hours: offices.hours.map((h, i) => ({ ...h, office: merge(h.office, tr.hours?.[i]?.office), service: merge(h.service, tr.hours?.[i]?.service), hours: merge(h.hours, tr.hours?.[i]?.hours) })),
    general: offices.general.map((g, i) => merge(g, tr.general?.[i])),
  };
}

export function localizeContacts(contacts, lang) {
  const tr = contactTranslations[lang];
  if (!tr) return contacts;
  return contacts.map((c) => ({ ...c, label: merge(c.label, tr[c.label]) }));
}

export function localizeGaps(gaps, lang) {
  const tr = gapsTranslations[lang];
  return tr ? gaps.map((g, i) => merge(g, tr[i])) : gaps;
}
