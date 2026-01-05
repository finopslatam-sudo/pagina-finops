'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/app/context/AuthContext';

export default function ForceChangePasswordModal() {
  const { user, token, logout } = useAuth();
  if (!user) return null;

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'https://api.finopslatam.com';

  /* 🔐 Reglas */
  const rules = useMemo(() => ({
    length: password.length >= 8 && password.length <= 12,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!"#$%&()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(password),
  }), [password]);

  const allValid = Object.values(rules).every(Boolean);

  const submit = async () => {
    if (!currentPassword || !password || !confirm) {
      setError('Completa todos los campos');
      return;
    }

    if (!allValid) {
      setError('La contraseña no cumple los requisitos');
      return;
    }

    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

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

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al cambiar contraseña');
        return;
      }

      alert('Contraseña cambiada con éxito. Inicia sesión nuevamente.');
      logout();
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

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-1">
          Cambio obligatorio de contraseña
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Por tu seguridad debes modificar tu clave antes de continuar.
        </p>

        {/* REGLAS */}
        <ul className="mb-4 space-y-1">
          <Rule ok={rules.length} text="Entre 8 y 12 caracteres" />
          <Rule ok={rules.upper} text="Al menos una letra mayúscula" />
          <Rule ok={rules.lower} text="Al menos una letra minúscula" />
          <Rule ok={rules.number} text="Al menos un número" />
          <Rule ok={rules.special} text="Al menos un carácter especial" />
        </ul>

        {error && (
          <div className="mb-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* CLAVE ACTUAL */}
        <input
          type="password"
          placeholder="Clave actual"
          className="w-full border rounded-lg p-2 mb-3"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        {/* NUEVA */}
        <input
          type="password"
          placeholder="Nueva contraseña"
          className="w-full border rounded-lg p-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* CONFIRMAR */}
        <input
          type="password"
          placeholder="Confirmar contraseña"
          className="w-full border rounded-lg p-2 mb-4"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={submit}
          disabled={loading || !allValid}
          className={`w-full py-2 rounded-lg text-white font-medium transition
            ${allValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
          `}
        >
          {loading ? 'Guardando…' : 'Cambiar contraseña'}
        </button>
      </div>
    </div>
  );
}
