import { useEffect, useState } from 'react';
import { FileText, TrendingUp, Package, Download } from 'lucide-react';
import { get } from '../api';
import { useStore } from '../store';
import { Button, Empty, FormField, Loading, PageHeader } from '../components/UI';

export default function Reports() {
  const [financial, setFinancial] = useState(null);
  const [profit, setProfit] = useState([]);
  const [valuation, setValuation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState({ from: '', to: '' });
  const setToast = useStore(s => s.setToast);

  async function load() {
    setLoading(true);
    try {
      const q = range.from || range.to ? `?from=${range.from}&to=${range.to}` : '';
      const [a, b, c] = await Promise.all([
        get(`/reports/financial${q}`),
        get(`/reports/profit-loss${q}`),
        get('/reports/valuation')
      ]);
      setFinancial(a.data);
      setProfit(b.data);
      setValuation(c.data);
    } catch (e) {
      setToast(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <PageHeader
        icon={FileText}
        title="রিপোর্টস"
        subtitle="আর্থিক ও ইনভেন্টরি বিশ্লেষণ"
        action={
          <Button variant="outline" icon={Download} onClick={() => window.print()}>প্রিন্ট</Button>
        }
      />

      <section className="panel filter-panel">
        <div>
          <h3>রিপোর্ট ফিল্টার</h3>
          <p>নির্দিষ্ট সময়ের হিসাব দেখুন</p>
        </div>
        <div className="filter-fields">
          <FormField label="শুরু">
            <input type="date" value={range.from} onChange={e => setRange({ ...range, from: e.target.value })} />
          </FormField>
          <FormField label="শেষ">
            <input type="date" value={range.to} onChange={e => setRange({ ...range, to: e.target.value })} />
          </FormField>
          <Button onClick={load}>ফিল্টার</Button>
        </div>
      </section>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="stats-grid report-stats">
            {[
              ['মোট আয়', financial.totalRevenue, ''],
              ['মোট COGS', financial.totalCOGS, ''],
              ['মোট লাভ', financial.totalProfit, 'green'],
              ['মোট অর্ডার', financial.totalOrders, '']
            ].map(([label, value, tone]) => (
              <div className="stat-card" key={label}>
                <div>
                  <span className="stat-label">{label}</span>
                  <strong className={tone}>
                    {label === 'মোট অর্ডার' ? value : `৳${value.toLocaleString()}`}
                  </strong>
                </div>
                <TrendingUp className={tone ? 'green' : ''} size={21} />
              </div>
            ))}
          </div>

          <section className="panel table-panel">
            <div className="panel-head">
              <div>
                <h3>লাভ / ক্ষতি বিস্তারিত</h3>
                <p>প্রতিটি অর্ডারের আর্থিক ফলাফল</p>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>কাস্টমার</th>
                    <th>পণ্য</th>
                    <th>বিক্রয়</th>
                    <th>COGS</th>
                    <th>লাভ</th>
                    <th>তারিখ</th>
                  </tr>
                </thead>
                <tbody>
                  {profit.map(o => (
                    <tr key={o._id}>
                      <td>{o.customer_name}</td>
                      <td>{o.product_type} · {o.quantity}</td>
                      <td>৳{o.total_price.toLocaleString()}</td>
                      <td>৳{o.cogs.toLocaleString()}</td>
                      <td className={o.profit < 0 ? 'danger' : 'green'}>
                        ৳{o.profit.toLocaleString()}
                      </td>
                      <td>{new Date(o.order_date).toLocaleDateString('bn-BD')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!profit.length && <Empty />}
            </div>
          </section>

          <section className="panel table-panel">
            <div className="panel-head">
              <div>
                <h3>ইনভেন্টরি ভ্যালুয়েশন</h3>
                <p>FIFO ভিত্তিক বর্তমান স্টক মূল্য</p>
              </div>
              <Package size={19} />
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>পণ্য</th>
                    <th>ক্যাটাগরি</th>
                    <th>পরিমাণ</th>
                    <th>গড় খরচ</th>
                    <th>মোট মূল্য</th>
                  </tr>
                </thead>
                <tbody>
                  {valuation.map(i => (
                    <tr key={i.product_name}>
                      <td><b>{i.product_name}</b></td>
                      <td>{i.category}</td>
                      <td>{i.total_qty}</td>
                      <td>৳{i.avg_cost.toFixed(2)}</td>
                      <td><b>৳{i.total_value.toLocaleString()}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </>
  );
}