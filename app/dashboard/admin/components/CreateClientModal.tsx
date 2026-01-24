'use client';

/* =====================================================
   CREATE CLIENT MODAL
===================================================== */

import { useState } from 'react';
import { apiFetch } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';

interface Props {
  onClose: () => void;
  onCreate: () => Promise<void>;
}

export default function CreateClientModal({ onClose, onCreate }: Props) {
  const { token } = useAuth();

  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* =========================
     SUBMIT
  ========================== */

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('El nombre del cliente es obligatorio');
      return;
    }

    if (!token) {
      setError('Sesión inválida');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await apiFetch('/api/admin/clients', {
        method: 'POST',
        token,
        body: {
          name,
          is_active: isActive,
        },
      });

      await onCreate();
    } catch (err) {
      console.error('CREATE CLIENT ERROR:', err);
      setError('No se pudo crear el cliente');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RENDER
  ========================== */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 space-y-4">

        <h2 className="text-xl font-semibold">
          Crear cliente
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {/* NOMBRE */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre del cliente
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Empresa ABC"
          />
        </div>

        {/* ESTADO */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span className="text-sm">
            Cliente activo
          </span>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creando…' : 'Crear cliente'}
          </button>
        </div>

      </div>
    </div>
  );
}
