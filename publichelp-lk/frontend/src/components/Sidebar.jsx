import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard, MessageCircleQuestion, BookOpen, Route, Calculator, FileText, Building2, Phone,
  Baby, CreditCard, Car, ShieldCheck, UserRound, LogOut, ChevronsLeft, ChevronsRight, X,
} from 'lucide-react';
import { Logo } from './ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const NAV = [
  {
    label: 'Main',
    items: [
      { to: '/app', icon: LayoutDashboard, label: 'Overview', end: true },
      { to: '/app/assistant', icon: MessageCircleQuestion, label: 'Ask the assistant' },
    ],
  },
  {
    label: 'Passport services',
    items: [
      { to: '/app/cases', icon: BookOpen, label: 'Passport guide' },
      { to: '/app/journeys', icon: Route, label: 'My journeys' },
      { to: '/app/fees', icon: Calculator, label: 'Fee calculator' },
      { to: '/app/forms', icon: FileText, label: 'Forms & downloads' },
      { to: '/app/offices', icon: Building2, label: 'Offices & hours' },
      { to: '/app/contacts', icon: Phone, label: 'Contacts' },
    ],
  },
  {
    label: 'Other services',
    items: [
      { to: '/app/services/birth-certificate', icon: Baby, label: 'Birth certificate', badge: 'Soon' },
      { to: '/app/services/nic', icon: CreditCard, label: 'National ID (NIC)', badge: 'Soon' },
      { to: '/app/services/driving-licence', icon: Car, label: 'Driving licence', badge: 'Soon' },
      { to: '/app/services/police-clearance', icon: ShieldCheck, label: 'Police clearance', badge: 'Soon' },
    ],
  },
  {
    label: 'Account',
    items: [{ to: '/app/profile', icon: UserRound, label: 'Profile & settings' }],
  },
];

export const initials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('') || 'U';

export default function Sidebar({ collapsed, setCollapsed, mobile, open, setOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
        {NAV.map((group, gi) => (
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
          {!mini && <button className="collapse-btn" onClick={signOut} title="Sign out" aria-label="Sign out"><LogOut size={15} /></button>}
        </div>
        {mini && (
          <button className="collapse-btn" onClick={signOut} title="Sign out" aria-label="Sign out" style={{ margin: '10px auto 0' }}><LogOut size={15} /></button>
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
