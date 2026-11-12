import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ExternalLink, Building2, MapPin, Clock, AlertTriangle, Fingerprint, Phone, Mail, Printer, PhoneCall } from 'lucide-react';
import { api } from '../api.js';
import { Loader, Page, fadeUp, stagger, formatDate } from '../components/ui.jsx';

function useData(path) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api(path).then(setData).catch((e) => setError(e.message)); }, [path]);
  return [data, error];
}

export function Forms() {
  const [data, error] = useData('/passport/forms');
  const [scope, setScope] = useState('all');
  if (error) return <Page><div className="alert alert-error">{error}</div></Page>;
  if (!data) return <Loader />;
  const list = data.forms.filter((f) => scope === 'all' || f.scope === scope || f.scope === 'Both');

  return (
    <Page>
      <div className="row wrap" style={{ justifyContent: 'space-between', gap: 16 }}>
        <div className="tabs">
          {[['all', 'All forms'], ['Sri Lanka', 'In Sri Lanka'], ['Overseas', 'Overseas']].map(([k, l]) => (
            <button key={k} className={`tab ${scope === k ? 'active' : ''}`} onClick={() => setScope(k)}>
              {scope === k && <motion.span layoutId="form-tab" className="tab-bg" />}{l}
            </button>
          ))}
        </div>
        <a href={data.downloads.url} target="_blank" rel="noreferrer" className="btn btn-primary"><Download size={16} /> Official downloads page</a>
      </div>
      <div className="alert alert-info mt-16"><Printer size={18} /> Downloaded forms should be laser printed on A4 paper. Forms are also free at the Head Office, Regional Offices, Divisional Secretariats and Overseas Missions.</div>
      <motion.div className="grid grid-2 mt-24" variants={stagger(0.04)} initial="hidden" animate="show">
        {list.map((f) => (
          <motion.a key={f.name} variants={fadeUp} href={data.downloads.url} target="_blank" rel="noreferrer" className="card card-pad row gap-16 hover-lift" style={{ alignItems: 'flex-start' }}>
            <div className="icon-tile"><FileText size={22} /></div>
            <div className="grow">
              <b style={{ fontSize: 15 }}>{f.name}</b>
              <div className="row wrap gap-8 mt-8">
                {f.formNo !== '—' && <span className="pill">{f.formNo}</span>}
                <span className="pill pill-muted">{f.scope}</span>
                {f.languages && <span className="pill pill-muted">{f.languages}</span>}
              </div>
            </div>
            <ExternalLink size={16} color="var(--muted)" />
          </motion.a>
        ))}
      </motion.div>
      <p className="muted small mt-24">Source: {data.downloads.label} · last checked {formatDate(data.lastChecked)}</p>
    </Page>
  );
}

export function Offices() {
  const [data, error] = useData('/passport/offices');
  if (error) return <Page><div className="alert alert-error">{error}</div></Page>;
  if (!data) return <Loader />;
  const { offices } = data;

  return (
    <Page>
      <motion.div className="detail-hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <span className="pill pill-dark"><Building2 size={13} /> Head Office</span>
        <h2>{offices.headOffice.name}</h2>
        <p className="row gap-8"><MapPin size={16} /> {offices.headOffice.address}</p>
        <div className="detail-facts">{offices.headOffice.notes.map((n) => <div key={n}><b>{n}</b></div>)}</div>
        <a href={data.map.url} target="_blank" rel="noreferrer" className="btn btn-white btn-sm mt-24">Location map <ExternalLink size={14} /></a>
      </motion.div>

      <div className="section-title"><h3>Regional offices</h3></div>
      <motion.div className="grid grid-3" variants={stagger(0.06)} initial="hidden" animate="show">
        {offices.regional.map((r) => (
          <motion.div key={r.name} variants={fadeUp} className="card card-pad hover-lift">
            <div className="row"><div className="icon-tile"><MapPin size={20} /></div><h3 style={{ fontSize: 18 }}>{r.name}</h3></div>
            <div className="row small mt-16" style={{ color: r.overseasFingerprints ? 'var(--blue-700)' : 'var(--warn)' }}>
              <Fingerprint size={15} /> {r.overseasFingerprints ? 'Overseas-passport fingerprints listed' : 'Overseas fingerprints not listed — check first'}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="section-title"><h3>Working hours (weekdays)</h3></div>
      <div className="card table-wrap">
        <table className="table">
          <thead><tr><th>Office</th><th>Service</th><th>Hours</th></tr></thead>
          <tbody>{offices.hours.map((h) => <tr key={h.office + h.service}><td><b>{h.office}</b></td><td>{h.service}</td><td className="row gap-8"><Clock size={14} color="var(--blue-600)" /> {h.hours}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="alert alert-warn mt-16"><AlertTriangle size={18} /> The official page lists one-day hours for Regional Offices but also says one-day service is Head Office only. Call 1962 before travelling for an urgent application.</div>
    </Page>
  );
}

export function Contacts() {
  const [data, error] = useData('/passport/contacts');
  if (error) return <Page><div className="alert alert-error">{error}</div></Page>;
  if (!data) return <Loader />;

  return (
    <Page>
      <motion.div className="grid grid-2" variants={stagger(0.06)} initial="hidden" animate="show">
        {data.contacts.map((c) => (
          <motion.div key={c.label} variants={fadeUp} className={`card contact-card hover-lift ${c.primary ? 'primary' : ''}`} style={c.primary ? { gridColumn: '1 / -1' } : undefined}>
            <div className={`icon-tile ${c.primary ? 'solid' : ''}`}>{c.tel ? <Phone size={22} /> : c.email ? <Mail size={22} /> : <Printer size={22} />}</div>
            <div className="grow">
              <div className={c.primary ? '' : 'muted'} style={{ fontSize: 13, fontWeight: 600, color: c.primary ? 'var(--muted-dark)' : undefined }}>{c.label}</div>
              <div className="val">{c.value}</div>
              {c.note && <div className="small muted">{c.note}</div>}
              {c.email && c.tel && <a href={`mailto:${c.email}`} className="small link">{c.email}</a>}
            </div>
            {c.tel && <a href={`tel:${c.tel}`} className={`btn ${c.primary ? 'btn-primary' : 'btn-dark'} btn-sm`}><PhoneCall size={14} /> Call</a>}
            {!c.tel && c.email && <a href={`mailto:${c.email}`} className="btn btn-ghost btn-sm"><Mail size={14} /> Email</a>}
          </motion.div>
        ))}
      </motion.div>
      <p className="muted small mt-24">
        Overseas? Contact your nearest <a className="link" href="https://mfa.gov.lk/sri-lanka-missions" target="_blank" rel="noreferrer">Sri Lankan Mission</a>. Source: {data.source.label} · last checked {formatDate(data.lastChecked)}
      </p>
    </Page>
  );
}
