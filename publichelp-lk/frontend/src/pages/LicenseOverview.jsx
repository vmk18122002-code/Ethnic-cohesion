import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BadgePlus, RefreshCw, SearchX, Globe2, BookOpen, Calculator, Route, Car } from 'lucide-react';
import { api } from '../api.js';
import { Page, ProgressBar, fadeUp, stagger, formatDate } from '../components/ui.jsx';
import { useLang } from '../context/LangContext.jsx';

const ACTIONS = [
  { key: 'new', icon: BadgePlus, to: '/app/license/cases?category=new' },
  { key: 'renew', icon: RefreshCw, to: '/app/license/cases?category=renew' },
  { key: 'lost', icon: SearchX, to: '/app/license/cases?category=lost' },
  { key: 'abroad', icon: Globe2, to: '/app/license/cases?category=abroad' },
];

export default function LicenseOverview() {
  const { t, lang } = useLang();
  const [meta, setMeta] = useState(null);
  const [journeys, setJourneys] = useState(null);

  useEffect(() => {
    api(`/license/meta?lang=${lang}`).then(setMeta).catch(() => {});
    api(`/license/journeys?lang=${lang}`).then((d) => setJourneys(d.journeys)).catch(() => setJourneys([]));
  }, [lang]);

  const categories = meta?.categories || [];

  return (
    <Page>
      <motion.div className="welcome" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <span className="pill pill-dark"><Car size={13} /> {t('serviceLicense')}</span>
        <h2 className="mt-16">{t('serviceLicenseDesc')}</h2>
        <div className="row wrap mt-24">
          <Link to="/app/license/cases" className="btn btn-primary"><BookOpen size={17} /> {t('openGuide')}</Link>
          <Link to="/app/license/fees" className="btn btn-ghost-dark"><Calculator size={17} /> {t('officialFeeTable')}</Link>
        </div>
      </motion.div>

      <motion.div className="grid grid-4 mt-24" variants={stagger(0.08)} initial="hidden" animate="show">
        {ACTIONS.map((a) => {
          const cat = categories.find((c) => c.key === a.key);
          return (
            <motion.div key={a.key} variants={fadeUp}>
              <Link to={a.to} className="card action-card hover-lift" style={{ height: '100%' }}>
                <div className="icon-tile"><a.icon size={22} /></div>
                <div><h4>{cat?.label || a.key}</h4><p className="muted small mt-8">{cat?.description}</p></div>
                <span className="go">{t('viewSteps')} <ArrowRight size={15} /></span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="section-title" style={{ marginTop: 8 }}>
        <h3>{t('myJourneys')}</h3>
        <Link to="/app/license/cases" className="link small">{t('seeAll')}</Link>
      </div>
      {journeys === null ? (
        <div className="grid"><div className="skeleton" style={{ height: 88 }} /></div>
      ) : journeys.length === 0 ? (
        <div className="card card-pad" style={{ textAlign: 'center' }}>
          <div className="icon-tile" style={{ margin: '0 auto 14px' }}><Route size={22} /></div>
          <h4>{t('noJourneysTitle')}</h4>
          <p className="muted small mt-8">{t('journeysEmptyBody')}</p>
          <Link to="/app/license/cases" className="btn btn-primary btn-sm mt-16">{t('openGuide')}</Link>
        </div>
      ) : (
        <motion.div className="grid" style={{ gap: 12 }} variants={stagger(0.06)} initial="hidden" animate="show">
          {journeys.slice(0, 4).map((j) => (
            <motion.div key={j.caseId} variants={fadeUp}>
              <Link to={`/app/license/cases/${j.caseId}`} className="card card-pad hover-lift row gap-16" style={{ display: 'flex' }}>
                <div className="case-num">{j.number}</div>
                <div className="grow" style={{ minWidth: 0 }}>
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <b style={{ fontSize: 15 }}>{j.title}</b>
                    <span className="small" style={{ fontWeight: 700, color: 'var(--blue-600)' }}>{j.progress}%</span>
                  </div>
                  <div className="mt-8"><ProgressBar value={j.progress} /></div>
                  <div className="muted small mt-8">{t('updated')} {formatDate(j.updatedAt)}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </Page>
  );
}
