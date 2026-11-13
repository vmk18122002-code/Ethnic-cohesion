import { motion } from 'framer-motion';
import { ExternalLink, CalendarCheck, Phone, BookOpenCheck } from 'lucide-react';
import { LANGS, useLang } from '../context/LangContext.jsx';

export function Logo({ dark = false, compact = false }) {
  return (
    <span className="logo" style={{ color: dark ? 'var(--ink)' : '#fff' }}>
      <span className="logo-mark"><BookOpenCheck size={19} /></span>
      {!compact && <span>PublicHelp<small> LK</small></span>}
    </span>
  );
}

export function LangSwitch({ light = false, id = 'lang' }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`lang-switch ${light ? 'light' : ''}`} role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button key={l.code} className={lang === l.code ? 'active' : ''} onClick={() => setLang(l.code)} title={l.label} aria-pressed={lang === l.code}>
          {lang === l.code && <motion.span layoutId={`${id}-bg`} className="lang-bg" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
          {l.short}
        </button>
      ))}
    </div>
  );
}

export function HelpFab() {
  const { t } = useLang();
  return (
    <motion.a
      href="tel:1962"
      className="help-fab"
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      aria-label="Call the 1962 hotline"
    >
      <span className="ring"><Phone size={16} /></span>
      <span className="label">{t('notClear')}</span>
    </motion.a>
  );
}

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};
export const stagger = (s = 0.08) => ({ hidden: {}, show: { transition: { staggerChildren: s } } });

// Reveal children when they scroll into view.
export function Reveal({ children, className, delay = 0, as = 'div', ...rest }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

// Page wrapper used inside the dashboard for enter/exit transitions.
export function Page({ children }) {
  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SourceBox({ source }) {
  const { t } = useLang();
  if (!source) return null;
  return (
    <div className="source-box">
      <div className="row" style={{ fontWeight: 700, marginBottom: 6 }}><CalendarCheck size={16} color="var(--blue-600)" /> {t('sourceLabel')}</div>
      <a href={source.url} target="_blank" rel="noreferrer">{source.label} <ExternalLink size={13} /></a>
      <div className="muted small mt-8">Department of Immigration and Emigration · {t('lastCheckedLabel')} {formatDate(source.lastChecked)}</div>
    </div>
  );
}

export function ProgressRing({ value, size = 120, label = 'complete' }) {
  const r = (size - 14) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--blue-50)" strokeWidth="12" fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} stroke="url(#ringGrad)" strokeWidth="12" fill="none" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * value) / 100 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563eb" /><stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
        </defs>
      </svg>
      <div className="ring-label"><div><b>{value}%</b><span className="muted small">{label}</span></div></div>
    </div>
  );
}

export function ProgressBar({ value }) {
  return (
    <div className="progress">
      <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
    </div>
  );
}

export function Loader() {
  return <div className="loader-page"><div className="spinner" /></div>;
}

export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso.replace(' ', 'T') + (iso.includes('Z') ? '' : 'Z'));
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
