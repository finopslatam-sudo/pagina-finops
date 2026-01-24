'use client';

/* =====================================================
   PUBLIC NAVBAR — FINOPSLATAM
   Navbar global público y de sesión
===================================================== */

/* =====================================================
   IMPORTS
===================================================== */

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

import LoginModal from '@/app/components/Auth/LoginModal';
import UserMenu from '@/app/components/Auth/UserMenu';

/* =====================================================
   COMPONENT
===================================================== */

/**
 * PublicNavbar
 *
 * Responsabilidad:
 * - Mostrar navegación pública (NO autenticados)
 * - Mostrar menú de usuario autenticado
 * - Exponer acceso al Portal de Socios
 *
 * Importante:
 * - NO valida permisos
 * - NO contiene lógica de negocio
 * - Depende únicamente de AuthContext
 */
export default function PublicNavbar() {
  const { user } = useAuth();

  /* =========================
     UI STATE
  ========================== */

  const [isLoginDropdownOpen, setIsLoginDropdownOpen] =
    useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] =
    useState(false);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      <header className="relative z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">

            {/* =========================
               LOGO
            ========================== */}
            <Link href="/" className="flex items-center">
              <img
                src="/logo2.png"
                alt="FinOpsLatam"
                className="h-24 w-auto"
              />
            </Link>

            {/* =========================
               MENÚ PÚBLICO
               (solo NO autenticados)
            ========================== */}
            {!user && (
              <nav className="hidden md:flex items-center space-x-8 mx-auto">
                <Link href="/" className="nav-link">
                  Inicio
                </Link>
                <Link href="/servicios" className="nav-link">
                  Servicios
                </Link>
                <Link href="/quienes-somos" className="nav-link">
                  Quiénes Somos
                </Link>
                <Link href="/blog" className="nav-link">
                  Blog
                </Link>
                <Link href="/contacto" className="nav-link">
                  Contacto
                </Link>
              </nav>
            )}

            {/* =========================
               ACCIONES
            ========================== */}
            <div className="relative">

              {/* ---------- LOGIN ---------- */}
              {!user && (
                <>
                  <button
                    onClick={() =>
                      setIsLoginDropdownOpen(
                        !isLoginDropdownOpen
                      )
                    }
                    className="border-2 border-blue-500 text-blue-500 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition"
                  >
                    Login
                  </button>

                  {/* DROPDOWN */}
                  {isLoginDropdownOpen && (
                    <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg min-w-[200px]">
                      <button
                        onClick={() => {
                          setIsLoginModalOpen(true);
                          setIsLoginDropdownOpen(false);
                        }}
                        className="px-4 py-3 w-full text-left whitespace-nowrap hover:bg-blue-50"
                      >
                        Portal de Socios
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* ---------- USER MENU ---------- */}
              {user && <UserMenu />}
            </div>

          </div>
        </div>
      </header>

      {/* =========================
         LOGIN MODAL
      ========================== */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
