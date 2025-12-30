'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

export default function ForceChangePasswordModal() {
  const { user, token, logout } = useAuth();
  if (!user) return null;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    'https://api.finopslatam.com';

  const submit = async () => {
    if (!password || !confirm) {
      setError('Completa todos los campos');
      return;
    }

    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    setError('');

    try {
        const res = await fetch(`${API_URL}/api/auth/change-password`, 

        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password,
            confirm_password: confirm,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al cambiar contraseña');
        return;
      }

      // 🔐 Forzar re-login
      alert('Contraseña cambiada con éxito. Inicia sesión nuevamente.');
      logout();
    } catch {
      setError('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-2">
          Cambio obligatorio de contraseña
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Por seguridad debes cambiar tu contraseña antes de continuar.
        </p>

        {error && (
          <div className="mb-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <input
          type="password"
          placeholder="Nueva contraseña"
          className="w-full border rounded-lg p-2 mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          className="w-full border rounded-lg p-2 mb-4"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
        >
          {loading ? 'Guardando…' : 'Cambiar contraseña'}
        </button>
      </div>
    </div>
  );
}
