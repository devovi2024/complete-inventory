import { useEffect, useState } from 'react';
import { Pencil, Plus, Save, Trash2, UserRound, Users } from 'lucide-react';
import { del, post, put } from '../api';
import { useStore } from '../store';
import { Button, Empty, FormField, Loading, Modal, PageHeader, Toolbar } from '../components/UI';

const types = ['Regular', 'Wholesale', 'VIP'];

export default function CustomerPage() {
  const data = useStore(s => s.data.customers) || [];
  const load = useStore(s => s.load);
  const setToast = useStore(s => s.setToast);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ type: 'Regular' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load('customers', '/customers')
      .catch(e => setToast(e.message))
      .finally(() => setLoading(false));
  }, [load, setToast]);

  const list = data.filter(c =>
    (type === 'all' || c.type === type) &&
    `${c.name} ${c.phone} ${c.address}`.toLowerCase().includes(search.toLowerCase())
  );

  async function save(e) {
    e.preventDefault();
    try {
      if (modal?._id) await put(`/customers/${modal._id}`, form);
      else await post('/customers', form);
      setToast('কাস্টমার সংরক্ষণ হয়েছে');
      setModal(null);
      load('customers', '/customers');
    } catch (e) {
      setToast(e.message);
    }
  }

  async function remove(id) {
    if (confirm('কাস্টমার মুছে ফেলবেন?')) {
      await del(`/customers/${id}`);
      setToast('কাস্টমার মুছে ফেলা হয়েছে');
      load('customers', '/customers');
    }
  }

  return (
    <>
      <PageHeader
        icon={Users}
        title="কাস্টমার"
        subtitle="গ্রিড ভিউতে সমস্ত কাস্টমার"
        action={
          <>
            <Button variant="outline" onClick={() => window.print()}>PDF</Button>
            <Button icon={Plus} onClick={() => { setForm({ type: 'Regular' }); setModal({}); }}>
              নতুন কাস্টমার
            </Button>
          </>
        }
      />

      <div className="tabs">
        {['all', ...types].map(x => (
          <button className={type === x ? 'active' : ''} key={x} onClick={() => setType(x)}>
            {x === 'all' ? 'সব' : x === 'Wholesale' ? 'পাইকারি' : x === 'Regular' ? 'খুচরা' : 'ভিআইপি'}
          </button>
        ))}
      </div>

      <div className="toolbar-row">
        <Toolbar value={search} onChange={setSearch} placeholder="নাম বা ফোন দিয়ে খুঁজুন..." />
        <Button variant="outline" onClick={() => { setSearch(''); setType('all'); }}>রিসেট</Button>
      </div>

      {loading ? (
        <Loading />
      ) : list.length === 0 ? (
        <Empty text="কোন কাস্টমার পাওয়া যায়নি" />
      ) : (
        <div className="resource-grid">
          {list.map(c => (
            <article className="resource-card" key={c._id}>
              <div className="resource-top">
                <div className="avatar"><UserRound size={19} /></div>
                <span className={`status status-${c.type.toLowerCase()}`}>{c.type}</span>
              </div>
              <h3>{c.name}</h3>
              <p><strong>{c.phone}</strong></p>
              <small>{c.address || 'ঠিকানা দেওয়া হয়নি'}</small>
              <div className="card-actions">
                <Button variant="outline" icon={Pencil} onClick={() => { setForm(c); setModal(c); }}>এডিট</Button>
                <button className="icon-btn danger-btn" onClick={() => remove(c._id)}>
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={modal._id ? 'কাস্টমার সম্পাদনা' : 'নতুন কাস্টমার'} onClose={() => setModal(null)}>
          <form onSubmit={save} className="form-grid">
            <FormField label="নাম">
              <input required value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
            </FormField>

            <FormField label="ফোন">
              <input required value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </FormField>

            <FormField label="টাইপ">
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {types.map(x => <option key={x}>{x}</option>)}
              </select>
            </FormField>

            <FormField label="ঠিকানা">
              <textarea value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} />
            </FormField>

            <Button icon={Save} type="submit">সংরক্ষণ</Button>
          </form>
        </Modal>
      )}
    </>
  );
}