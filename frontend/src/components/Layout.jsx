import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Users, Warehouse, UserRoundCog, Clock3, Landmark, FileText, Settings, LogOut, X, Shirt } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store';
import Header from './Header';

const links = [
  ['/', 'ড্যাশবোর্ড', LayoutDashboard],
  ['/orders', 'অর্ডার', ShoppingCart],
  ['/customers', 'কাস্টমার', Users],
  ['/inventory', 'ইনভেন্টরি', Warehouse],
  ['/employees', 'কর্মী', UserRoundCog],
  ['/attendance', 'হাজিরা', Clock3],
  ['/shareholders', 'শেয়ারহোল্ডার', Landmark],
  ['/reports', 'রিপোর্টস', FileText],
  ['/settings', 'সেটিংস', Settings]
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const user = useStore(s => s.user);
  const logout = useStore(s => s.logout);
  const navigate = useNavigate();

  const canView = module => user?.role === 'admin' || module !== 'settings' || user?.role === 'manager';

  return (
    <div className={collapsed ? 'app-shell sidebar-collapsed' : 'app-shell'}>
      <aside className={open ? 'sidebar open' : 'sidebar'}>
        <div className="brand">
          <div className="brand-mark">
            <Shirt size={22} />
          </div>
          <div>
            <strong>Two M-s</strong>
            <small>VEIL FACTORY</small>
          </div>
          <button aria-label="মেনু বন্ধ করুন" className="icon-btn close-mobile" onClick={() => setOpen(false)}>
            <X size={19} />
          </button>
        </div>

        <nav>
          {links.filter(([, label]) => label !== 'সেটিংস' || canView('settings')).map(([to, label, Icon]) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="logout" onClick={() => { logout(); navigate('/login'); }}>
            <LogOut size={18} />
            <span>লগ আউট</span>
          </button>
        </div>
      </aside>

      <main className="main">
        <Header onMenu={() => setOpen(true)} />
        <button className="collapse-sidebar" aria-label="সাইডবার সংকুচিত করুন" onClick={() => setCollapsed(!collapsed)}>
          ‹
        </button>
        <Outlet />
      </main>
    </div>
  );
}