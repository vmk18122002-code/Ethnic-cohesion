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

const JOURNEY = [
  { icon: MessageSquareText, title: 'Ask a real-life question', text: 'In Sinhala, Tamil or English — in your own words.' },
  { icon: Languages, title: 'Detect goal & language', text: 'We identify the task you are trying to complete.' },
  { icon: Database, title: 'Retrieve official evidence', text: 'Only details confirmed on official pages are used.' },
  { icon: ListOrdered, title: 'Present a clear sequence', text: 'Numbered steps, documents and fees, in order.' },
  { icon: Landmark, title: 'Link to the agency', text: 'Every step points to the responsible department.' },
];

const SERVICES = [
  { icon: BookOpen, title: 'Passport services', text: '15 verified cases: new, urgent, child, lost, overseas, amendments and more.', live: true },
  { icon: Baby, title: 'Birth certificate copy', text: 'Order a certified copy from the Registrar General.' },
  { icon: CreditCard, title: 'National Identity Card', text: 'First NIC, replacement and corrections.' },
  { icon: Car, title: 'Driving licence', text: 'Learner permits, renewals and international permits.' },
  { icon: ShieldCheck, title: 'Police clearance', text: 'Certificates for overseas employment and migration.' },
  { icon: Scale, title: 'Marriage registration', text: 'Registering a marriage and obtaining copies.' },
];

const RISKS = [
  ['Outdated information', 'Official source link + last-checked date'],
  ['Missing or unclear evidence', 'State the uncertainty; direct to the responsible agency'],
  ['Incorrect task interpretation', 'Make the identified goal and steps easy to review'],
  ['Language ambiguity', 'Keep the same verified meaning across languages'],
];

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
            <a href="#how">How it works</a>
            <a href="#services">Services</a>
            <a href="#trust">Trust & safety</a>
            <a href="#impact">Impact</a>
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
              <button className="btn btn-primary" type="submit"><Send size={16} /> Ask</button>
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
          <div className="stat"><b><Counter to={15} /></b><span>passport cases verified</span></div>
          <div className="stat"><b><Counter to={3} /></b><span>languages: සිං · த · EN</span></div>
          <div className="stat"><b><Counter to={17} /></b><span>official forms mapped</span></div>
          <div className="stat"><b>1962</b><span>hotline, one tap away</span></div>
        </div>
      </section>

      {/* PROBLEM -> SOLUTION */}
      <section className="section" id="problem">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">The problem</span>
            <h2>Information exists. Turning it into action is the hard part.</h2>
            <p>Government information is online, but citizens struggle to find, interpret and sequence the official steps for their specific need. PublicHelp LK builds on the existing digital-government ecosystem — it does not replace it.</p>
          </Reveal>
          <div className="compare">
            <Reveal className="compare-card old">
              <span className="pill pill-muted">Directory</span>
              <h3 style={{ fontSize: 22, marginTop: 14 }}>Find information</h3>
              <ul>
                <li><X size={18} color="#94a3b8" /> Information organised by agency</li>
                <li><X size={18} color="#94a3b8" /> You work out the order of steps</li>
                <li><X size={18} color="#94a3b8" /> Language versions vary page to page</li>
                <li><X size={18} color="#94a3b8" /> Hard to tell what's current</li>
              </ul>
            </Reveal>
            <motion.div className="vs" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', delay: 0.3 }}>
              <ArrowRight size={22} />
            </motion.div>
            <Reveal className="compare-card new" delay={0.15}>
              <span className="pill pill-dark" style={{ position: 'relative' }}>Task-oriented guide</span>
              <h3 style={{ fontSize: 22, marginTop: 14, position: 'relative' }}>Understand goal → guide action</h3>
              <ul>
                <li><Check size={18} color="var(--blue-400)" /> Guidance starts from your real-life goal</li>
                <li><Check size={18} color="var(--blue-400)" /> Steps sequenced around your task</li>
                <li><Check size={18} color="var(--blue-400)" /> One guided path in Sinhala, Tamil or English</li>
                <li><Check size={18} color="var(--blue-400)" /> A source + last-checked date on every step</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section dark" id="how">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">How it works</span>
            <h2>From a question to an official next step — in 5 moves</h2>
            <p>The proposed user journey, built into every passport guide.</p>
          </Reveal>
          <div className="journey">
            <div className="journey-line">
              <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: 'easeInOut' }} />
            </div>
            {JOURNEY.map((s, i) => (
              <Reveal key={s.title} className="journey-step" delay={i * 0.15}>
                <div className="journey-num"><s.icon size={26} /></div>
                <div className="small" style={{ color: 'var(--blue-400)', fontWeight: 700, marginBottom: 6 }}>STEP {i + 1}</div>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="safety-note" delay={0.3}>
            <ShieldAlert size={22} color="var(--blue-400)" style={{ flexShrink: 0 }} />
            <span><b>Safety rule:</b> if official evidence is missing or unclear, we say so and direct you to the responsible agency — never a guess.</span>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Services</span>
            <h2>Starting with passports. Growing to every common task.</h2>
            <p>Initial scope: 10–20 common government-service tasks, each tested against a human-verified answer key.</p>
          </Reveal>
          <div className="grid grid-3">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.06}>
                <div className={`card service-card hover-lift ${s.live ? 'live' : ''}`} style={{ height: '100%' }}>
                  <span className="status">{s.live ? <span className="pill pill-dark">● Live</span> : <span className="pill pill-muted">Coming soon</span>}</span>
                  <div className={`icon-tile ${s.live ? 'solid' : ''}`}><s.icon size={22} /></div>
                  <h3>{s.title}</h3>
                  <p className="muted">{s.text}</p>
                  {s.live && <Link to="/app/cases" className="btn btn-primary btn-sm mt-16" style={{ position: 'relative', zIndex: 1 }}>Open guide <ArrowRight size={14} /></Link>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="section" id="trust" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Trust & safety</span>
            <h2>Public-service guidance must be trustworthy</h2>
            <p>Each risk is paired with a safeguard.</p>
          </Reveal>
          <Reveal className="card">
            {RISKS.map(([risk, guard]) => (
              <div className="risk-row" key={risk}>
                <div className="risk"><span className="icon-tile dark" style={{ width: 36, height: 36, borderRadius: 10 }}><ShieldAlert size={17} /></span>{risk}</div>
                <ArrowRight size={18} color="var(--blue-500)" />
                <div className="guard"><ShieldCheck size={18} color="var(--blue-600)" />{guard}</div>
              </div>
            ))}
          </Reveal>
          <Reveal className="row wrap gap-12 mt-24">
            <span className="pill"><Link2 size={13} /> Source link on every step</span>
            <span className="pill"><CalendarCheck size={13} /> Last checked: 12 Nov 2026</span>
            <span className="pill"><Users size={13} /> Human-verified answer key</span>
          </Reveal>
        </div>
      </section>

      {/* IMPACT */}
      <section className="section dark" id="impact">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">SDG alignment & impact</span>
            <h2>Accessible, transparent public institutions</h2>
          </Reveal>
          <div className="grid grid-2">
            <Reveal className="card sdg" style={{ background: 'var(--ink-3)', borderColor: 'var(--ink-4)' }}>
              <div className="sdg-badge" style={{ background: 'var(--blue-700)' }}><div>SDG<b>16</b></div></div>
              <div><h3 style={{ fontSize: 19 }}>Peace, Justice and Strong Institutions</h3><p style={{ color: 'var(--muted-dark)', marginTop: 8 }}>Primary goal — especially accessible and transparent public institutions.</p></div>
            </Reveal>
            <Reveal className="card sdg" delay={0.1} style={{ background: 'var(--ink-3)', borderColor: 'var(--ink-4)' }}>
              <div className="sdg-badge" style={{ background: '#fff', color: 'var(--ink)' }}><div>SDG<b>10</b></div></div>
              <div><h3 style={{ fontSize: 19 }}>Reduced Inequalities</h3><p style={{ color: 'var(--muted-dark)', marginTop: 8 }}>Supporting goal — if the project measurably reduces language or access barriers.</p></div>
            </Reveal>
          </div>
          <Reveal className="cta mt-32" delay={0.1}>
            <h2>Ready to sort out your passport?</h2>
            <p>Create a free account to save your progress, tick off documents and calculate fees.</p>
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
              <p className="mt-16" style={{ maxWidth: 340 }}>A multilingual government-service guidance assistant for Sri Lanka. Not an official government website — always follow the linked official source.</p>
            </div>
            <div><h5>Passport</h5><ul><li><Link to="/app/cases">All cases</Link></li><li><Link to="/app/fees">Fee calculator</Link></li><li><Link to="/app/forms">Forms</Link></li></ul></div>
            <div><h5>Help</h5><ul><li><a href="tel:1962">Hotline 1962</a></li><li><Link to="/app/offices">Offices & hours</Link></li><li><Link to="/app/contacts">Contacts</Link></li></ul></div>
            <div><h5>Official</h5><ul><li><a href="https://www.immigration.gov.lk" target="_blank" rel="noreferrer">immigration.gov.lk</a></li><li><a href="https://www.gov.lk" target="_blank" rel="noreferrer">gov.lk</a></li><li><a href="https://mfa.gov.lk/sri-lanka-missions" target="_blank" rel="noreferrer">Overseas Missions</a></li></ul></div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 PublicHelp LK · Research prototype</span>
            <span>Passport data last checked 12 November 2026</span>
          </div>
        </div>
      </footer>
      <HelpFab />
    </motion.div>
  );
}
