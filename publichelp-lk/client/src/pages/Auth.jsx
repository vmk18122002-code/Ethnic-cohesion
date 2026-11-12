import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, CreditCard, Smartphone, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Languages } from 'lucide-react';
import { LangSwitch, Logo, fadeUp, stagger } from '../components/ui.jsx';
import PassportArt from '../components/PassportArt.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';

function AuthLayout({ children }) {
  return (
    <motion.div className="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      <div className="auth-art">
        <div className="blob blob-1" style={{ width: 420, height: 420 }} />
        <div className="blob blob-2" style={{ width: 300, height: 300 }} />
        <div className="hero-grid-bg" />
        <Link to="/" style={{ position: 'relative' }}><Logo /></Link>
        <div style={{ position: 'relative' }}><PassportArt compact /></div>
        <motion.div style={{ position: 'relative' }} variants={stagger(0.1)} initial="hidden" animate="show">
          <motion.h2 variants={fadeUp}>Your passport journey, <span className="gradient-text">saved and guided.</span></motion.h2>
          <div className="points">
            {['Save progress on every step and document', 'Personal fee calculator and checklists', 'Sinhala, Tamil and English'].map((p) => (
              <motion.div key={p} variants={fadeUp}><CheckCircle2 size={18} color="var(--blue-400)" /> {p}</motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <div className="auth-form-wrap">{children}</div>
    </motion.div>
  );
}

function Field({ label, optional, icon: Icon, error, children }) {
  return (
    <motion.div className="field" variants={fadeUp}>
      <label>{label} {optional && <span className="opt">(optional)</span>}</label>
      <div className="input-wrap">
        {Icon && <Icon size={18} />}
        {children}
      </div>
      <AnimatePresence>
        {error && (
          <motion.span className="field-error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FormError({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div className="alert alert-error" style={{ marginBottom: 16 }} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: [0, -8, 8, -4, 4, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
          <AlertCircle size={18} /> {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TopRow() {
  return (
    <div className="auth-top">
      <Link to="/" className="row muted small" style={{ fontWeight: 600 }}><ArrowLeft size={16} /> Home</Link>
      <LangSwitch light id="auth-lang" />
    </div>
  );
}

export function SignIn() {
  const { login, user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/app';
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <TopRow />
      <motion.form className="auth-form" onSubmit={submit} variants={stagger(0.07)} initial="hidden" animate="show" noValidate>
        <motion.h1 variants={fadeUp}>Welcome back</motion.h1>
        <motion.p variants={fadeUp} className="muted" style={{ marginBottom: 26 }}>Sign in to continue your passport journey.</motion.p>
        <FormError message={error} />
        <Field label="Email address" icon={Mail}>
          <input className="input" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </Field>
        <Field label="Password" icon={Lock}>
          <input className="input" type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="Your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button type="button" className="input-action" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </Field>
        <motion.div variants={fadeUp}>
          <button className="btn btn-primary btn-lg btn-block mt-8" disabled={busy}>
            {busy ? <span className="spinner" style={{ width: 18, height: 18, borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} /> : <>{t('signIn')} <ArrowRight size={17} /></>}
          </button>
        </motion.div>
        <motion.div variants={fadeUp} className="divider">New to PublicHelp LK?</motion.div>
        <motion.div variants={fadeUp}>
          <Link to="/signup" state={location.state} className="btn btn-ghost btn-lg btn-block">{t('signUp')}</Link>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
}

function strength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) s++;
  return s;
}
const STRENGTH = [['', '#e4e8f0'], ['Weak', '#dc2626'], ['Fair', '#f59e0b'], ['Good', '#3b82f6'], ['Strong', '#1d4ed8']];

export function SignUp() {
  const { register, user } = useAuth();
  const { lang, t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/app';
  const [form, setForm] = useState({ fullName: '', email: '', nic: '', phone: '', preferredLang: lang, password: '', confirm: '', agree: false });
  const [fields, setFields] = useState({});
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  const s = strength(form.password);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const local = {};
    if (form.password !== form.confirm) local.confirm = 'Passwords do not match.';
    if (!form.agree) local.agree = 'Please accept to continue.';
    if (Object.keys(local).length) { setFields(local); return; }
    setBusy(true);
    try {
      const { confirm, agree, ...payload } = form;
      await register(payload);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      setFields(err.fields || {});
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <TopRow />
      <motion.form className="auth-form" onSubmit={submit} variants={stagger(0.05)} initial="hidden" animate="show" noValidate>
        <motion.h1 variants={fadeUp}>Create your account</motion.h1>
        <motion.p variants={fadeUp} className="muted" style={{ marginBottom: 24 }}>Free. Takes less than a minute.</motion.p>
        <FormError message={error} />
        <Field label="Full name" icon={User} error={fields.fullName}>
          <input className={`input ${fields.fullName ? 'invalid' : ''}`} autoComplete="name" placeholder="As on your NIC" value={form.fullName} onChange={set('fullName')} />
        </Field>
        <Field label="Email address" icon={Mail} error={fields.email}>
          <input className={`input ${fields.email ? 'invalid' : ''}`} type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
        </Field>
        <div className="grid grid-2" style={{ gap: 12 }}>
          <Field label="NIC number" optional icon={CreditCard} error={fields.nic}>
            <input className={`input ${fields.nic ? 'invalid' : ''}`} placeholder="199912345678" value={form.nic} onChange={set('nic')} />
          </Field>
          <Field label="Mobile" optional icon={Smartphone} error={fields.phone}>
            <input className={`input ${fields.phone ? 'invalid' : ''}`} type="tel" autoComplete="tel" placeholder="+94 77 123 4567" value={form.phone} onChange={set('phone')} />
          </Field>
        </div>
        <Field label="Preferred language" icon={Languages}>
          <select className="input" value={form.preferredLang} onChange={set('preferredLang')}>
            <option value="en">English</option><option value="si">සිංහල (Sinhala)</option><option value="ta">தமிழ் (Tamil)</option>
          </select>
        </Field>
        <Field label="Password" icon={Lock} error={fields.password}>
          <input className={`input ${fields.password ? 'invalid' : ''}`} type={show ? 'text' : 'password'} autoComplete="new-password" placeholder="At least 8 characters, letters + numbers" value={form.password} onChange={set('password')} />
          <button type="button" className="input-action" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </Field>
        {form.password && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: -8, marginBottom: 14 }}>
            <div className="strength">{[1, 2, 3, 4].map((i) => <span key={i} style={{ background: i <= s ? STRENGTH[s][1] : undefined }} />)}</div>
            <div className="small" style={{ color: STRENGTH[s][1], fontWeight: 600, marginTop: 4 }}>{STRENGTH[s][0]}</div>
          </motion.div>
        )}
        <Field label="Confirm password" icon={Lock} error={fields.confirm}>
          <input className={`input ${fields.confirm ? 'invalid' : ''}`} type={show ? 'text' : 'password'} autoComplete="new-password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} />
        </Field>
        <motion.label variants={fadeUp} className="checkbox-row">
          <input type="checkbox" checked={form.agree} onChange={set('agree')} />
          <span>I understand PublicHelp LK is a guidance service, not an official government website, and I will confirm details with the Department.</span>
        </motion.label>
        {fields.agree && <div className="field-error" style={{ marginTop: 6 }}>{fields.agree}</div>}
        <motion.div variants={fadeUp}>
          <button className="btn btn-primary btn-lg btn-block mt-24" disabled={busy}>
            {busy ? <span className="spinner" style={{ width: 18, height: 18, borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} /> : <>{t('signUp')} <ArrowRight size={17} /></>}
          </button>
        </motion.div>
        <motion.p variants={fadeUp} className="muted small" style={{ textAlign: 'center', marginTop: 18 }}>
          Already have an account? <Link to="/signin" state={location.state} className="link">{t('signIn')}</Link>
        </motion.p>
      </motion.form>
    </AuthLayout>
  );
}
