'use client';

import { useAuth } from "@/app/context/AuthContext";
import { useState } from 'react';
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

            {/* LOGO */}
            <a href="/">
              <img src="/logo2.png" className="h-24 w-auto" />
            </a>

            {/* 👉 MENÚ SOLO PARA USUARIOS NO LOGEADOS */}
            {!user && (
              <nav className="hidden md:flex items-center space-x-8 mx-auto">
                <a href="/" className="nav-link">Inicio</a>
                <a href="/servicios" className="nav-link">Servicios</a>
                <a href="/quienes-somos" className="nav-link">Quiénes Somos</a>
                <a href="/blog" className="nav-link">Blog</a>
                <a href="/contacto" className="nav-link">Contacto</a>
              </nav>
            )}

            {/* 👉 ACCIONES DERECHA */}
            <div className="relative">

              {/* USUARIO NO LOGEADO */}
              {!user && (
                <>
                  <button
                    onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                    className="border-2 border-blue-500 text-blue-500 px-6 py-2.5 rounded-lg font-semibold"
                  >
                    Login
                  </button>

                  {isLoginDropdownOpen && (
                    <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg">
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
                </>
              )}

              {/* USUARIO LOGEADO */}
              {user && (
                <div className="relative">
                  <button
                    onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                    className="border-2 border-blue-500 text-blue-500 px-6 py-2.5 rounded-lg font-semibold"
                  >
                    Mi cuenta
                  </button>

                  {isLoginDropdownOpen && (
                    <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg min-w-[200px]">
                      <a
                        href="/dashboard"
                        className="block px-4 py-3 hover:bg-blue-50 border-b"
                      >
                        Ir al Dashboard
                      </a>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
