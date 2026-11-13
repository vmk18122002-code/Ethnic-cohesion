import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Route, Trash2, ArrowRight } from 'lucide-react';
import { api } from '../api.js';
import { Page, ProgressBar, formatDate } from '../components/ui.jsx';
import { useLang } from '../context/LangContext.jsx';

export default function Journeys() {
  const { t, lang } = useLang();
  const [list, setList] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { api(`/journeys?lang=${lang}`).then((d) => setList(d.journeys)).catch((e) => setError(e.message)); }, [lang]);

  const remove = async (caseId) => {
    setList((l) => l.filter((j) => j.caseId !== caseId));
    try { await api(`/journeys/${caseId}`, { method: 'DELETE' }); } catch (e) { setError(e.message); }
  };

  return (
    <Page>
      <p className="muted" style={{ marginBottom: 20 }}>{t('journeysIntro')}</p>
      {error && <div className="alert alert-error">{error}</div>}
      {list === null && !error && <div className="grid"><div className="skeleton" style={{ height: 96 }} /><div className="skeleton" style={{ height: 96 }} /></div>}
      {list?.length === 0 && (
        <motion.div className="card coming" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="icon-tile"><Route size={32} /></div>
          <h2 style={{ fontSize: 22 }}>{t('noJourneysTitle')}</h2>
          <p className="muted mt-8">{t('journeysEmptyBody')}</p>
          <Link to="/app/cases" className="btn btn-primary mt-24">{t('browseCases')} <ArrowRight size={16} /></Link>
        </motion.div>
      )}
      <div className="grid" style={{ gap: 12 }}>
        <AnimatePresence>
          {list?.map((j, i) => (
            <motion.div key={j.caseId} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }} exit={{ opacity: 0, x: 60 }}>
              <div className="card card-pad row gap-16 hover-lift">
                <div className="case-num">{j.number}</div>
                <div className="grow" style={{ minWidth: 0 }}>
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <b>{j.title}</b><span style={{ fontWeight: 800, color: 'var(--blue-600)' }}>{j.progress}%</span>
                  </div>
                  <div className="mt-8"><ProgressBar value={j.progress} /></div>
                  <div className="muted small mt-8">
                    {j.steps.filter(Boolean).length}/{j.steps.length} {t('stepsWord')} · {j.docs.filter(Boolean).length}/{j.docs.length} {t('documentsWord')} · {t('updated')} {formatDate(j.updatedAt)}
                  </div>
                </div>
                <Link to={`/app/cases/${j.caseId}`} className="btn btn-primary btn-sm">{t('continueWord')}</Link>
                <button className="icon-btn" onClick={() => remove(j.caseId)} aria-label={`Delete journey ${j.title}`} title="Delete"><Trash2 size={16} /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Page>
  );
}
