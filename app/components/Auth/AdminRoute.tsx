'use client';

import { useAuth } from '@/app/context/AuthContext';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-center mt-20">Debes iniciar sesión</p>;
  }

  if (user.role !== 'admin') {
    return <p className="text-center mt-20 text-red-600">Acceso restringido</p>;
  }

  return <>{children}</>;
}
