'use client';

import { useAuth } from '../context/AuthContext';
import PrivateRoute from '../components/Auth/PrivateRoute';

export default function Costos() {
  const { user, logout } = useAuth();

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* ... (tu contenido) ... */}
      </div>
    </PrivateRoute>
  );
}