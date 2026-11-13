import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hourglass, ArrowRight, ArrowLeft } from 'lucide-react';
import { Page } from '../components/ui.jsx';
import { useLang } from '../context/LangContext.jsx';

const NAME_KEYS = {
  'birth-certificate': 'navBirth',
  nic: 'navNic',
  'driving-licence': 'navDriving',
  'police-clearance': 'navPolice',
};

export function ComingSoon() {
  const { slug } = useParams();
  const { t } = useLang();
  return (
    <Page>
      <motion.div className="card coming" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
        <motion.div className="icon-tile dark" animate={{ rotate: [0, 180, 180, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <Hourglass size={34} />
        </motion.div>
        <span className="pill">{t('comingSoon')}</span>
        <h2 style={{ fontSize: 28, marginTop: 14 }}>{NAME_KEYS[slug] ? t(NAME_KEYS[slug]) : 'This service'}</h2>
        <p className="muted mt-8" style={{ maxWidth: 520, margin: '8px auto 0' }}>
          {t('comingSoonBody')}
        </p>
        <Link to="/app/cases" className="btn btn-primary mt-24">{t('goToGuide')} <ArrowRight size={16} /></Link>
      </motion.div>
    </Page>
  );
}

export function NotFound() {
  const { t } = useLang();
  return (
    <div className="notfound dark">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="gradient-text">404</h1>
        <p style={{ color: 'var(--muted-dark)', marginBottom: 24 }}>{t('notFoundTitle')}</p>
        <Link to="/" className="btn btn-primary"><ArrowLeft size={16} /> {t('backHome')}</Link>
      </motion.div>
    </div>
  );
}
