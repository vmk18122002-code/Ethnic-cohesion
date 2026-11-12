import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, MapPin, Wallet, ArrowRight } from 'lucide-react';
import { api } from '../api.js';
import { Page } from '../components/ui.jsx';

export default function Cases() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'all';
  const [cases, setCases] = useState(null);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api('/passport/cases'), api('/passport/meta')])
      .then(([c, m]) => { setCases(c.cases); setCategories(m.categories); })
      .catch((e) => setError(e.message));
  }, []);

  const tabs = [{ key: 'all', label: 'All cases' }, ...categories];
  const shown = useMemo(() => (cases || []).filter((c) =>
    (category === 'all' || c.category.includes(category)) &&
    (!q || `${c.title} ${c.summary}`.toLowerCase().includes(q.toLowerCase()))
  ), [cases, category, q]);
  const activeCat = categories.find((c) => c.key === category);

  return (
    <Page>
      <div className="row wrap" style={{ justifyContent: 'space-between', gap: 16 }}>
        <div className="tabs" role="tablist">
          {tabs.map((t) => (
            <button key={t.key} role="tab" aria-selected={category === t.key} className={`tab ${category === t.key ? 'active' : ''}`}
              onClick={() => setParams(t.key === 'all' ? {} : { category: t.key })}>
              {category === t.key && <motion.span layoutId="case-tab" className="tab-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              {t.label}
            </button>
          ))}
        </div>
        <div className="input-wrap" style={{ width: 280, maxWidth: '100%' }}>
          <Search size={17} />
          <input className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter cases…" aria-label="Filter cases" />
        </div>
      </div>
      {activeCat && <p className="muted mt-16">{activeCat.description}</p>}
      {error && <div className="alert alert-error mt-16">{error}</div>}

      <motion.div layout className="grid grid-3 mt-24">
        {cases === null && !error && [1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="skeleton" style={{ height: 210 }} />)}
        <AnimatePresence mode="popLayout">
          {shown.map((c, i) => (
            <motion.div key={c.id} layout initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35, delay: i * 0.03 }}>
              <Link to={`/app/cases/${c.id}`} className="card case-card hover-lift action-card">
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <div className="case-num">{c.number}</div>
                  <span className="pill pill-muted">{c.duration}</span>
                </div>
                <h3>{c.title}</h3>
                <p className="muted small">{c.summary}</p>
                <div className="case-meta">
                  <span className="pill"><Wallet size={12} /> {c.fee}</span>
                  <span className="pill pill-muted"><MapPin size={12} /> {c.where.split(' (')[0]}</span>
                </div>
                <span className="go" style={{ marginTop: 6 }}>Open guide <ArrowRight size={15} /></span>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {cases && shown.length === 0 && <div className="card card-pad mt-16 muted" style={{ textAlign: 'center' }}>No cases match. Try the assistant or call 1962.</div>}
    </Page>
  );
}
