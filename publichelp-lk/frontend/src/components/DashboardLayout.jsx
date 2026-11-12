import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Menu, Search, Phone } from 'lucide-react';
import Sidebar, { NAV } from './Sidebar.jsx';
import { HelpFab, LangSwitch, Loader } from './ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';

function useIsMobile(query = '(max-width: 1024px)') {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = (e) => setMatch(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, [query]);
  return match;
}

const TITLES = Object.fromEntries(NAV.flatMap((g) => g.items.map((i) => [i.to, { title: i.label, group: g.label }])));

export default function DashboardLayout() {
  const { user, loading } = useAuth();
  const { t } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const mobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('phlk_sidebar') === 'mini'; } catch { return false; }
  });
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');

  useEffect(() => { try { localStorage.setItem('phlk_sidebar', collapsed ? 'mini' : 'full'); } catch { /* ignore */ } }, [collapsed]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [location.pathname]);

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/signin" replace state={{ from: location.pathname + location.search }} />;

  const path = location.pathname;
  const meta = TITLES[path]
    || (path.startsWith('/app/cases/') ? { title: 'Passport case', group: 'Passport services' } : null)
    || (path.startsWith('/app/services/') ? { title: 'Coming soon', group: 'Other services' } : { title: 'PublicHelp LK', group: '' });

  const ask = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/app/assistant?q=${encodeURIComponent(q.trim())}`);
    setQ('');
  };

  return (
    <div className="app-shell">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobile={mobile} open={open} setOpen={setOpen} />
      <div className="main" style={{ marginLeft: mobile ? 0 : collapsed ? 84 : 272 }}>
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={18} /></button>
          <div>
            <div className="crumb">{meta.group}</div>
            <h1>{meta.title}</h1>
          </div>
          <form className="top-search" onSubmit={ask}>
            <Search size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask anything… e.g. passport for my baby" aria-label="Ask the assistant" />
          </form>
          <div className="row" style={{ marginLeft: mobile ? 'auto' : 0 }}>
            <span className="hide-sm"><LangSwitch light id="top-lang" /></span>
            <a href="tel:1962" className="btn btn-dark btn-sm hide-sm" title={t('notClear')}><Phone size={14} /> 1962</a>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <div key={path}>{outlet}</div>
        </AnimatePresence>
      </div>
      {mobile && <HelpFab />}
    </div>
  );
}
