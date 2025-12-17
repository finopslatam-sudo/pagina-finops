'use client';

import { useState } from 'react';
import { useAuth } from "@/app/context/AuthContext";
import LoginModal from '@/app/components/Auth/LoginModal';

export default function PublicNavbar() {
  const { user, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <header className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between relative">

            {/* 🔐 LOGIN MOBILE (solo si NO hay usuario) */}
            <div className="md:hidden flex-shrink-0 z-20">
              {!user && (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md text-sm"
                >
                  Login
                </button>
              )}
            </div>

            {/* LOGO MOBILE */}
            <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 z-10">
              <a href="/">
                <img src="/logo2.png" alt="FinOpsLatam Logo" className="h-16 w-auto" />
              </a>
            </div>

            {/* HAMBURGUESA */}
            <div className="md:hidden flex-shrink-0 z-20">
              <button
                className="p-3 rounded-lg border border-gray-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="w-6 h-0.5 bg-gray-700 mb-1.5"></div>
                <div className="w-6 h-0.5 bg-gray-700 mb-1.5"></div>
                <div className="w-6 h-0.5 bg-gray-700"></div>
              </button>
            </div>

            {/* DESKTOP */}
            <div className="hidden md:flex md:items-center md:justify-between md:w-full">
              <a href="/">
                <img src="/logo2.png" className="h-24 w-auto" />
              </a>

              <nav className="flex items-center space-x-8 mx-auto">
                <a href="/" className="nav-link">Inicio</a>
                <a href="/servicios" className="nav-link">Servicios</a>
                <a href="/quienes-somos" className="nav-link">Quiénes Somos</a>
                <a href="/blog" className="nav-link">Blog</a>
                <a href="/contacto" className="nav-link">Contacto</a>
              </nav>

              {/* LOGIN / MI CUENTA */}
              {!user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                    className="border-2 border-blue-500 text-blue-500 px-6 py-2.5 rounded-lg font-semibold"
                  >
                    Login
                  </button>

                  {isLoginDropdownOpen && (
                    <div className="absolute right-0 -mt-1 bg-white border rounded-lg shadow-lg z-50">
                      <button
                        onClick={() => {
                          setIsLoginModalOpen(true);
                          setIsLoginDropdownOpen(false);
                        }}
                        className="px-4 py-3 w-full text-left whitespace-nowrap min-w-[180px]
             border-b border-gray-200 hover:bg-blue-50"
                      >
                        Portal de Socios
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                    className="border-2 border-blue-500 text-blue-500 px-6 py-2.5 rounded-lg font-semibold"
                  >
                    Mi cuenta
                  </button>

                  {isLoginDropdownOpen && (
                    <div className="absolute right-0 -mt-1 bg-white border rounded-lg shadow-lg z-50">
                      <a
                        href="/dashboard"
                        className="block px-4 py-3 border-b border-gray-200 hover:bg-blue-50"
                      >
                        Ir al Dashboard
                      </a>
                      <button
                        onClick={() => {
                          logout();
                          setIsLoginDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* MENÚ MOBILE */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 bg-white border rounded-lg shadow">
              {['/', '/servicios', '/quienes-somos', '/blog', '/contacto'].map((path, i) => (
                <a key={i} href={path} className="block px-4 py-3 hover:bg-blue-50">
                  {path === '/' ? 'Inicio' : path.replace('/', '')}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
