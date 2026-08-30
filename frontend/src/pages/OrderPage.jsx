import { useEffect, useMemo, useState } from 'react';
import { Eye, FileText, Play, Plus, RotateCcw, Save, ShoppingCart, Truck } from 'lucide-react';
import { get, post, put } from '../api';
import { useStore } from '../store';
import { Button, Empty, FormField, Loading, Modal, PageHeader, Toolbar } from '../components/UI';
import '../order.css';

const statuses = ['Pending', 'Processing', 'Ready', 'Delivered', 'Cancelled'];
const tabs = [
  { key: 'all', label: 'সব' },
  { key: 'recent', label: 'সাম্প্রতিক' },
  { key: 'complete', label: 'সম্পন্ন' },
  { key: 'pending', label: 'পেন্ডিং' },
  { key: 'processing', label: 'প্রসেসিং' }
];

export default function OrderPage() {
  const orders = useStore(s => s.data.orders) || [];
  const load = useStore(s => s.load);
  const setToast = useStore(s => s.setToast);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');
  const [modal, setModal] = useState(null);
  const [details, setDetails] = useState(null);
  const [form, setForm] = useState({
    status: 'Pending',
    discount: 0,
    advanced_paid: 0,
    order_date: new Date().toISOString().slice(0, 10)
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([load('orders', '/orders'), get('/customers'), get('/inventory')])
      .then(([, customerResult, inventoryResult]) => {
        setCustomers(customerResult.data);
        setInventory(inventoryResult.data);
      })
      .catch(error => setToast(error.message))
      .finally(() => setLoading(false));
  }, [load, setToast]);

  const visibleOrders = useMemo(() => orders.filter(order => {
    const term = search.toLowerCase();
    const matchesSearch = `${order._id} ${order.customer_name} ${order.product_type}`.toLowerCase().includes(term);
    const matchesTab = tab === 'all' ||
      tab === order.status.toLowerCase() ||
      (tab === 'complete' && order.status === 'Delivered') ||
      (tab === 'recent' && Date.now() - new Date(order.order_date).getTime() < 7 * 86400000);
    return matchesSearch && matchesTab;
  }), [orders, search, tab]);

  function openCreate() {
    setForm({
      status: 'Pending',
      discount: 0,
      advanced_paid: 0,
      order_date: new Date().toISOString().slice(0, 10)
    });
    setModal({});
  }

  function chooseCustomer(id) {
    const customer = customers.find(item => item._id === id);
    setForm({ ...form, customer_id: id, customer_name: customer?.name || '' });
  }

  function chooseProduct(id) {
    const product = inventory.find(item => item._id === id);
    setForm({ ...form, product_id: id, product_type: product?.product_name || '' });
  }

  const total = Math.max(0, Number(form.quantity || 0) * Number(form.unit_price || 0) - Number(form.discount || 0));
  const due = Math.max(0, total - Number(form.advanced_paid || 0));

  async function save(event) {
    event.preventDefault();
    try {
      await post('/orders', {
        ...form,
        quantity: Number(form.quantity),
        unit_price: Number(form.unit_price),
        discount: Number(form.discount || 0),
        advanced_paid: Number(form.advanced_paid || 0)
      });
      setToast('অর্ডার সফলভাবে সংরক্ষণ হয়েছে');
      setModal(null);
      await load('orders', '/orders');
    } catch (error) {
      setToast(error.message);
    }
  }

  async function process(order) {
    try {
      await post(`/orders/${order._id}/process-fifo`, {});
      setToast('FIFO প্রসেস সম্পন্ন হয়েছে');
      await load('orders', '/orders');
    } catch (error) {
      setToast(error.message);
    }
  }

  async function updateStatus(order, status) {
    try {
      await put(`/orders/${order._id}/status`, { status });
      setToast('অর্ডার স্ট্যাটাস আপডেট হয়েছে');
      await load('orders', '/orders');
    } catch (error) {
      setToast(error.message);
    }
  }

  return (
    <>
      <PageHeader
        icon={ShoppingCart}
        title="অর্ডার"
        subtitle="সমস্ত অর্ডার ট্র্যাক ও পরিচালনা করুন"
        action={
          <>
            <Button variant="outline" onClick={() => window.print()}>PDF</Button>
            <Button icon={Plus} onClick={openCreate}>নতুন অর্ডার</Button>
          </>
        }
      />

      <div className="tabs order-tabs">
        {tabs.map(item => (
          <button className={tab === item.key ? 'active' : ''} key={item.key} onClick={() => setTab(item.key)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="order-toolbar">
        <Toolbar value={search} onChange={setSearch} placeholder="অর্ডার আইডি বা কাস্টমার নাম..." />
        <Button variant="outline" icon={RotateCcw} onClick={() => { setSearch(''); setTab('all'); }}>রিসেট</Button>
      </div>

      {loading ? (
        <Loading />
      ) : visibleOrders.length === 0 ? (
        <Empty text="কোন অর্ডার পাওয়া যায়নি" />
      ) : (
        <section className="panel table-panel">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>অর্ডার আইডি</th>
                  <th>কাস্টমার</th>
                  <th>তারিখ</th>
                  <th>পণ্য</th>
                  <th>মোট (৳)</th>
                  <th>স্ট্যাটাস</th>
                  <th>অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrders.map(order => (
                  <tr key={order._id}>
                    <td><b>ORD-{order._id.slice(-3).toUpperCase()}</b></td>
                    <td>{order.customer_name}</td>
                    <td>{new Date(order.order_date).toLocaleDateString('bn-BD')}</td>
                    <td>{order.product_type} <small>x{order.quantity}</small></td>
                    <td><b>৳ {order.total_price.toFixed(2)}</b></td>
                    <td>
                      <span className={`status status-${order.status.toLowerCase()}`}>{order.status}</span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" title="বিস্তারিত" onClick={() => setDetails(order)}>
                          <Eye size={16} />
                        </button>
                        {order.status !== 'Delivered' && (
                          <button className="icon-btn" title="স্ট্যাটাস" onClick={() => updateStatus(order, 'Processing')}>
                            <Truck size={16} />
                          </button>
                        )}
                        <button className="icon-btn" title="FIFO প্রসেস" onClick={() => process(order)}>
                          <Play size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {modal && (
        <Modal title="নতুন অর্ডার যোগ" wide onClose={() => setModal(null)}>
          <form onSubmit={save} className="form-grid">
            <FormField label="আইডি">
              <input value="অটো জেনারেট হবে" disabled />
            </FormField>

            <FormField label="কাস্টমার">
              <select required value={form.customer_id || ''} onChange={event => chooseCustomer(event.target.value)}>
                <option value="">কাস্টমার নির্বাচন করুন</option>
                {customers.map(customer => (
                  <option key={customer._id} value={customer._id}>{customer.name}</option>
                ))}
              </select>
            </FormField>

            <FormField label="কাস্টমার নাম">
              <input value={form.customer_name || ''} readOnly />
            </FormField>

            <FormField label="অর্ডার তারিখ">
              <input required type="date" value={form.order_date || ''} onChange={event => setForm({ ...form, order_date: event.target.value })} />
            </FormField>

            <FormField label="ডেলিভারি তারিখ">
              <input type="date" value={form.delivery_date || ''} onChange={event => setForm({ ...form, delivery_date: event.target.value })} />
            </FormField>

            <FormField label="পণ্য আইডি (ইনভেন্টরি)">
              <select required value={form.product_id || ''} onChange={event => chooseProduct(event.target.value)}>
                <option value="">পণ্য নির্বাচন করুন</option>
                {inventory.map(item => (
                  <option key={item._id} value={item._id}>
                    {item.product_name} ({item.total_qty} {item.unit})
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="পণ্যের ধরন">
              <input required value={form.product_type || ''} onChange={event => setForm({ ...form, product_type: event.target.value })} />
            </FormField>

            <FormField label="পরিমাণ">
              <input required min="0.01" type="number" value={form.quantity || ''} onChange={event => setForm({ ...form, quantity: event.target.value })} />
            </FormField>

            <FormField label="ইউনিট মূল্য">
              <input required min="0" type="number" step="0.01" value={form.unit_price || ''} onChange={event => setForm({ ...form, unit_price: event.target.value })} />
            </FormField>

            <FormField label="মোট">
              <input value={`৳ ${total.toFixed(2)}`} readOnly />
            </FormField>

            <FormField label="ডিসকাউন্ট">
              <input type="number" min="0" value={form.discount} onChange={event => setForm({ ...form, discount: event.target.value })} />
            </FormField>

            <FormField label="অগ্রিম">
              <input type="number" min="0" value={form.advanced_paid} onChange={event => setForm({ ...form, advanced_paid: event.target.value })} />
            </FormField>

            <FormField label="বাকি">
              <input value={`৳ ${due.toFixed(2)}`} readOnly />
            </FormField>

            <FormField label="স্ট্যাটাস">
              <select value={form.status} onChange={event => setForm({ ...form, status: event.target.value })}>
                {statuses.map(status => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </FormField>

            <FormField label="নোট">
              <textarea rows="3" value={form.note || ''} onChange={event => setForm({ ...form, note: event.target.value })} />
            </FormField>

            <Button icon={Save} type="submit">সংরক্ষণ</Button>
          </form>
        </Modal>
      )}

      {details && (
        <Modal title="অর্ডার বিস্তারিত" onClose={() => setDetails(null)}>
          <div className="order-detail">
            <div>
              <span>অর্ডার আইডি</span>
              <b>ORD-{details._id.slice(-3).toUpperCase()}</b>
            </div>
            <div>
              <span>কাস্টমার</span>
              <b>{details.customer_name}</b>
            </div>
            <div>
              <span>পণ্য</span>
              <b>{details.product_type} · x{details.quantity}</b>
            </div>
            <div>
              <span>মোট</span>
              <b>৳ {details.total_price.toFixed(2)}</b>
            </div>
            <div>
              <span>COGS</span>
              <b>৳ {details.cogs.toFixed(2)}</b>
            </div>
            <div>
              <span>লাভ</span>
              <b className={details.profit >= 0 ? 'green' : 'danger'}>৳ {details.profit.toFixed(2)}</b>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}