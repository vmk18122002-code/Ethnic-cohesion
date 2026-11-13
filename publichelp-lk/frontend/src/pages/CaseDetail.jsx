import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, AlertTriangle, Info, ChevronDown, PhoneCall, RotateCcw, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../api.js';
import { Loader, Page, ProgressRing, SourceBox } from '../components/ui.jsx';
import { useLang } from '../context/LangContext.jsx';

export default function CaseDetail() {
  const { id } = useParams();
  const { t, lang } = useLang();
  const [data, setData] = useState(null);
  const [steps, setSteps] = useState([]);
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState('idle'); // idle | saving | saved
  const [openSpecial, setOpenSpecial] = useState(null);
  const timer = useRef();

  useEffect(() => {
    setData(null);
    Promise.all([api(`/passport/cases/${id}?lang=${lang}`), api(`/journeys/${id}?lang=${lang}`)])
      .then(([c, j]) => {
        setData(c.case);
        setSteps(j.journey?.steps || c.case.steps.map(() => false));
        setDocs(j.journey?.docs || c.case.documents.map(() => false));
      })
      .catch((e) => setError(e.message));
    return () => clearTimeout(timer.current);
  }, [id, lang]);

  const persist = (nextSteps, nextDocs) => {
    setSaving('saving');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      api(`/journeys/${id}?lang=${lang}`, { method: 'PUT', body: { steps: nextSteps, docs: nextDocs } })
        .then(() => setSaving('saved'))
        .catch(() => setSaving('idle'));
    }, 450);
  };
  const toggleStep = (i) => { const n = steps.map((v, k) => (k === i ? !v : v)); setSteps(n); persist(n, docs); };
  const toggleDoc = (i) => { const n = docs.map((v, k) => (k === i ? !v : v)); setDocs(n); persist(steps, n); };
  const reset = () => { const s = steps.map(() => false); const d = docs.map(() => false); setSteps(s); setDocs(d); persist(s, d); };

  if (error) return <Page><div className="alert alert-error">{error}</div><Link to="/app/cases" className="btn btn-ghost mt-16"><ArrowLeft size={16} /> {t('backToCases')}</Link></Page>;
  if (!data) return <Loader />;

  const total = steps.length + docs.length;
  const done = steps.filter(Boolean).length + docs.filter(Boolean).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <Page>
      <Link to="/app/cases" className="row muted small" style={{ fontWeight: 600, marginBottom: 16 }}><ArrowLeft size={16} /> {t('backToCases')}</Link>
      <motion.div className="detail-hero" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="pill pill-dark">{t('caseWord')} {data.number}</span>
        <h2>{data.title}</h2>
        <p>{data.summary}</p>
        <div className="detail-facts">
          <div><span>{t('factWhere')}</span><b>{data.where}</b></div>
          <div><span>{t('factFee')}</span><b>{data.fee}</b></div>
          <div><span>{t('factTime')}</span><b>{data.duration}</b></div>
        </div>
      </motion.div>

      <div className="detail-layout">
        <div className="stack gap-24">
          {data.warnings?.map((w) => (
            <motion.div key={w} className="alert alert-warn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><AlertTriangle size={18} /> {w}</motion.div>
          ))}

          <section className="card card-pad">
            <div className="section-title" style={{ marginTop: 0 }}>
              <h3>{t('stepByStep')}</h3>
              <span className="muted small">{t('tapStep')}</span>
            </div>
            <div className="timeline">
              {data.steps.map((s, i) => (
                <motion.div key={i} className={`t-step ${steps[i] ? 'done' : ''}`} onClick={() => toggleStep(i)}
                  role="checkbox" aria-checked={!!steps[i]} tabIndex={0} onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), toggleStep(i))}
                  initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <motion.div className="t-check" whileTap={{ scale: 0.85 }}>
                    <AnimatePresence mode="wait" initial={false}>
                      {steps[i]
                        ? <motion.span key="c" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}><Check size={18} strokeWidth={3} /></motion.span>
                        : <motion.span key="n" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>{i + 1}</motion.span>}
                    </AnimatePresence>
                  </motion.div>
                  <div>
                    <div className="t-text">{s.text}</div>
                    {s.detail && <div className="t-detail">{s.detail}</div>}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="card card-pad">
            <div className="section-title" style={{ marginTop: 0 }}>
              <h3>{t('docsChecklist')}</h3>
              <span className="muted small">{t('bringOriginals')}</span>
            </div>
            {data.documents.map((d, i) => (
              <div key={d.name} className={`doc-item ${docs[i] ? 'done' : ''}`} onClick={() => toggleDoc(i)} role="checkbox" aria-checked={!!docs[i]} tabIndex={0}
                onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), toggleDoc(i))}>
                <motion.div className="doc-box" animate={{ scale: docs[i] ? [1, 1.25, 1] : 1 }}>{docs[i] && <Check size={14} strokeWidth={3} />}</motion.div>
                <div><div className="doc-name">{d.name}</div>{d.note && <div className="muted small">{d.note}</div>}</div>
              </div>
            ))}
          </section>

          {data.special && (
            <section className="card card-pad">
              <div className="section-title" style={{ marginTop: 0 }}><h3>{t('specialSituations')}</h3></div>
              {data.special.map((s, i) => (
                <div key={s.situation} style={{ borderBottom: i < data.special.length - 1 ? '1px solid var(--line)' : 0 }}>
                  <button onClick={() => setOpenSpecial(openSpecial === i ? null : i)} className="row" style={{ width: '100%', border: 0, background: 'none', padding: '14px 4px', justifyContent: 'space-between', fontWeight: 600, textAlign: 'left' }} aria-expanded={openSpecial === i}>
                    {s.situation}
                    <motion.span animate={{ rotate: openSpecial === i ? 180 : 0 }}><ChevronDown size={18} /></motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openSpecial === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                        <p className="muted" style={{ padding: '0 4px 14px' }}>{s.docs}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </section>
          )}

          {data.notes?.map((n) => <div key={n} className="alert alert-info"><Info size={18} /> {n}</div>)}
        </div>

        <aside className="sticky-col">
          <div className="card card-pad" style={{ textAlign: 'center' }}>
            <ProgressRing value={pct} label={t('done')} />
            <div className="mt-16" style={{ fontWeight: 700 }}>{done} {t('of')} {total} {t('done')}</div>
            <div className="row small muted mt-8" style={{ justifyContent: 'center', minHeight: 20 }}>
              {saving === 'saving' && <><Loader2 size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> {t('saving')}</>}
              {saving === 'saved' && <><CheckCircle2 size={14} color="var(--blue-600)" /> {t('savedToAccount')}</>}
            </div>
            <button className="btn btn-ghost btn-sm mt-16" onClick={reset}><RotateCcw size={14} /> {t('resetProgress')}</button>
          </div>
          <SourceBox source={data.source} />
          <div className="card card-pad" style={{ background: 'var(--ink)', color: '#fff', borderColor: 'var(--ink)' }}>
            <b>{t('notClearTitle')}</b>
            <p className="small" style={{ color: 'var(--muted-dark)', marginTop: 6 }}>{t('notClearBody')}</p>
            <a href="tel:1962" className="btn btn-primary btn-block mt-16"><PhoneCall size={16} /> {t('callHotline')}</a>
          </div>
        </aside>
      </div>
    </Page>
  );
}
