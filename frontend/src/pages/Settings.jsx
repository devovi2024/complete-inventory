import { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Save, Building2, Bell } from 'lucide-react';
import { get, put } from '../api';
import { useStore } from '../store';
import { Button, FormField, Loading, PageHeader } from '../components/UI';

export default function Settings() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const setToast = useStore(s => s.setToast);

  useEffect(() => {
    get('/settings')
      .then(r => setForm(r.data))
      .catch(e => setToast(e.message))
      .finally(() => setLoading(false));
  }, [setToast]);

  function field(key, label, type = 'text') {
    return (
      <FormField label={label}>
        <input
          type={type}
          value={form[key] || ''}
          onChange={e => setForm({ ...form, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
        />
      </FormField>
    );
  }

  async function save(e) {
    e?.preventDefault();
    try {
      await put('/settings', form);
      setToast('সেটিংস সংরক্ষণ হয়েছে');
    } catch (e) {
      setToast(e.message);
    }
  }

  if (loading) return <Loading />;

  return (
    <>
      <PageHeader
        icon={SettingsIcon}
        title="সেটিংস"
        subtitle="ফ্যাক্টরি ও ব্যবসার সেটিংস কনফিগার করুন"
        action={
          <Button icon={Save} onClick={save}>সংরক্ষণ</Button>
        }
      />

      <form onSubmit={save} className="settings-grid">
        <section className="panel settings-panel">
          <h3><Building2 size={18} /> কোম্পানির তথ্য</h3>
          {field('company_name', 'কোম্পানির নাম')}
          {field('company_address', 'ঠিকানা')}
          {field('company_phone', 'ফোন')}
          {field('company_email', 'ইমেইল', 'email')}
          {field('company_website', 'ওয়েবসাইট')}
          {field('company_tin', 'টিন / ব্যবসা নিবন্ধন')}
        </section>

        <section className="panel settings-panel">
          <h3><SettingsIcon size={18} /> ফ্যাক্টরি সেটিংস</h3>
          {field('factory_name', 'ফ্যাক্টরির নাম')}
          {field('factory_location', 'অবস্থান')}
          {field('shift_start', 'শিফট শুরু', 'time')}
          {field('shift_end', 'শিফট শেষ', 'time')}
          {field('break_time', 'বিরতি (মিনিট)', 'number')}
          {field('lead_time', 'লিড টাইম (দিন)', 'number')}
        </section>

        <section className="panel settings-panel">
          <h3><Bell size={18} /> আর্থিক ও বিজ্ঞপ্তি</h3>
          {field('currency', 'মুদ্রা')}
          {field('tax_rate', 'কর হার (%)', 'number')}
          {field('invoice_prefix', 'ইনভয়েস প্রিফিক্স')}
          {field('default_discount', 'ডিফল্ট ডিসকাউন্ট (%)', 'number')}
          {field('low_stock_threshold', 'কম স্টক থ্রেশহোল্ড', 'number')}
          {field('auto_backup', 'অটো ব্যাকআপ (ঘন্টা)', 'number')}
          <label className="check">
            <input
              type="checkbox"
              checked={!!form.low_stock_alerts}
              onChange={e => setForm({ ...form, low_stock_alerts: e.target.checked })}
            />
            কম স্টক সতর্কতা সক্রিয়
          </label>
        </section>
      </form>
    </>
  );
}