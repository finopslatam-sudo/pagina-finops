'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

export default function UserMenu() {
  const { user, logout, isStaff } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // 🔔 Cerrar menú al hacer click fuera
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  // ⛔ No renderizar si no hay sesión
  if (!user) return null;

  // 🚪 Logout controlado
  const handleLogout = () => {
    setOpen(false);
    setShowToast(true);

    setTimeout(() => {
      logout();
      router.push('/');
    }, 1800);
  };

  return (
    <>
      {/* BOTÓN PRINCIPAL */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          className="border-2 border-blue-500 text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          Mi cuenta
        </button>

        {/* MENÚ DESPLEGABLE */}
        {open && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border overflow-hidden"
          >
            {/* DASHBOARD (todos) */}
            <Link
              href="/dashboard"
              className="block px-4 py-3 hover:bg-blue-50"
              onClick={() => setOpen(false)}
            >
              📊 Mi Dashboard
            </Link>

            {/* PANEL ADMIN (solo staff) */}
            {isStaff && (
              <Link
                href="/dashboard/admin"
                className="block px-4 py-3 hover:bg-blue-50 border-t"
                onClick={() => setOpen(false)}
              >
                🛠️ Panel de Administración
              </Link>
            )}

            {/* PERFIL (solo clientes) */}
            {!isStaff && (
              <Link
                href="/perfil"
                className="block px-4 py-3 hover:bg-blue-50 border-t"
                onClick={() => setOpen(false)}
              >
                ✏️ Editar mi perfil
              </Link>
            )}

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 border-t"
            >
              🚪 Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* TOAST LOGOUT */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-out">
          <div className="bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg">
            ✅ Sesión cerrada con éxito
          </div>
        </div>
      )}
    </>
  );
}
