import { StrictMode, lazy, Suspense, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { Loading, Toast } from './components/UI';
import Auth from './pages/Auth';
import ErrorBoundary from './components/ErrorBoundary';
import './styles.css';
import './production.css';
import './ui-polish.css';

const Dashboard = lazy(() => import('./pages/DashboardPage'));
const Orders = lazy(() => import('./pages/OrderPage'));
const CustomerPage = lazy(() => import('./pages/CustomerPage'));
const Inventory = lazy(() => import('./pages/InventoryPage'));
const ResourcePage = lazy(() => import('./pages/ResourcePage'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Shareholders = lazy(() => import('./pages/Shareholders'));  // ✅ Fixed
const Reports = lazy(() => import('./ReportsPage'));
const Settings = lazy(() => import('./SettingsPage'));
const Profile = lazy(() => import('./pages/ProfilePage'));
const TwoFactor = lazy(() => import('./pages/TwoFactorPage'));

function App() {
  const theme = useStore(s => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    const offline = () => document.documentElement.classList.add('offline');
    const online = () => document.documentElement.classList.remove('offline');

    window.addEventListener('offline', offline);
    window.addEventListener('online', online);
    window.addEventListener('unhandledrejection', event => console.error(event.reason));

    return () => {
      window.removeEventListener('offline', offline);
      window.removeEventListener('online', online);
    };
  }, [theme]);

  return (
    <ErrorBoundary>
      <>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth mode="register" />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<Orders />} />
                <Route path="customers" element={<CustomerPage />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="employees" element={<ResourcePage type="employees" />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="shareholders" element={<Shareholders />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="security/2fa" element={<TwoFactor />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Toast />
      </>
    </ErrorBoundary>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);