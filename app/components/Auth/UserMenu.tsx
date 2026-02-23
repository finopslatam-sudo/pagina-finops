'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

/* =====================================================
   COMPONENT
===================================================== */

/**
 * UserMenu
 *
 * Menú contextual del usuario autenticado.
 *
 * - Visible solo con sesión activa
 * - Refleja permisos desde AuthContext
 * - Logout seguro y centralizado
 * - UX consistente para SaaS enterprise
 */
export default function UserMenu() {
  const { user, logout, isStaff } = useAuth();

  /* =========================
     STATE
  ========================== */

  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  /* =====================================================
     CLOSE MENU ON OUTSIDE CLICK
  ===================================================== */

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  /* =====================================================
     GUARD
     (No sesión → no render)
  ===================================================== */

  if (!user) return null;

  /* =====================================================
     LOGOUT HANDLER
     - UX suave
     - Logout real delegado al context
  ===================================================== */

  const handleLogout = () => {
    setOpen(false);
    setShowToast(true);

    /**
     * Delay solo visual.
     * AuthContext maneja limpieza + redirect.
     */
    setTimeout(() => {
      logout(); // 🔐 Redirige a "/"
    }, 1200);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      {/* =========================
         MAIN BUTTON
      ========================== */}
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

        {/* =========================
           DROPDOWN MENU
        ========================== */}
        {open && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border overflow-hidden z-40"
          >

            {/* =========================
              DASHBOARD EJECUTIVO — TODOS
            ========================== */}
            <Link
              href="/dashboard"
              className="block px-4 py-3 hover:bg-blue-50"
              onClick={() => setOpen(false)}
            >
              📊 Dashboard Ejecutivo
            </Link>

            {/* =========================
              STAFF MENU
            ========================== */}
            {isStaff && (
              <>
                <Link
                  href="/dashboard/users"
                  className="block px-4 py-3 hover:bg-blue-50 border-t"
                  onClick={() => setOpen(false)}
                >
                  👥 Panel de Usuarios
                </Link>

                <Link
                  href="/dashboard/clients"
                  className="block px-4 py-3 hover:bg-blue-50"
                  onClick={() => setOpen(false)}
                >
                  🏢 Panel de Clientes
                </Link>
              </>
            )}

            {/* =========================
              CLIENT MENU
            ========================== */}
            {!isStaff && (
              <>
                <Link
                  href="/dashboard/findings"
                  className="block px-4 py-3 hover:bg-blue-50 border-t"
                  onClick={() => setOpen(false)}
                >
                  🔍 Asset & Findings
                </Link>

                <Link
                  href="/dashboard/costos"
                  className="block px-4 py-3 hover:bg-blue-50"
                  onClick={() => setOpen(false)}
                >
                  💰 Costos & Tendencias
                </Link>

                <Link
                  href="/dashboard/gobernanza"
                  className="block px-4 py-3 hover:bg-blue-50"
                  onClick={() => setOpen(false)}
                >
                  ⚙ Gobernanza
                </Link>

                <Link
                  href="/perfil"
                  className="block px-4 py-3 hover:bg-blue-50 border-t"
                  onClick={() => setOpen(false)}
                >
                  👤 Mi Perfil
                </Link>
              </>
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
      {/* =========================
         LOGOUT TOAST
      ========================== */}
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
