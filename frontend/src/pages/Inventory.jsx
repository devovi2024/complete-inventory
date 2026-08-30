import { useEffect, useState } from 'react';
import { Boxes, Plus, Layers3, Pencil, Trash2, PackagePlus, Save } from 'lucide-react';
import { del, post, put } from '../api';
import { useStore } from '../store';
import { Button, Empty, FormField, Loading, Modal, PageHeader, Toolbar } from '../components/UI';

export default function Inventory() {
  const data = useStore(s => s.data.inventory) || [];
  const load = useStore(s => s.load);
  const setToast = useStore(s => s.setToast);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ category: 'Fabric', unit: 'Meter' });
  const [layer, setLayer] = useState(null);

  useEffect(() => {
    load('inventory', '/inventory').catch(e => setToast(e.message));
  }, [load, setToast]);

  const list = data.filter(i => i.product_name.toLowerCase().includes(search.toLowerCase()));

  async function save(e) {
    e.preventDefault();
    try {
      if (modal?._id) await put(`/inventory/${modal._id}`, form);
      else await post('/inventory', form);
      setToast('ইনভেন্টরি সংরক্ষণ হয়েছে');
      setModal(null);
      load('inventory', '/inventory');
    } catch (e) {
      setToast(e.message);
    }
  }

  async function addLayer(e) {
    e.preventDefault();
    try {
      await post(`/inventory/${layer._id}/layers`, {
        quantity: Number(form.quantity),
        unitCost: Number(form.unitCost),
        purchaseDate: form.purchaseDate,
        note: form.note
      });
      setToast('নতুন FIFO লেয়ার যোগ হয়েছে');
      setLayer(null);
      load('inventory', '/inventory');
    } catch (e) {
      setToast(e.message);
    }
  }

  async function remove(id) {
    if (confirm('পণ্য মুছে ফেলবেন?')) {
      await del(`/inventory/${id}`);
      load('inventory', '/inventory');
    }
  }

  return (
    <>
      <PageHeader
        icon={Boxes}
        title="ইনভেন্টরি"
        subtitle="FIFO ভিত্তিক স্টক ম্যানেজমেন্ট · সম্পূর্ণ ট্র্যাকিং"
        action={
          <Button icon={Plus} onClick={() => { setForm({ category: 'Fabric', unit: 'Meter' }); setModal({}); }}>
            নতুন স্টক
          </Button>
        }
      />

      <div className="inventory-kpis">
        <div>
          <b>{data.length}</b>
          <span>মোট পণ্য</span>
        </div>
        <div>
          <b>{data.reduce((s, i) => s + i.total_qty, 0)}</b>
          <span>মোট ইউনিট</span>
        </div>
        <div>
          <b>৳{data.reduce((s, i) => s + i.total_qty * i.avg_cost, 0).toLocaleString()}</b>
          <span>মোট মূল্য</span>
        </div>
      </div>

      <Toolbar value={search} onChange={setSearch} placeholder="পণ্যের নাম খুঁজুন..." />

      <section className="panel table-panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>পণ্য</th>
                <th>ক্যাটাগরি</th>
                <th>পরিমাণ</th>
                <th>FIFO লেয়ার</th>
                <th>গড় খরচ</th>
                <th>স্ট্যাটাস</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.map(i => (
                <tr key={i._id}>
                  <td>
                    <b>{i.product_name}</b>
                    <small>{i.unit}</small>
                  </td>
                  <td>{i.category}</td>
                  <td>
                    <strong>{i.total_qty}</strong> {i.unit}
                  </td>
                  <td>
                    <span className="layer-count">
                      <Layers3 size={14} />
                      {i.fifo_layers?.length || 0} লেয়ার
                    </span>
                  </td>
                  <td>৳{i.avg_cost.toFixed(2)}</td>
                  <td>
                    <span className={`status status-${i.status}`}>{i.status}</span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" onClick={() => { setForm({}); setLayer(i); }} title="FIFO layer">
                        <PackagePlus size={16} />
                      </button>
                      <button className="icon-btn" onClick={() => { setForm(i); setModal(i); }}>
                        <Pencil size={16} />
                      </button>
                      <button className="icon-btn danger-btn" onClick={() => remove(i._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!list.length && <Empty />}
        </div>
      </section>

      {modal && (
        <Modal title={modal._id ? 'পণ্য সম্পাদনা' : 'নতুন স্টক'} onClose={() => setModal(null)}>
          <form onSubmit={save} className="form-grid">
            <FormField label="পণ্যের নাম">
              <input required value={form.product_name || ''} onChange={e => setForm({ ...form, product_name: e.target.value })} />
            </FormField>

            <FormField label="ক্যাটাগরি">
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {['Fabric', 'Thread', 'Button', 'Zipper', 'Lace', 'Elastic', 'Packaging', 'Other'].map(x => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </FormField>

            <FormField label="ইউনিট">
              <select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                {['Pcs', 'Meter', 'Kg', 'Gram'].map(x => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </FormField>

            {!modal._id && (
              <>
                <FormField label="প্রাথমিক পরিমাণ">
                  <input type="number" value={form.quantity || ''} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                </FormField>
                <FormField label="ইউনিট খরচ">
                  <input type="number" value={form.unitCost || ''} onChange={e => setForm({ ...form, unitCost: e.target.value })} />
                </FormField>
              </>
            )}

            <Button icon={Save} type="submit">সংরক্ষণ করুন</Button>
          </form>
        </Modal>
      )}

      {layer && (
        <Modal title={`${layer.product_name} · নতুন FIFO লেয়ার`} onClose={() => setLayer(null)}>
          <form onSubmit={addLayer} className="form-grid">
            <FormField label="পরিমাণ">
              <input required type="number" onChange={e => setForm({ ...form, quantity: e.target.value })} />
            </FormField>
            <FormField label="ইউনিট খরচ">
              <input required type="number" step="0.01" onChange={e => setForm({ ...form, unitCost: e.target.value })} />
            </FormField>
            <FormField label="ক্রয় তারিখ">
              <input required type="date" onChange={e => setForm({ ...form, purchaseDate: e.target.value })} />
            </FormField>
            <FormField label="নোট">
              <input value={form.note || ''} onChange={e => setForm({ ...form, note: e.target.value })} />
            </FormField>
            <Button icon={Save} type="submit">লেয়ার যোগ করুন</Button>
          </form>
        </Modal>
      )}
    </>
  );
}