'use client';

/* =====================================================
   PUBLIC NAVBAR — FINOPSLATAM
   Navbar global público y de sesión
===================================================== */

/* =====================================================
   IMPORTS
===================================================== */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
 * - Navegación pública (desktop / mobile)
 * - Menú usuario autenticado
 * - Animación UX enterprise
 * - Cierre automático al cambiar ruta
 *
 * NO:
 * - Lógica de permisos
 * - Lógica de negocio
 */
export default function PublicNavbar() {
  const { user } = useAuth();
  const pathname = usePathname();

  /* =========================
     UI STATE
  ========================== */

  const [isLoginDropdownOpen, setIsLoginDropdownOpen] =
    useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] =
    useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  /* =====================================================
     EFFECTS
     - Cerrar menú mobile al cambiar ruta
  ===================================================== */

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
                className="h-16 sm:h-20 w-auto"
              />
            </Link>

            {/* =========================
               MENÚ DESKTOP
            ========================== */}
            {!user && (
              <nav className="hidden md:flex items-center space-x-8 mx-auto">
                <Link href="/" className="nav-link">Inicio</Link>
                <Link href="/servicios" className="nav-link">Servicios</Link>
                <Link href="/quienes-somos" className="nav-link">Quiénes Somos</Link>
                <Link href="/blog" className="nav-link">Blog</Link>
                <Link href="/contacto" className="nav-link">Contacto</Link>
              </nav>
            )}

            {/* =========================
               ACCIONES
            ========================== */}
            <div className="flex items-center gap-4 relative">

              {/* ---------- HAMBURGUESA MOBILE ---------- */}
              {!user && (
                <button
                  onClick={() =>
                    setIsMobileMenuOpen((v) => !v)
                  }
                  className="md:hidden text-gray-700 text-2xl"
                  aria-label="Abrir menú"
                >
                  ☰
                </button>
              )}

              {/* ---------- LOGIN DESKTOP ---------- */}
              {!user && (
                <div className="hidden md:block relative">
                  <button
                    onClick={() =>
                      setIsLoginDropdownOpen(!isLoginDropdownOpen)
                    }
                    className="border-2 border-blue-500 text-blue-500 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition"
                  >
                    Login
                  </button>

                  {isLoginDropdownOpen && (
                    <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg min-w-[200px]">
                      <button
                        onClick={() => {
                          setIsLoginModalOpen(true);
                          setIsLoginDropdownOpen(false);
                        }}
                        className="px-4 py-3 w-full text-left hover:bg-blue-50"
                      >
                        Portal de Socios
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ---------- USER MENU ---------- */}
              {user && <UserMenu />}
            </div>
          </div>
        </div>

        {/* =========================
           MENÚ MOBILE ANIMADO
        ========================== */}
        <AnimatePresence>
          {!user && isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="md:hidden border-t bg-white px-6 py-6 space-y-4"
            >
              <Link href="/" className="block font-medium text-gray-700">
                Inicio
              </Link>
              <Link href="/servicios" className="block font-medium text-gray-700">
                Servicios
              </Link>
              <Link href="/quienes-somos" className="block font-medium text-gray-700">
                Quiénes Somos
              </Link>
              <Link href="/blog" className="block font-medium text-gray-700">
                Blog
              </Link>
              <Link href="/contacto" className="block font-medium text-gray-700">
                Contacto
              </Link>

              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="mt-4 w-full border border-blue-500 text-blue-500 py-2 rounded-lg font-semibold"
              >
                Portal de Socios
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
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
