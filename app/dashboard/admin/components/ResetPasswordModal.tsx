'use client';

/* =====================================================
   RESET PASSWORD MODAL
   - UI PURO
   - NO conoce backend
   - NO importa hooks de data
===================================================== */

/* =====================================================
   IMPORTS
===================================================== */

import { useState } from 'react';
import { AdminUser } from '../hooks/useAdminUsers';

/* =====================================================
   PROPS
===================================================== */

interface ResetPasswordModalProps {
  user: AdminUser;
  onClose: () => void;

  /**
   * Acción inyectada desde el contenedor
   * (AdminUsers / UsersTable)
   */
  onSubmit: (newPassword: string) => Promise<void>;
}

/* =====================================================
   COMPONENT
===================================================== */

export default function ResetPasswordModal({
  user,
  onClose,
  onSubmit,
}: ResetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* =====================================================
     SUBMIT HANDLER
  ===================================================== */

  const handleSubmit = async () => {
    if (!password || password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(password);

      alert(
        'Contraseña reseteada. El usuario deberá cambiarla al iniciar sesión.'
      );

      onClose();
    } catch (err: any) {
      setError(
        err?.message || 'Error al resetear contraseña'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">

        {/* HEADER */}
        <h2 className="text-lg font-semibold mb-1">
          Resetear contraseña
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Usuario: <b>{user.email}</b>
        </p>

        {/* ERROR */}
        {error && (
          <p className="text-sm text-red-600 mb-3">
            {error}
          </p>
        )}

        {/* INPUT */}
        <input
          type="password"
          placeholder="Nueva contraseña temporal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:underline"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Procesando…' : 'Resetear'}
          </button>
        </div>
      </div>
    </div>
  );
}
