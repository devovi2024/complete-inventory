import { useEffect, useState } from 'react';
import { Bell, Building2, Save, Settings as SettingsIcon } from 'lucide-react';
import { get, put } from './api';
import { useStore } from './store';
import { Button, FormField, Loading, PageHeader } from './components/UI';

const fields = [
  ['company_name', 'কোম্পানির নাম'],
  ['company_address', 'ঠিকানা'],
  ['company_phone', 'ফোন'],
  ['company_email', 'ইমেইল'],
  ['company_website', 'ওয়েবসাইট'],
  ['company_tin', 'টিন / ব্যবসা নিবন্ধন'],
  ['factory_name', 'ফ্যাক্টরির নাম'],
  ['factory_location', 'অবস্থান'],
  ['shift_start', 'শিফট শুরু'],
  ['shift_end', 'শিফট শেষ'],
  ['break_time', 'মধ্যাহ্ন বিরতি (মিনিট)'],
  ['weekly_off', 'সাপ্তাহিক ছুটির দিন'],
  ['working_days', 'কাজের দিন (সপ্তাহে)'],
  ['currency', 'মুদ্রা'],
  ['tax_rate', 'কর হার (%)'],
  ['invoice_prefix', 'ইনভয়েস প্রিফিক্স'],
  ['payment_terms', 'পেমেন্ট শর্তাবলী (দিন)'],
  ['default_discount', 'ডিফল্ট ডিসকাউন্ট (%)'],
  ['default_advance', 'ডিফল্ট অগ্রিম (%)'],
  ['default_unit', 'ডিফল্ট ইউনিট'],
  ['quality_standard', 'মান নিয়ন্ত্রণ মান'],
  ['lead_time', 'লিড টাইম (দিন)'],
  ['overtime_allowed', 'ওভারটাইম অনুমোদিত'],
  ['low_stock_threshold', 'সতর্কতা থ্রেশহোল্ড (স্টক)'],
  ['auto_backup', 'অটো-ব্যাকআপ সময় (ঘন্টা)']
];

export default function SettingsPage() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const setToast = useStore(s => s.setToast);

  useEffect(() => {
    get('/settings')
      .then(r => setForm(r.data))
      .catch(e => setToast(e.message))
      .finally(() => setLoading(false));
  }, [setToast]);

  const set = (key, value) => setForm({ ...form, [key]: value });

  async function save(e) {
    e.preventDefault();
    try {
      await put('/settings', form);
      setToast('সেটিংস সংরক্ষণ হয়েছে');
    } catch (e) {
      setToast(e.message);
    }
  }

  if (loading) return <Loading />;

  const render = (keys) => (
    <>
      {keys.map(key => {
        const item = fields.find(x => x[0] === key);
        return (
          <FormField key={key} label={item[1]}>
            <input
              type={key.includes('time') || key.includes('start') || key.includes('end')
                ? 'time'
                : key.includes('email')
                ? 'email'
                : 'text'}
              value={form[key] ?? ''}
              onChange={e => set(key, e.target.value)}
            />
          </FormField>
        );
      })}
    </>
  );

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
          {render(fields.slice(0, 6).map(x => x[0]))}
        </section>

        <section className="panel settings-panel">
          <h3><SettingsIcon size={18} /> ফ্যাক্টরি সেটিংস</h3>
          {render(fields.slice(6, 13).map(x => x[0]))}
        </section>

        <section className="panel settings-panel">
          <h3><Bell size={18} /> আর্থিক সেটিংস</h3>
          {render(fields.slice(13, 20).map(x => x[0]))}
        </section>

        <section className="panel settings-panel">
          <h3><Bell size={18} /> উৎপাদন ও বিজ্ঞপ্তি</h3>
          {render(fields.slice(20).map(x => x[0]))}
          
          {['email_alerts', 'sms_alerts', 'low_stock_alerts', 'attendance_alerts'].map(key => (
            <label className="check" key={key}>
              <input
                type="checkbox"
                checked={!!form[key]}
                onChange={e => set(key, e.target.checked)}
              />
              {key.replace('_', ' ')} সক্রিয়
            </label>
          ))}
        </section>
      </form>
    </>
  );
}