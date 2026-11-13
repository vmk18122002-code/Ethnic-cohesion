import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  ArrowRight, BadgePlus, Baby, SearchX, Plane, Sparkles, MessageSquareText, Languages, Database, ListOrdered,
  Landmark, Check, X, ShieldAlert, ShieldCheck, Link2, CreditCard, Car, BookOpen, Scale, Users, Send, CalendarCheck, Search,
} from 'lucide-react';
import { HelpFab, LangSwitch, Logo, Reveal, fadeUp, stagger } from '../components/ui.jsx';
import PassportArt from '../components/PassportArt.jsx';
import { useLang } from '../context/LangContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const QUICK = [
  { key: 'newPassport', icon: BadgePlus, to: '/app/cases?category=new' },
  { key: 'child', icon: Baby, to: '/app/cases?category=child' },
  { key: 'lost', icon: SearchX, to: '/app/cases?category=lost' },
  { key: 'abroad', icon: Plane, to: '/app/cases?category=abroad' },
];

const JOURNEY_ICONS = [MessageSquareText, Languages, Database, ListOrdered, Landmark];
const SERVICE_ICONS = [BookOpen, Car, Baby, CreditCard, ShieldCheck, Scale];
const SERVICE_LINKS = ['/app/cases', '/app/license', null, null, null, null];

function Counter({ to, suffix = '' }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf; const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1400);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n}{suffix}</>;
}

export default function Landing() {
  const { t } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [q, setQ] = useState('');
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const ask = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/app/assistant?q=${encodeURIComponent(q.trim())}` : '/app/assistant');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <motion.div style={{ scaleX: progress, transformOrigin: 'left', position: 'fixed', top: 0, left: 0, right: 0, height: 3, background: 'var(--blue-500)', zIndex: 60 }} />

      {/* NAVBAR */}
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <Link to="/"><Logo /></Link>
          <nav className="nav-links">
            <a href="#how">{t('navHow')}</a>
            <a href="#services">{t('navServices')}</a>
            <a href="#trust">{t('navTrust')}</a>
            <a href="#impact">{t('navImpact')}</a>
          </nav>
          <div className="nav-actions">
            <span className="hide-sm"><LangSwitch id="nav-lang" /></span>
            {user ? (
              <Link to="/app" className="btn btn-primary btn-sm">Dashboard <ArrowRight size={15} /></Link>
            ) : (
              <>
                <Link to="/signin" className="btn btn-ghost-dark btn-sm hide-sm">{t('signIn')}</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">{t('signUp')}</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero dark">
        <div className="hero-grid-bg" />
        <div className="blob blob-1" /><div className="blob blob-2" /><div className="blob blob-3" />
        <div className="container hero-inner">
          <motion.div variants={stagger(0.12)} initial="hidden" animate="show">
            <motion.span variants={fadeUp} className="pill pill-dark"><Sparkles size={13} /> {t('tagline')} · SDG 16</motion.span>
            <motion.h1 variants={fadeUp}><span className="gradient-text">{t('heroTitle')}</span></motion.h1>
            <motion.p variants={fadeUp} className="hero-sub">{t('heroSub')}</motion.p>

            <motion.form variants={fadeUp} className="ask-bar" onSubmit={ask}>
              <Search size={18} color="#7d869c" style={{ alignSelf: 'center', marginLeft: 8 }} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('askPlaceholder')} aria-label="Ask a question" />
              <button className="btn btn-primary" type="submit"><Send size={16} /> {t('askBtn')}</button>
            </motion.form>

            <motion.div variants={stagger(0.08)} className="quick-grid">
              {QUICK.map((qb) => (
                <motion.div key={qb.key} variants={fadeUp}>
                  <Link to={qb.to} className="quick-btn">
                    <span className="qi"><qb.icon size={19} /></span>
                    {t(qb.key)}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
          <div className="hero-visual"><PassportArt /></div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats dark">
        <div className="container stats-inner">
          <div className="stat"><b><Counter to={15} /></b><span>{t('statCases')}</span></div>
          <div className="stat"><b><Counter to={3} /></b><span>{t('statLangs')}</span></div>
          <div className="stat"><b><Counter to={17} /></b><span>{t('statForms')}</span></div>
          <div className="stat"><b>1962</b><span>{t('statHotline')}</span></div>
        </div>
      </section>

      {/* PROBLEM -> SOLUTION */}
      <section className="section" id="problem">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">{t('problemEyebrow')}</span>
            <h2>{t('problemTitle')}</h2>
            <p>{t('problemBody')}</p>
          </Reveal>
          <div className="compare">
            <Reveal className="compare-card old">
              <span className="pill pill-muted">{t('oldLabel')}</span>
              <h3 style={{ fontSize: 22, marginTop: 14 }}>{t('oldTitle')}</h3>
              <ul>
                {t('oldList').map((item) => <li key={item}><X size={18} color="#94a3b8" /> {item}</li>)}
              </ul>
            </Reveal>
            <motion.div className="vs" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', delay: 0.3 }}>
              <ArrowRight size={22} />
            </motion.div>
            <Reveal className="compare-card new" delay={0.15}>
              <span className="pill pill-dark" style={{ position: 'relative' }}>{t('newLabel')}</span>
              <h3 style={{ fontSize: 22, marginTop: 14, position: 'relative' }}>{t('newTitle')}</h3>
              <ul>
                {t('newList').map((item) => <li key={item}><Check size={18} color="var(--blue-400)" /> {item}</li>)}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section dark" id="how">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">{t('howEyebrow')}</span>
            <h2>{t('howTitle')}</h2>
            <p>{t('howBody')}</p>
          </Reveal>
          <div className="journey">
            <div className="journey-line">
              <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: 'easeInOut' }} />
            </div>
            {t('journeySteps').map((s, i) => (
              <Reveal key={s.title} className="journey-step" delay={i * 0.15}>
                <div className="journey-num">{JOURNEY_ICONS[i] && (() => { const Icon = JOURNEY_ICONS[i]; return <Icon size={26} />; })()}</div>
                <div className="small" style={{ color: 'var(--blue-400)', fontWeight: 700, marginBottom: 6 }}>{t('stepWord')} {i + 1}</div>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="safety-note" delay={0.3}>
            <ShieldAlert size={22} color="var(--blue-400)" style={{ flexShrink: 0 }} />
            <span>{t('safetyNote')}</span>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">{t('servicesEyebrow')}</span>
            <h2>{t('servicesTitle')}</h2>
            <p>{t('servicesBody')}</p>
          </Reveal>
          <div className="grid grid-3">
            {t('services').map((s, i) => {
              const Icon = SERVICE_ICONS[i];
              return (
                <Reveal key={s.title} delay={i * 0.06}>
                  <div className={`card service-card hover-lift ${s.live ? 'live' : ''}`} style={{ height: '100%' }}>
                    <span className="status">{s.live ? <span className="pill pill-dark">{t('liveTag')}</span> : <span className="pill pill-muted">{t('comingSoon')}</span>}</span>
                    <div className={`icon-tile ${s.live ? 'solid' : ''}`}>{Icon && <Icon size={22} />}</div>
                    <h3>{s.title}</h3>
                    <p className="muted">{s.text}</p>
                    {s.live && SERVICE_LINKS[i] && <Link to={SERVICE_LINKS[i]} className="btn btn-primary btn-sm mt-16" style={{ position: 'relative', zIndex: 1 }}>{t('openGuide')} <ArrowRight size={14} /></Link>}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="section" id="trust" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">{t('trustEyebrow')}</span>
            <h2>{t('trustTitle')}</h2>
            <p>{t('trustBody')}</p>
          </Reveal>
          <Reveal className="card">
            {t('risks').map(([risk, guard]) => (
              <div className="risk-row" key={risk}>
                <div className="risk"><span className="icon-tile dark" style={{ width: 36, height: 36, borderRadius: 10 }}><ShieldAlert size={17} /></span>{risk}</div>
                <ArrowRight size={18} color="var(--blue-500)" />
                <div className="guard"><ShieldCheck size={18} color="var(--blue-600)" />{guard}</div>
              </div>
            ))}
          </Reveal>
          <Reveal className="row wrap gap-12 mt-24">
            <span className="pill"><Link2 size={13} /> {t('pillSource')}</span>
            <span className="pill"><CalendarCheck size={13} /> {t('pillChecked')}</span>
            <span className="pill"><Users size={13} /> {t('pillVerified')}</span>
          </Reveal>
        </div>
      </section>

      {/* IMPACT */}
      <section className="section dark" id="impact">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">{t('impactEyebrow')}</span>
            <h2>{t('impactTitle')}</h2>
          </Reveal>
          <div className="grid grid-2">
            <Reveal className="card sdg" style={{ background: 'var(--ink-3)', borderColor: 'var(--ink-4)' }}>
              <div className="sdg-badge" style={{ background: 'var(--blue-700)' }}><div>SDG<b>16</b></div></div>
              <div><h3 style={{ fontSize: 19 }}>{t('sdg16Title')}</h3><p style={{ color: 'var(--muted-dark)', marginTop: 8 }}>{t('sdg16Body')}</p></div>
            </Reveal>
            <Reveal className="card sdg" delay={0.1} style={{ background: 'var(--ink-3)', borderColor: 'var(--ink-4)' }}>
              <div className="sdg-badge" style={{ background: '#fff', color: 'var(--ink)' }}><div>SDG<b>10</b></div></div>
              <div><h3 style={{ fontSize: 19 }}>{t('sdg10Title')}</h3><p style={{ color: 'var(--muted-dark)', marginTop: 8 }}>{t('sdg10Body')}</p></div>
            </Reveal>
          </div>
          <Reveal className="cta mt-32" delay={0.1}>
            <h2>{t('ctaTitle')}</h2>
            <p>{t('ctaBody')}</p>
            <div className="row" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to={user ? '/app' : '/signup'} className="btn btn-white btn-lg">{t('getStarted')} <ArrowRight size={17} /></Link>
              <a href="tel:1962" className="btn btn-ghost-dark btn-lg">{t('notClear')}</a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="footer dark">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Logo />
              <p className="mt-16" style={{ maxWidth: 340 }}>{t('footerTagline')}</p>
            </div>
            <div><h5>{t('footerPassport')}</h5><ul><li><Link to="/app/cases">{t('footerAllCases')}</Link></li><li><Link to="/app/fees">{t('footerFeeCalc')}</Link></li><li><Link to="/app/forms">{t('footerForms')}</Link></li></ul></div>
            <div><h5>{t('footerHelp')}</h5><ul><li><a href="tel:1962">{t('footerHotline')}</a></li><li><Link to="/app/offices">{t('footerOffices')}</Link></li><li><Link to="/app/contacts">{t('footerContacts')}</Link></li></ul></div>
            <div><h5>{t('footerOfficial')}</h5><ul><li><a href="https://www.immigration.gov.lk" target="_blank" rel="noreferrer">immigration.gov.lk</a></li><li><a href="https://www.gov.lk" target="_blank" rel="noreferrer">gov.lk</a></li><li><a href="https://mfa.gov.lk/sri-lanka-missions" target="_blank" rel="noreferrer">{t('footerMissions')}</a></li></ul></div>
          </div>
          <div className="footer-bottom">
            <span>{t('footerBottom')}</span>
            <span>{t('footerChecked')}</span>
          </div>
        </div>
      </footer>
      <HelpFab />
    </motion.div>
  );
}
