import { useEffect, useState } from 'react';
import { Clock3, Pencil, Plus, Save, Trash2 } from 'lucide-react';
import { del, get, post, put } from '../api';
import { useStore } from '../store';
import { Button, Empty, FormField, Loading, Modal, PageHeader, Toolbar } from '../components/UI';
import '../attendance.css';

const statuses = ['Present', 'Late', 'Absent', 'On Leave'];

export default function Attendance() {
  const records = useStore(s => s.data.attendance) || [];
  const load = useStore(s => s.load);
  const setToast = useStore(s => s.setToast);
  const [employees, setEmployees] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [dateResults, setDateResults] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ status: 'Present', date: new Date().toISOString().slice(0, 10) });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([load('attendance', '/attendance'), get('/employees')])
      .then(([, employeeResult]) => setEmployees(employeeResult.data))
      .catch(error => setToast(error.message))
      .finally(() => setLoading(false));
  }, [load, setToast]);

  const filtered = records.filter(record => {
    const matchesName = (record.employee_name || '').toLowerCase().includes(nameFilter.toLowerCase());
    const matchesDate = !dateFilter || String(record.date).slice(0, 10) === dateFilter;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesName && matchesDate && matchesStatus;
  });

  function openForm(record = null) {
    setForm(record ? { ...record, date: String(record.date).slice(0, 10) } : { status: 'Present', date: new Date().toISOString().slice(0, 10) });
    setModal(record || {});
  }

  async function save(event) {
    event.preventDefault();
    const employee = employees.find(item => item._id === form.employee_id);
    const payload = { ...form, employee_id: form.employee_id || employee?._id, employee_name: form.employee_name || employee?.name };
    try {
      if (modal?._id) await put(`/attendance/${modal._id}`, payload);
      else await post('/attendance', payload);
      setToast('হাজিরা সফলভাবে সংরক্ষণ হয়েছে');
      setModal(null);
      await load('attendance', '/attendance');
    } catch (error) { setToast(error.message); }
  }

  async function remove(id) {
    if (!confirm('এই হাজিরা রেকর্ডটি মুছে ফেলবেন?')) return;
    try { await del(`/attendance/${id}`); setToast('রেকর্ড মুছে ফেলা হয়েছে'); await load('attendance', '/attendance'); }
    catch (error) { setToast(error.message); }
  }

  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = employees.map(employee => records.find(record => record.employee_id === employee._id && String(record.date).slice(0, 10) === today));
  const countStatus = status => todayRecords.filter(record => record?.status === status).length;
  const dateRecords = dateResults || employees.map(employee => records.find(record => record.employee_id === employee._id && String(record.date).slice(0, 10) === selectedDate));
  return <>
    <PageHeader icon={Clock3} title="হাজিরা" subtitle="দৈনন্দিন উপস্থিতি রেকর্ড" action={<><Button variant="outline" onClick={() => window.print()}>PDF</Button><Button icon={Plus} onClick={() => openForm()}>নতুন এন্ট্রি</Button></>} />
    <section className="attendance-highlight panel"><div className="section-title-row"><div><h3>আজকের হাজিরা <span>{today}</span><i>লাইভ</i></h3></div></div><div className="attendance-summary"><span><b className="green">{countStatus('Present')}</b>উপস্থিত</span><span><b className="amber">{countStatus('Late')}</b>দেরি</span><span><b className="danger">{countStatus('Absent')}</b>অনুপস্থিত</span><span><b className="amber">{countStatus('On Leave')}</b>ছুটি</span><span><b>{employees.length - todayRecords.filter(Boolean).length}</b>রেকর্ড নেই</span><span><b>{employees.length}</b>মোট</span></div><div className="attendance-people">{employees.map((employee, index) => { const record = todayRecords[index]; return <div className="person-card" key={employee._id}><div className="person-avatar">{employee.name.slice(0, 2).toUpperCase()}</div><div><b>{employee.name}</b><small>{employee.designation}</small>{record?.check_in && <small>{record.check_in}</small>}</div><span className={`status ${record ? `status-${record.status.toLowerCase().replace(' ', '-')}` : ''}`}>{record?.status || 'রেকর্ড নেই'}</span></div>; })}</div></section>
    <section className="date-attendance panel"><div className="section-title-row"><div><h3>তারিখ অনুযায়ী হাজিরা <i>প্রিমিয়াম</i></h3><p>নির্দিষ্ট তারিখের উপস্থিতি দেখুন</p></div><div className="date-actions"><input type="date" value={selectedDate} onChange={event => setSelectedDate(event.target.value)} /><Button onClick={() => setDateResults(dateRecords)}>দেখুন</Button><Button variant="outline" onClick={() => { setDateResults(null); setSelectedDate(today); }}>রিসেট</Button></div></div>{dateResults ? <div className="date-result-grid">{dateRecords.map((record, index) => <div className="date-result" key={employees[index]?._id || index}><div><b>{employees[index]?.name}</b><small>{employees[index]?.designation}</small></div><span className={`status ${record ? `status-${record.status.toLowerCase().replace(' ', '-')}` : ''}`}>{record?.status || 'রেকর্ড নেই'}</span></div>)}</div> : <div className="date-empty"><Clock3 size={30}/><b>একটি তারিখ নির্বাচন করে দেখুন</b><span>কে উপস্থিত ছিল তার তালিকা দেখাবে</span></div>}</section>
    <div className="attendance-history"><div className="attendance-history-head"><div className="tabs">{['all', ...statuses].map(status => <button className={statusFilter === status ? 'active' : ''} key={status} onClick={() => setStatusFilter(status)}>{status === 'all' ? 'সব' : status}</button>)}</div><div className="history-search"><Toolbar value={nameFilter} onChange={setNameFilter} placeholder="কর্মীর নাম দিয়ে খুঁজুন..." /><input type="date" value={dateFilter} onChange={event => setDateFilter(event.target.value)} /></div></div>{loading ? <Loading /> : filtered.length === 0 ? <Empty text="কোন হাজিরা রেকর্ড পাওয়া যায়নি" /> : <section className="panel table-panel"><div className="table-wrap"><table><thead><tr><th>কর্মী নাম</th><th>তারিখ</th><th>চেক-ইন</th><th>চেক-আউট</th><th>স্ট্যাটাস</th><th>অ্যাকশন</th></tr></thead><tbody>{filtered.map(record => <tr key={record._id}><td><b>{record.employee_name}</b></td><td>{new Date(record.date).toLocaleDateString('bn-BD')}</td><td>{record.check_in || '--'}</td><td>{record.check_out || '--'}</td><td><span className={`status status-${record.status.toLowerCase().replace(' ', '-')}`}>{record.status}</span></td><td><div className="row-actions"><button className="icon-btn" onClick={() => openForm(record)}><Pencil size={16} /></button><button className="icon-btn danger-btn" onClick={() => remove(record._id)}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div></section>}</div>
    {modal && <Modal title={modal._id ? 'হাজিরা সম্পাদনা' : 'নতুন হাজিরা'} onClose={() => setModal(null)}><form onSubmit={save} className="form-grid"><FormField label="কর্মী নাম"><select required value={form.employee_id || ''} onChange={event => { const employee = employees.find(item => item._id === event.target.value); setForm({ ...form, employee_id: employee?._id, employee_name: employee?.name }); }}><option value="">কর্মী নির্বাচন করুন</option>{employees.map(employee => <option key={employee._id} value={employee._id}>{employee.name}</option>)}</select></FormField><FormField label="তারিখ"><input required type="date" value={form.date || ''} onChange={event => setForm({ ...form, date: event.target.value })} /></FormField><FormField label="চেক-ইন"><input type="time" value={form.check_in || ''} onChange={event => setForm({ ...form, check_in: event.target.value })} /></FormField><FormField label="চেক-আউট"><input type="time" value={form.check_out || ''} onChange={event => setForm({ ...form, check_out: event.target.value })} /></FormField><FormField label="স্ট্যাটাস"><select value={form.status || 'Present'} onChange={event => setForm({ ...form, status: event.target.value })}>{statuses.map(status => <option key={status}>{status}</option>)}</select></FormField><Button icon={Save} type="submit">সংরক্ষণ করুন</Button></form></Modal>}
  </>;
}
