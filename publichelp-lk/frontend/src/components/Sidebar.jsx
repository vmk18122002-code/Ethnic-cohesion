import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard, MessageCircleQuestion, BookOpen, Route, Calculator, FileText, Building2, Phone,
  Baby, CreditCard, Car, ShieldCheck, UserRound, LogOut, ChevronsLeft, ChevronsRight, X,
} from 'lucide-react';
import { Logo } from './ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';

export function useNav() {
  const { t } = useLang();
  return [
    {
      label: t('navMain'),
      items: [
        { to: '/app', icon: LayoutDashboard, label: t('navOverview'), end: true },
        { to: '/app/assistant', icon: MessageCircleQuestion, label: t('navAssistant') },
      ],
    },
    {
      label: t('navPassportGroup'),
      items: [
        { to: '/app/cases', icon: BookOpen, label: t('navGuide') },
        { to: '/app/journeys', icon: Route, label: t('navJourneys') },
        { to: '/app/fees', icon: Calculator, label: t('navFees') },
        { to: '/app/forms', icon: FileText, label: t('navForms') },
        { to: '/app/offices', icon: Building2, label: t('navOffices') },
        { to: '/app/contacts', icon: Phone, label: t('navContacts') },
      ],
    },
    {
      label: t('serviceLicense'),
      items: [
        { to: '/app/license', icon: Car, label: t('navOverview'), end: true },
        { to: '/app/license/cases', icon: BookOpen, label: t('navGuide') },
        { to: '/app/license/fees', icon: Calculator, label: t('navFees') },
        { to: '/app/license/offices', icon: Building2, label: t('navOffices') },
        { to: '/app/license/contacts', icon: Phone, label: t('navContacts') },
      ],
    },
    {
      label: t('navOtherGroup'),
      items: [
        { to: '/app/services/birth-certificate', icon: Baby, label: t('navBirth'), badge: t('soon') },
        { to: '/app/services/nic', icon: CreditCard, label: t('navNic'), badge: t('soon') },
        { to: '/app/services/police-clearance', icon: ShieldCheck, label: t('navPolice'), badge: t('soon') },
      ],
    },
    {
      label: t('navAccount'),
      items: [{ to: '/app/profile', icon: UserRound, label: t('navProfile') }],
    },
  ];
}

export const initials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('') || 'U';

export default function Sidebar({ collapsed, setCollapsed, mobile, open, setOpen }) {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const nav = useNav();
  const mini = collapsed && !mobile;

  const signOut = () => { logout(); navigate('/signin'); };

  const panel = (
    <motion.aside
      className="sidebar"
      initial={mobile ? { x: '-100%' } : false}
      animate={mobile ? { x: 0, width: 280 } : { width: mini ? 84 : 272 }}
      exit={mobile ? { x: '-100%' } : undefined}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
    >
      <div className="sidebar-head">
        <NavLink to="/" aria-label="PublicHelp LK home"><Logo compact={mini} /></NavLink>
        {mobile ? (
          <button className="collapse-btn" onClick={() => setOpen(false)} aria-label="Close menu"><X size={16} /></button>
        ) : (
          !mini && <button className="collapse-btn" onClick={() => setCollapsed(true)} aria-label="Collapse sidebar"><ChevronsLeft size={16} /></button>
        )}
      </div>
      {mini && (
        <div style={{ padding: '0 26px 6px' }}>
          <button className="collapse-btn" onClick={() => setCollapsed(false)} aria-label="Expand sidebar"><ChevronsRight size={16} /></button>
        </div>
      )}

      <nav className="sidebar-scroll">
        {nav.map((group, gi) => (
          <div key={group.label}>
            <div className="side-label" style={{ opacity: mini ? 0 : 1, height: mini ? 18 : undefined, padding: mini ? '8px 0' : undefined }}>
              {mini ? '' : group.label}
            </div>
            {group.items.map((item, i) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * (gi * 3 + i) }}
              >
                <NavLink
                  to={item.to}
                  end={item.end}
                  title={mini ? item.label : undefined}
                  onClick={() => mobile && setOpen(false)}
                  className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}
                  style={mini ? { justifyContent: 'center' } : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <motion.span layoutId={mobile ? 'side-active-m' : 'side-active'} className="active-bg" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                      <item.icon size={19} />
                      {!mini && <span>{item.label}</span>}
                      {!mini && item.badge && <span className="badge">{item.badge}</span>}
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="user-chip" style={mini ? { justifyContent: 'center', background: 'transparent', padding: 0 } : undefined}>
          <div className="avatar">{initials(user?.fullName)}</div>
          {!mini && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.fullName}</div>
              <div style={{ fontSize: 12, color: '#7d869c', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
            </div>
          )}
          {!mini && <button className="collapse-btn" onClick={signOut} title={t('signOut')} aria-label={t('signOut')}><LogOut size={15} /></button>}
        </div>
        {mini && (
          <button className="collapse-btn" onClick={signOut} title={t('signOut')} aria-label={t('signOut')} style={{ margin: '10px auto 0' }}><LogOut size={15} /></button>
        )}
      </div>
    </motion.aside>
  );

  if (!mobile) return panel;
  return (
    <AnimatePresence>
      {open && <motion.div key="backdrop" className="sidebar-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />}
      {open && <motion.div key="panel">{panel}</motion.div>}
    </AnimatePresence>
  );
}
