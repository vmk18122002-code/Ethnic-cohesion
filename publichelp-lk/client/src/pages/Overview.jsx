import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BadgePlus, Baby, SearchX, Plane, MessageCircleQuestion, Route, Info, Clock, CalendarCheck, Calculator } from 'lucide-react';
import { api } from '../api.js';
import { Page, ProgressBar, fadeUp, stagger, formatDate } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';

const ACTIONS = [
  { key: 'newPassport', icon: BadgePlus, to: '/app/cases?category=new', text: 'Ordinary, urgent, dual citizen' },
  { key: 'child', icon: Baby, to: '/app/cases?category=child', text: 'Separate passport for under-16s' },
  { key: 'lost', icon: SearchX, to: '/app/cases?category=lost', text: 'Report, cancel and replace' },
  { key: 'abroad', icon: Plane, to: '/app/cases?category=abroad', text: 'Apply through a Mission' },
];

export default function Overview() {
  const { user } = useAuth();
  const { t } = useLang();
  const [journeys, setJourneys] = useState(null);
  const [offices, setOffices] = useState(null);

  useEffect(() => {
    api('/journeys').then((d) => setJourneys(d.journeys)).catch(() => setJourneys([]));
    api('/passport/offices').then((d) => setOffices(d.offices)).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Page>
      <motion.div className="welcome" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
        <span className="pill pill-dark"><CalendarCheck size={13} /> Passport data checked 12 Nov 2026</span>
        <h2 className="mt-16">{greet}, {user.fullName.split(' ')[0]} 👋</h2>
        <p>What do you need to do today? Pick a task below or ask a question in your own words — in Sinhala, Tamil or English.</p>
        <div className="row wrap mt-24">
          <Link to="/app/assistant" className="btn btn-primary"><MessageCircleQuestion size={17} /> Ask the assistant</Link>
          <Link to="/app/fees" className="btn btn-ghost-dark"><Calculator size={17} /> Calculate fees</Link>
        </div>
      </motion.div>

      <motion.div className="grid grid-4 mt-24" variants={stagger(0.08)} initial="hidden" animate="show">
        {ACTIONS.map((a) => (
          <motion.div key={a.key} variants={fadeUp}>
            <Link to={a.to} className="card action-card hover-lift" style={{ height: '100%' }}>
              <div className="icon-tile"><a.icon size={22} /></div>
              <div><h4>{t(a.key)}</h4><p className="muted small mt-8">{a.text}</p></div>
              <span className="go">View steps <ArrowRight size={15} /></span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="detail-layout" style={{ gridTemplateColumns: 'minmax(0,1fr) 360px' }}>
        <div>
          <div className="section-title" style={{ marginTop: 8 }}>
            <h3>My journeys</h3>
            <Link to="/app/journeys" className="link small">See all</Link>
          </div>
          {journeys === null ? (
            <div className="grid"><div className="skeleton" style={{ height: 88 }} /><div className="skeleton" style={{ height: 88 }} /></div>
          ) : journeys.length === 0 ? (
            <div className="card card-pad" style={{ textAlign: 'center' }}>
              <div className="icon-tile" style={{ margin: '0 auto 14px' }}><Route size={22} /></div>
              <h4>No journeys yet</h4>
              <p className="muted small mt-8">Open any passport case and tick steps or documents — your progress is saved here.</p>
              <Link to="/app/cases" className="btn btn-primary btn-sm mt-16">Browse passport cases</Link>
            </div>
          ) : (
            <motion.div className="grid" style={{ gap: 12 }} variants={stagger(0.06)} initial="hidden" animate="show">
              {journeys.slice(0, 4).map((j) => (
                <motion.div key={j.caseId} variants={fadeUp}>
                  <Link to={`/app/cases/${j.caseId}`} className="card card-pad hover-lift row gap-16" style={{ display: 'flex' }}>
                    <div className="case-num">{j.number}</div>
                    <div className="grow" style={{ minWidth: 0 }}>
                      <div className="row" style={{ justifyContent: 'space-between' }}>
                        <b style={{ fontSize: 15 }}>{j.title}</b>
                        <span className="small" style={{ fontWeight: 700, color: 'var(--blue-600)' }}>{j.progress}%</span>
                      </div>
                      <div className="mt-8"><ProgressBar value={j.progress} /></div>
                      <div className="muted small mt-8">Updated {formatDate(j.updatedAt)}</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="stack gap-16">
          <div className="section-title" style={{ marginTop: 8 }}><h3>Good to know</h3></div>
          <div className="card card-pad">
            <div className="row" style={{ fontWeight: 700, marginBottom: 12 }}><Info size={17} color="var(--blue-600)" /> Important points</div>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 8 }} className="small">
              {(offices?.general || []).map((g) => <li key={g}>{g}</li>)}
            </ul>
          </div>
          <div className="card card-pad">
            <div className="row" style={{ fontWeight: 700, marginBottom: 12 }}><Clock size={17} color="var(--blue-600)" /> Head Office hours</div>
            {(offices?.hours || []).filter((h) => h.office === 'Head Office').map((h) => (
              <div key={h.service} className="row small" style={{ justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line)' }}>
                <span className="muted">{h.service}</span><b>{h.hours}</b>
              </div>
            ))}
            <Link to="/app/offices" className="link small mt-16" style={{ display: 'inline-block' }}>All offices →</Link>
          </div>
        </div>
      </div>
    </Page>
  );
}
