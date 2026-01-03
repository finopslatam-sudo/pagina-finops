'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import PrivateRoute from '@/app/components/Auth/PrivateRoute';

interface User {
  contact_name?: string;
  company_name?: string;
  email?: string;
  force_password_change?: boolean;
}

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const [showForceModal, setShowForceModal] = useState(false);

  /* ============================
     FORZAR CAMBIO DE PASSWORD
     ============================ */
  useEffect(() => {
    if (user?.force_password_change) {
      setShowForceModal(true);
    }
  }, [user]);

  /* ============================
     ESTADOS PASSWORD
     ============================ */
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'https://api.finopslatam.com';

  /* ============================
     REGLAS PASSWORD
     ============================ */
  const rules = useMemo(() => ({
    length: password.length >= 8 && password.length <= 12,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!"#$%&()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password),
    different: password.length > 0 && password !== currentPassword,
  }), [password, currentPassword]);

  const allValid = Object.values(rules).every(Boolean);

  /* ============================
     SUBMIT CAMBIO PASSWORD
     ============================ */
  const submitChange = async () => {
    if (!allValid) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          password,
          confirm_password: confirm,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al cambiar contraseña');
        return;
      }

      alert('Contraseña cambiada correctamente. Inicia sesión nuevamente.');
      logout();
      window.location.href = '/login';
    } catch {
      setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const Rule = ({ ok, text }: { ok: boolean; text: string }) => (
    <li className="flex items-center gap-2 text-sm">
      <span className={ok ? 'text-green-600' : 'text-gray-400'}>
        {ok ? '✔️' : '○'}
      </span>
      <span className={ok ? 'text-green-700' : 'text-gray-600'}>
        {text}
      </span>
    </li>
  );

  const safeUser: User = user || {};

  return (
    <PrivateRoute>

      {/* ============================
          MODAL OBLIGATORIO PASSWORD
         ============================ */}
      {showForceModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-1">
              Cambio obligatorio de contraseña
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              Por tu seguridad debes modificar tu clave antes de continuar.
            </p>

            <ul className="mb-4 space-y-1">
              <Rule ok={rules.length} text="Entre 8 y 12 caracteres" />
              <Rule ok={rules.upper} text="Al menos una letra mayúscula" />
              <Rule ok={rules.lower} text="Al menos una letra minúscula" />
              <Rule ok={rules.number} text="Al menos un número" />
              <Rule ok={rules.special} text="Al menos un carácter especial" />
              <Rule ok={rules.different} text="No repetir la clave actual" />
            </ul>

            {error && (
              <div className="mb-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* CLAVE ACTUAL */}
            <div className="relative mb-3">
              <input
                type={showCurrent ? 'text' : 'password'}
                placeholder="Clave actual"
                className="w-full border rounded-lg p-2 pr-10"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <span
                className="absolute right-3 top-2 cursor-pointer"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                👁️
              </span>
            </div>

            {/* NUEVA */}
            <div className="relative mb-3">
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="Nueva contraseña"
                className="w-full border rounded-lg p-2 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-3 top-2 cursor-pointer"
                onClick={() => setShowNew(!showNew)}
              >
                👁️
              </span>
            </div>

            {/* CONFIRMAR */}
            <div className="relative mb-4">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirmar contraseña"
                className="w-full border rounded-lg p-2 pr-10"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <span
                className="absolute right-3 top-2 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                👁️
              </span>
            </div>

            <button
              onClick={submitChange}
              disabled={!allValid || loading}
              className={`w-full py-2 rounded-lg text-white font-medium transition
                ${allValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
              `}
            >
              {loading ? 'Guardando…' : 'Cambiar contraseña'}
            </button>
          </div>
        </div>
      )}

      {/* ============================
          DASHBOARD NORMAL
         ============================ */}
      <main className="min-h-screen bg-white text-gray-900">

        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <span className="text-gray-700 font-medium text-lg block">
              Estás en tu sesión:{' '}
              {safeUser.contact_name ||
                safeUser.company_name ||
                safeUser.email}
            </span>
          </div>
        </header>

        <section className="py-20 text-center bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
          <h1 className="text-4xl font-bold">Dashboard FinOps</h1>
          <p className="mt-2 text-blue-100">
            Controla y optimiza tus costos cloud
          </p>
        </section>

      </main>
    </PrivateRoute>
  );
}
