import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CreditCard, Smartphone, Languages, Lock, Save, CheckCircle2, Mail } from 'lucide-react';
import { Page, formatDate } from '../components/ui.jsx';
import { initials } from '../components/Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useLang } from '../context/LangContext.jsx';

function Input({ label, icon: Icon, error, ...props }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="input-wrap"><Icon size={18} /><input className={`input ${error ? 'invalid' : ''}`} {...props} /></div>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

function Toast({ show, text }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="alert alert-info" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginBottom: 16 }}>
          <CheckCircle2 size={18} /> {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuth();
  const { setLang } = useLang();
  const [form, setForm] = useState({ fullName: user.fullName, nic: user.nic || '', phone: user.phone || '', preferredLang: user.preferredLang });
  const [fields, setFields] = useState({});
  const [msg, setMsg] = useState('');
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [pwFields, setPwFields] = useState({});
  const [pwMsg, setPwMsg] = useState('');

  const save = async (e) => {
    e.preventDefault(); setFields({}); setMsg('');
    try {
      const u = await updateProfile(form);
      setLang(u.preferredLang);
      setMsg('Profile updated.');
      setTimeout(() => setMsg(''), 2500);
    } catch (err) { setFields({ ...err.fields, _: err.message }); }
  };
  const changePw = async (e) => {
    e.preventDefault(); setPwFields({}); setPwMsg('');
    try {
      await changePassword(pw.currentPassword, pw.newPassword);
      setPw({ currentPassword: '', newPassword: '' });
      setPwMsg('Password changed.');
      setTimeout(() => setPwMsg(''), 2500);
    } catch (err) { setPwFields({ ...err.fields, _: err.message }); }
  };
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <Page>
      <motion.div className="welcome row gap-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex' }}>
        <div className="avatar" style={{ width: 64, height: 64, fontSize: 22, borderRadius: 18 }}>{initials(user.fullName)}</div>
        <div><h2 style={{ fontSize: 24 }}>{user.fullName}</h2><p className="row gap-8" style={{ marginTop: 4 }}><Mail size={15} /> {user.email} · member since {formatDate(user.createdAt)}</p></div>
      </motion.div>
      <div className="grid grid-2 mt-24" style={{ alignItems: 'start' }}>
        <form className="card card-pad" onSubmit={save}>
          <h3 style={{ fontSize: 18, marginBottom: 18 }}>Personal details</h3>
          <Toast show={!!msg} text={msg} />
          {fields._ && <div className="alert alert-error" style={{ marginBottom: 16 }}>{fields._}</div>}
          <Input label="Full name" icon={User} value={form.fullName} onChange={set('fullName')} error={fields.fullName} />
          <Input label="NIC number" icon={CreditCard} value={form.nic} onChange={set('nic')} error={fields.nic} placeholder="Optional" />
          <Input label="Mobile" icon={Smartphone} value={form.phone} onChange={set('phone')} error={fields.phone} placeholder="Optional" />
          <div className="field">
            <label>Preferred language</label>
            <div className="input-wrap"><Languages size={18} />
              <select className="input" value={form.preferredLang} onChange={set('preferredLang')}>
                <option value="en">English</option><option value="si">සිංහල</option><option value="ta">தமிழ்</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary mt-8"><Save size={16} /> Save changes</button>
        </form>
        <form className="card card-pad" onSubmit={changePw}>
          <h3 style={{ fontSize: 18, marginBottom: 18 }}>Change password</h3>
          <Toast show={!!pwMsg} text={pwMsg} />
          {pwFields._ && <div className="alert alert-error" style={{ marginBottom: 16 }}>{pwFields._}</div>}
          <Input label="Current password" icon={Lock} type="password" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} error={pwFields.currentPassword} />
          <Input label="New password" icon={Lock} type="password" autoComplete="new-password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} error={pwFields.newPassword} />
          <button className="btn btn-dark mt-8"><Lock size={16} /> Update password</button>
        </form>
      </div>
    </Page>
  );
}
