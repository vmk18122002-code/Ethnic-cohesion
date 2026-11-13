import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, ArrowRight, MapPin, Wallet, Clock, ExternalLink, PhoneCall, Target, Languages } from 'lucide-react';
import { api } from '../api.js';
import { Page, formatDate } from '../components/ui.jsx';
import { useLang } from '../context/LangContext.jsx';

const SUGGESTIONS = [
  'I need a passport urgently for travel tomorrow',
  'How do I get a passport for my baby?',
  'I lost my passport while working in Dubai',
  'I want to change my name in my passport',
  'මගේ ගමන් බලපත්‍රය නැති වුණා',
  'எனது குழந்தைக்கு கடவுச்சீட்டு வேண்டும்',
];
const LANG_NAME = { en: 'English', si: 'Sinhala', ta: 'Tamil' };

function Answer({ data, t }) {
  if (!data.match) {
    return (
      <div className="card card-pad">
        <p>{data.message}</p>
        <a href="tel:1962" className="btn btn-dark btn-sm mt-16"><PhoneCall size={15} /> {t('callHotline')}</a>
      </div>
    );
  }
  const m = data.match;
  return (
    <div className="card card-pad">
      <div className="row wrap gap-8">
        <span className="pill"><Languages size={12} /> {t('detected')}: {LANG_NAME[data.language]}</span>
        <span className={`pill ${data.confidence === 'high' ? '' : 'pill-warn'}`}><Target size={12} /> {data.confidence === 'high' ? t('clearMatch') : t('confirmTask')}</span>
      </div>
      <div className="muted small mt-16">{t('looksLikeYouWant')}</div>
      <h3 style={{ fontSize: 20, marginTop: 4 }}>{t('caseWord')} {m.number}: {m.title}</h3>
      <p className="muted mt-8">{m.summary}</p>
      <div className="row wrap gap-8 mt-16">
        <span className="pill pill-muted"><MapPin size={12} /> {m.where}</span>
        <span className="pill pill-muted"><Wallet size={12} /> {m.fee}</span>
        <span className="pill pill-muted"><Clock size={12} /> {m.duration}</span>
      </div>
      <ol style={{ margin: '18px 0 0', paddingLeft: 20, display: 'grid', gap: 8 }}>
        {m.steps.map((s, i) => (
          <motion.li key={s} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.1 }}>{s}</motion.li>
        ))}
      </ol>
      {m.totalSteps > m.steps.length && <div className="muted small mt-8">+ {m.totalSteps - m.steps.length} {t('moreSteps')}</div>}
      <div className="row wrap mt-24" style={{ justifyContent: 'space-between' }}>
        <Link to={`/app/cases/${m.id}`} className="btn btn-primary btn-sm">{t('openFullGuide')} <ArrowRight size={14} /></Link>
        <a href={m.source.url} target="_blank" rel="noreferrer" className="small link row gap-4">
          {m.source.label} · {t('lastChecked')} {formatDate(m.source.lastChecked)} <ExternalLink size={12} />
        </a>
      </div>
      {data.alternatives?.length > 0 && (
        <div className="mt-16 small muted">
          {t('notQuite')} {data.alternatives.map((a, i) => (
            <span key={a.id}>{i > 0 && ' · '}<Link className="link" to={`/app/cases/${a.id}`}>{a.title}</Link></span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Assistant() {
  const { t } = useLang();
  const [params, setParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  const asked = useRef(false);

  const ask = async (text) => {
    const question = text.trim();
    if (!question || busy) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: question }]);
    setBusy(true);
    try {
      const data = await api('/assistant/ask', { method: 'POST', body: { question } });
      setMessages((m) => [...m, { role: 'bot', data }]);
    } catch (err) {
      setMessages((m) => [...m, { role: 'bot', data: { match: null, message: err.message } }]);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const q = params.get('q');
    if (q && !asked.current) {
      asked.current = true;
      setParams({}, { replace: true });
      ask(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, busy]);

  return (
    <Page>
      <div className="chat">
        <div className="chat-scroll">
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '40px 0' }}>
              <motion.div className="icon-tile dark" style={{ width: 72, height: 72, borderRadius: 22, margin: '0 auto' }} animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <Bot size={34} />
              </motion.div>
              <h2 style={{ fontSize: 26, marginTop: 20 }}>{t('assistantHeadline')}</h2>
              <p className="muted mt-8" style={{ maxWidth: 520, margin: '8px auto 0' }}>
                {t('assistantIntro')}
              </p>
              <div className="row wrap gap-8 mt-24" style={{ justifyContent: 'center' }}>
                {SUGGESTIONS.map((s, i) => (
                  <motion.button key={s} className="chip" onClick={() => ask(s)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.06 }}>{s}</motion.button>
                ))}
              </div>
            </motion.div>
          )}
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                className={`msg ${m.role}`}
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              >
                {m.role === 'user' ? m.text : (
                  <>
                    <div className="bot-avatar"><Bot size={20} /></div>
                    <div className="bot-body"><Answer data={m.data} t={t} /></div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {busy && (
            <motion.div className="msg bot" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bot-avatar"><Bot size={20} /></div>
              <div className="typing"><span /><span /><span /></div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>
        <form className="chat-input" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('askPlaceholder')} aria-label="Your question" />
          <button className="btn btn-primary" disabled={busy || !input.trim()}><Send size={16} /> {t('askBtn')}</button>
        </form>
      </div>
    </Page>
  );
}
