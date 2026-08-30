import { useEffect, useState } from 'react';
import { LockKeyhole, Save, ShieldCheck, UserCircle } from 'lucide-react';
import { get, put } from '../api';
import { useStore } from '../store';
import { Button, FormField, Loading, PageHeader } from '../components/UI';
import '../account.css';

export default function ProfilePage() {
  const user = useStore(s => s.user);
  const setToast = useStore(s => s.setToast);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '' });
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get('/users/sessions')
      .then(r => setSessions(r.data))
      .catch(e => setToast(e.message))
      .finally(() => setLoading(false));
  }, [setToast]);

  async function save(e) {
    e.preventDefault();
    try {
      await put('/users/profile', form);
      setToast('প্রোফাইল সংরক্ষণ হয়েছে');
    } catch (e) {
      setToast(e.message);
    }
  }

  async function change(e) {
    e.preventDefault();
    try {
      await put('/users/password', password);
      setPassword({ currentPassword: '', newPassword: '' });
      setToast('পাসওয়ার্ড পরিবর্তন হয়েছে');
    } catch (e) {
      setToast(e.message);
    }
  }

  return (
    <>
      <PageHeader
        icon={UserCircle}
        title="প্রোফাইল"
        subtitle="আপনার ব্যক্তিগত তথ্য ও নিরাপত্তা"
      />

      <div className="profile-grid">
        <section className="panel settings-panel">
          <h3><UserCircle size={18} /> ব্যক্তিগত তথ্য</h3>
          <div className="profile-large-avatar">
            {(user?.name || 'U').slice(0, 1).toUpperCase()}
          </div>
          <form onSubmit={save}>
            <FormField label="নাম">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </FormField>
            <FormField label="ইমেইল">
              <input value={user?.email || ''} disabled />
            </FormField>
            <FormField label="ফোন">
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </FormField>
            <Button icon={Save} type="submit">সংরক্ষণ</Button>
          </form>
        </section>

        <section className="panel settings-panel">
          <h3><LockKeyhole size={18} /> পাসওয়ার্ড পরিবর্তন</h3>
          <form onSubmit={change}>
            <FormField label="পুরোনো পাসওয়ার্ড">
              <input
                required
                type="password"
                value={password.currentPassword}
                onChange={e => setPassword({ ...password, currentPassword: e.target.value })}
              />
            </FormField>
            <FormField label="নতুন পাসওয়ার্ড">
              <input
                required
                minLength="8"
                type="password"
                value={password.newPassword}
                onChange={e => setPassword({ ...password, newPassword: e.target.value })}
              />
            </FormField>
            <Button icon={ShieldCheck} type="submit">পাসওয়ার্ড আপডেট</Button>
          </form>

          <h3 className="sessions-title">সক্রিয় সেশন</h3>
          {loading ? (
            <Loading />
          ) : (
            sessions.map((session, index) => (
              <div className="session-row" key={session._id}>
                <div>
                  <b>{index === 0 ? 'বর্তমান ডিভাইস' : 'অন্য ডিভাইস'}</b>
                  <small>{session.ip || 'Unknown IP'} · {new Date(session.updatedAt).toLocaleString('bn-BD')}</small>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </>
  );
}