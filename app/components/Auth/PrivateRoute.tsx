'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import ForceChangePasswordModal from '@/app/components/Auth/ForceChangePasswordModal';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, isAuthReady } = useAuth(); // 👈 isAuthReady agregado
  const router = useRouter();

  // 🔁 Redirección SOLO cuando el contexto ya está listo
  useEffect(() => {
    if (isAuthReady && !user) {
      router.replace('/');
    }
  }, [isAuthReady, user, router]);

  // ⏳ Esperar a que AuthContext termine de rehidratarse
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Cargando sesión…
      </div>
    );
  }

  // 🛑 Contexto listo, pero sin sesión
  if (!user) {
    return null;
  }

  return (
    <>
      {/* 🔐 Overlay obligatorio si corresponde */}
      {user.force_password_change && <ForceChangePasswordModal />}

      {/* ✅ CONTENIDO PROTEGIDO */}
      {children}
    </>
  );
}
