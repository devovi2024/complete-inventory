import { useEffect, useState } from 'react';
import { Search, Plus, X, LoaderCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store';
export function Button({ children, variant='primary', icon: Icon, ...props }) { return <button className={`btn btn-${variant}`} {...props}>{Icon && <Icon size={16}/>} {children}</button>; }
export function Skeleton({ className='' }) { return <div className={`skeleton ${className}`}/>; }
export function Loading() { return <div className="loading-state"><LoaderCircle className="spin" size={22}/><span>লোড হচ্ছে...</span></div>; }
export function Empty({ text='কোন তথ্য পাওয়া যায়নি' }) { return <div className="empty-state"><AlertCircle size={28}/><p>{text}</p></div>; }
export function PageHeader({ icon: Icon, title, subtitle, action }) { return <div className="page-header"><div className="heading"><div className="heading-icon"><Icon size={22}/></div><div><h1>{title}</h1><p>{subtitle}</p></div></div>{action}</div>; }
export function Toolbar({ value, onChange, placeholder='খুঁজুন...', children }) { return <div className="toolbar"><label className="search"><Search size={17}/><input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}/></label>{children}</div>; }
export function Modal({ title, children, onClose, wide=false }) { const [dialog,setDialog]=useState(null); useEffect(()=>{const previous=document.activeElement; dialog?.focus(); const close=e=>e.key==='Escape'&&onClose(); document.addEventListener('keydown',close); return ()=>{document.removeEventListener('keydown',close); previous?.focus?.()};},[dialog,onClose]); return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><div ref={setDialog} className={`modal ${wide?'modal-wide':''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex="-1"><button aria-label="বন্ধ করুন" className="icon-btn modal-close" onClick={onClose}><X size={19}/></button><h2 id="modal-title">{title}</h2>{children}</div></div>; }
export function FormField({ label, children }) { return <label className="form-field"><span>{label}</span>{children}</label>; }
export function Toast() { const toast = useStore(s => s.toast); return toast ? <div className="toast"><CheckCircle2 size={18}/>{toast}</div> : null; }
export function useResource(key, path) { const load = useStore(s => s.load); const [error, setError] = useState(''); useEffect(() => { load(key,path).catch(e => setError(e.message)); }, [key,path,load]); return { error }; }
