'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import ForceChangePasswordModal from '@/app/components/Auth/ForceChangePasswordModal';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!user) {
        router.push('/');
      } else {
        setLoading(false);
      }
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }
  // 🔐 Forzar cambio de contraseña
  if (user?.force_password_change) {
    return <ForceChangePasswordModal />;
  }
  return <>{children}</>;
}
