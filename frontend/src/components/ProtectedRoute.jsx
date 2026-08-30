import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../store';

export default function ProtectedRoute() {
  const user = useStore(s => s.user);
  const location = useLocation();

  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}