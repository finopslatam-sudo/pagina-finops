'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

/**
 * Cliente autenticado
 * (se mantiene para edición de perfil futura)
 */
export interface Client {
  id: number;
  email: string;
  name?: string;
  company_name?: string;
  contact_name?: string;
}

export default function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // 🔔 Cerrar menú si se hace click fuera
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  if (!user) return null; // ⛔ NO mostrar nada si no hay sesión

  const handleLogout = () => {
    setOpen(false);
    logout();

    // Mostrar toast
    setShowToast(true);

    // Ocultar toast y redirigir
    setTimeout(() => {
      setShowToast(false);
      router.push("/"); // 👈 volver al inicio
    }, 1800);
  };

  return (
    <>
      {/* BOTÓN */}
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
          className="border-2 border-blue-500 text-blue-600 px-4 py-2 rounded-xl font-medium hover:bg-blue-50 transition"
        >
          Mi cuenta
        </button>

        {/* MENÚ */}
        {open && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border overflow-hidden animate-fade-in"
          >
            <Link
              href="/dashboard"
              className="block px-5 py-3 text-sm hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              📊 Mi Dashboard
            </Link>

            <Link
              href="/perfil"
              className="block px-5 py-3 text-sm hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              ✏️ Editar mi perfil
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50"
            >
              🚪 Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* TOAST */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg">
            ✅ Sesión cerrada con éxito
          </div>
        </div>
      )}

      {/* ANIMACIONES */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.15s ease-out;
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
