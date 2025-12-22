"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

// ✅ Client actualizado (NO romper nada)
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

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setOpen(false);
    setShowToast(true);

    // ⏳ animación + redirección
    setTimeout(() => {
      setShowToast(false);
      router.push("/");
    }, 1800);
  };

  return (
    <>
      {/* Botón principal */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="px-6 py-2 border-2 border-blue-500 text-blue-500 rounded-xl font-semibold hover:bg-blue-50 transition"
        >
          Mi cuenta
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg overflow-hidden animate-fade-in">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/perfil");
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 transition"
            >
              Editar mi perfil
            </button>

            {/* ✅ NUEVO: Mi Dashboard */}
            <button
              onClick={() => {
                setOpen(false);
                router.push("/dashboard");
              }}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 transition"
            >
              Mi Dashboard
            </button>

            <hr />

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* ✅ TOAST */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg">
            Sesión cerrada con éxito
          </div>
        </div>
      )}

      {/* Animaciones */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
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
            transform: translateY(10px);
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
