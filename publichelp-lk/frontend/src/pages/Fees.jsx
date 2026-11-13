import { useEffect, useRef, useState } from 'react';
import { animate, motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { api, lkr } from '../api.js';
import { Loader, Page, SourceBox } from '../components/ui.jsx';
import { useLang } from '../context/LangContext.jsx';

function AnimatedAmount({ value }) {
  const ref = useRef(null);
  const prev = useRef(0);
  useEffect(() => {
    const ctrl = animate(prev.current, value, {
      duration: 0.7, ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => { if (ref.current) ref.current.textContent = lkr(Math.round(v)); },
    });
    prev.current = value;
    return () => ctrl.stop();
  }, [value]);
  return <span ref={ref}>{lkr(value)}</span>;
}

function Seg({ options, value, onChange, id }) {
  return (
    <div className="seg">
      {options.map(([k, label]) => (
        <button key={k} type="button" className={value === k ? 'active' : ''} onClick={() => onChange(k)}>
          {value === k && <motion.span layoutId={id} className="seg-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
          {label}
        </button>
      ))}
    </div>
  );
}

function Counter({ value, onChange, label }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
      <span className="small" style={{ fontWeight: 600 }}>{label}</span>
      <div className="counter">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))} aria-label={`Decrease ${label}`}>−</button>
        <span>{value}</span>
        <button type="button" onClick={() => onChange(Math.min(20, value + 1))} aria-label={`Increase ${label}`}>+</button>
      </div>
    </div>
  );
}

export default function Fees() {
  const { t, lang } = useLang();
  const [table, setTable] = useState(null);
  const [form, setForm] = useState({ passportType: 'ordinary', service: 'normal', lost: 'none', alterations: 0, certifiedCopies: 0, arabic: 0, courier: 0 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { api(`/passport/fees?lang=${lang}`).then(setTable).catch((e) => setError(e.message)); }, [lang]);
  useEffect(() => {
    const t2 = setTimeout(() => {
      api('/passport/fees/calculate', { method: 'POST', body: { ...form, lang } }).then(setResult).catch((e) => setError(e.message));
    }, 150);
    return () => clearTimeout(t2);
  }, [form, lang]);

  if (error && !table) return <Page><div className="alert alert-error">{error}</div></Page>;
  if (!table) return <Loader />;
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const { fees } = table;
  const svc = Object.fromEntries(fees.services.map((s) => [s.key, s]));

  return (
    <Page>
      <div className="detail-layout" style={{ marginTop: 0, gridTemplateColumns: 'minmax(0,1fr) 380px' }}>
        <div className="stack gap-24">
          <section className="card card-pad">
            <h3 style={{ fontSize: 18 }}>{t('feesStep1')}</h3>
            <div className="radio-cards mt-16">
              {fees.passports.map((p) => (
                <motion.button key={p.key} type="button" whileTap={{ scale: 0.98 }} className={`radio-card ${form.passportType === p.key ? 'active' : ''}`} onClick={() => set('passportType')(p.key)}>
                  <span>{p.label}</span>
                  <span className="muted small">{lkr(p.normal)} / {lkr(p.urgent)}</span>
                </motion.button>
              ))}
            </div>
          </section>
          <section className="card card-pad">
            <h3 style={{ fontSize: 18 }}>{t('feesStep2')}</h3>
            <div className="mt-16"><Seg id="svc" value={form.service} onChange={set('service')} options={[['normal', t('svcNormal')], ['urgent', t('svcUrgent')], ['none', t('svcNone')]]} /></div>
            <h3 style={{ fontSize: 18 }} className="mt-24">{t('feesStep3')}</h3>
            <div className="mt-16"><Seg id="lost" value={form.lost} onChange={set('lost')} options={fees.lostFines.map((f) => [f.key, f.key === 'none' ? t('lostNo') : f.key === 'within1' ? t('lostWithin1') : t('lostAfter1')])} /></div>
          </section>
          <section className="card card-pad">
            <h3 style={{ fontSize: 18 }}>{t('feesStep4')}</h3>
            <div className="mt-8">
              <Counter label={`${svc.alteration.label} (${lkr(svc.alteration.amount)})`} value={form.alterations} onChange={set('alterations')} />
              <Counter label={`${svc.certifiedCopy.label} (${lkr(svc.certifiedCopy.amount)})`} value={form.certifiedCopies} onChange={set('certifiedCopies')} />
              <Counter label={`${svc.arabic.label} (${lkr(svc.arabic.amount)})`} value={form.arabic} onChange={set('arabic')} />
              <Counter label={`${svc.courier.label} (${lkr(svc.courier.amount)})`} value={form.courier} onChange={set('courier')} />
            </div>
          </section>
          <section className="card">
            <div className="card-pad" style={{ paddingBottom: 8 }}><h3 style={{ fontSize: 18 }}>{t('officialFeeTable')}</h3></div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>{t('colPassport')}</th><th>{t('colNormal')}</th><th>{t('colUrgent')}</th></tr></thead>
                <tbody>{fees.passports.map((p) => <tr key={p.key}><td>{p.label}</td><td className="amount">{lkr(p.normal)}</td><td className="amount">{lkr(p.urgent)}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="table-wrap" style={{ borderTop: '1px solid var(--line)' }}>
              <table className="table">
                <thead><tr><th>{t('colService')}</th><th>{t('colFee')}</th><th>{t('colNote')}</th></tr></thead>
                <tbody>{fees.services.map((s) => <tr key={s.key}><td>{s.label}</td><td className="amount">{lkr(s.amount)} <span className="muted small">{s.unit}</span></td><td className="muted">{s.note || '—'}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="sticky-col">
          <motion.div className="total-card" layout>
            <div className="small" style={{ color: 'var(--muted-dark)' }}>{t('estimatedTotal')}</div>
            <div className="big"><AnimatedAmount value={result?.total || 0} /></div>
            {result?.delivery && <div className="pill pill-dark mt-8">{t('delivery')}: {result.delivery}</div>}
            <div className="mt-16">
              {result?.lines.map((l) => (
                <motion.div key={l.label} className="line-item" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                  <span>{l.label}</span><b style={{ color: '#fff' }}>{lkr(l.amount)}</b>
                </motion.div>
              ))}
              {result?.lines.length === 0 && <div className="line-item">{t('nothingSelected')}</div>}
            </div>
          </motion.div>
          {result?.notes.map((n) => <div key={n} className="alert alert-info"><Info size={17} /> {n}</div>)}
          <SourceBox source={table.source} />
          <div className="card card-pad small">
            <b>{t('validity')}</b>
            <ul style={{ margin: '8px 0 0', paddingLeft: 18, display: 'grid', gap: 6 }} className="muted">{fees.validity.map((v) => <li key={v}>{v}</li>)}</ul>
          </div>
        </aside>
      </div>
    </Page>
  );
}
