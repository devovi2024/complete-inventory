import { useEffect, useState } from 'react';
import { BarChart3, CheckCircle2, CircleDollarSign, Package, ShoppingCart, TrendingDown, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { get } from '../api';
import { useStore } from '../store';
import { PageHeader, Skeleton, Button } from '../components/UI';

const colors = ['#f5a524', '#4c8dff', '#27b17e', '#ef6b73'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const setToast = useStore(s => s.setToast);

  useEffect(() => {
    Promise.all([
      get('/reports/financial'),
      get('/orders'),
      get('/inventory')
    ])
      .then(([financial, o, i]) => {
        setSummary(financial.data);
        setOrders(o.data);
        setInventory(i.data);
      })
      .catch(e => setToast(e.message))
      .finally(() => setLoading(false));
  }, [setToast]);

  const stats = summary ? [
    ['মোট অর্ডার', summary.totalOrders, ShoppingCart, ''],
    ['ডেলিভারি হয়েছে', summary.deliveredCount, CheckCircle2, 'green'],
    ['মোট আয়', `৳ ${summary.totalRevenue.toLocaleString()}`, CircleDollarSign, ''],
    ['মোট লাভ', `৳ ${summary.totalProfit.toLocaleString()}`, TrendingDown, 'green']
  ] : [];

  const pie = ['Pending', 'Processing', 'Ready', 'Delivered'].map((status, i) => ({
    name: status,
    value: orders.filter(o => o.status === status).length,
    fill: colors[i]
  }));

  const low = inventory.filter(i => i.total_qty < 10);

  return (
    <>
      <PageHeader
        icon={BarChart3}
        title="ড্যাশবোর্ড"
        subtitle="আপনার ফ্যাক্টরির সার্বিক অবস্থা · রিয়েল-টাইম আপডেট"
        action={
          <Button icon={ArrowUpRight} onClick={() => setToast('নতুন অর্ডার তৈরি করতে অর্ডার পেজে যান')}>
            নতুন অর্ডার
          </Button>
        }
      />

      <div className="stats-grid">
        {stats.map(([label, value, Icon, tone]) => (
          <div className="stat-card" key={label}>
            <div>
              <span className="stat-label">{label}</span>
              <strong className={tone}>
                {loading ? <Skeleton className="stat-skeleton" /> : value}
              </strong>
            </div>
            <div className={`stat-icon ${tone}`}>
              <Icon size={21} />
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel chart-panel">
          <div className="panel-head">
            <div>
              <h3>অর্ডার স্ট্যাটাস</h3>
              <p>বর্তমান অর্ডারগুলোর অবস্থান</p>
            </div>
            <span className="panel-mark">LIVE</span>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pie} dataKey="value" innerRadius={65} outerRadius={92} paddingAngle={4}>
                  {pie.map(entry => <Cell key={entry.name} fill={entry.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="legend">
              {pie.map(p => (
                <span key={p.name}>
                  <i style={{ background: p.fill }} />
                  {p.name}
                  <b>{p.value}</b>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="panel chart-panel">
          <div className="panel-head">
            <div>
              <h3>ইনভেন্টরি সারাংশ</h3>
              <p>শীর্ষ পণ্যের স্টক পরিমাণ</p>
            </div>
            <Package size={19} />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={inventory.slice(0, 6)} margin={{ top: 15, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="product_name" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(0, 9)} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="total_qty" fill="#176b87" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      <div className="two-col">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>সাম্প্রতিক অর্ডার</h3>
              <p>শেষ আপডেট হওয়া অর্ডারগুলো</p>
            </div>
            <a href="/orders">সব দেখুন <ArrowRight size={15} /></a>
          </div>
          {loading ? (
            <Skeleton className="table-skeleton" />
          ) : (
            <div className="mini-list">
              {orders.slice(0, 5).map(o => (
                <div className="mini-row" key={o._id}>
                  <span className="order-dot"><ShoppingCart size={15} /></span>
                  <div>
                    <b>{o.customer_name}</b>
                    <small>{o.product_type} · {new Date(o.order_date).toLocaleDateString('bn-BD')}</small>
                  </div>
                  <span className={`status status-${o.status.toLowerCase()}`}>{o.status}</span>
                  <strong>৳{o.total_price.toLocaleString()}</strong>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel alert-panel">
          <div className="panel-head">
            <div>
              <h3>স্টক সতর্কতা</h3>
              <p>দ্রুত নজর দেওয়া প্রয়োজন</p>
            </div>
            <span className="alert-count">{low.length}</span>
          </div>
          {low.length ? (
            <div className="mini-list">
              {low.slice(0, 4).map(i => (
                <div className="mini-row" key={i._id}>
                  <span className="alert-icon"><Package size={15} /></span>
                  <div>
                    <b>{i.product_name}</b>
                    <small>{i.category}</small>
                  </div>
                  <strong className="danger">{i.total_qty} {i.unit}</strong>
                </div>
              ))}
            </div>
          ) : (
            <div className="clear-state">
              <CheckCircle2 size={25} />
              <p>সব স্টক স্বাভাবিক আছে</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}