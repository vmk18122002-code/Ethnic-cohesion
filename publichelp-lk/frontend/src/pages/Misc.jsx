import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hourglass, ArrowRight, ArrowLeft } from 'lucide-react';
import { Page } from '../components/ui.jsx';

const NAMES = {
  'birth-certificate': 'Birth certificate copy',
  nic: 'National Identity Card',
  'driving-licence': 'Driving licence',
  'police-clearance': 'Police clearance certificate',
};

export function ComingSoon() {
  const { slug } = useParams();
  return (
    <Page>
      <motion.div className="card coming" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
        <motion.div className="icon-tile dark" animate={{ rotate: [0, 180, 180, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <Hourglass size={34} />
        </motion.div>
        <span className="pill">Coming soon</span>
        <h2 style={{ fontSize: 28, marginTop: 14 }}>{NAMES[slug] || 'This service'}</h2>
        <p className="muted mt-8" style={{ maxWidth: 520, margin: '8px auto 0' }}>
          We add a service only after every step is verified against the official source and tested against a human-verified answer key. Passport services are live now.
        </p>
        <Link to="/app/cases" className="btn btn-primary mt-24">Go to passport guide <ArrowRight size={16} /></Link>
      </motion.div>
    </Page>
  );
}

export function NotFound() {
  return (
    <div className="notfound dark">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="gradient-text">404</h1>
        <p style={{ color: 'var(--muted-dark)', marginBottom: 24 }}>This page doesn't exist.</p>
        <Link to="/" className="btn btn-primary"><ArrowLeft size={16} /> Back home</Link>
      </motion.div>
    </div>
  );
}
