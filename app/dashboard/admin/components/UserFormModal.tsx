'use client';

/* =====================================================
   USER FORM MODAL
   - Modal UI para creación de usuarios
   - NO conoce backend
   - Recibe acción vía onCreate (inyección)
===================================================== */

import { useState } from 'react';

/* =====================================================
   TYPES (ALINEADOS BACKEND)
===================================================== */

/**
 * Payload esperado por el backend
 * POST /api/admin/users
 */
export type CreateUserPayload = {
  email: string;
  client_id: number;
  client_role: 'owner' | 'finops_admin' | 'viewer';
};

interface UserFormModalProps {
  /**
   * Client ID objetivo
   * ⚠️ Debe venir del contexto admin, NO hardcodeado
   */
  clientId: number;

  /**
   * Cierra el modal
   */
  onClose: () => void;

  /**
   * Acción de creación (inyectada)
   */
  onCreate: (payload: CreateUserPayload) => Promise<void>;
}

/* =====================================================
   COMPONENT
===================================================== */

export default function UserFormModal({
  clientId,
  onClose,
  onCreate,
}: UserFormModalProps) {
  /* =========================
     STATE
  ========================== */

  const [email, setEmail] = useState('');
  const [clientRole, setClientRole] =
    useState<'owner' | 'finops_admin' | 'viewer'>('viewer');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     VALIDATION HELPERS
  ========================== */

  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  /* =========================
     SUBMIT
  ========================== */

  const submit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError('El email es obligatorio');
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError('Formato de email inválido');
      return;
    }

    if (!clientId) {
      setError('Cliente no válido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onCreate({
        email: normalizedEmail,
        client_id: clientId,
        client_role: clientRole,
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">

        {/* TITLE */}
        <h2 className="text-lg font-semibold mb-4">
          Crear usuario
        </h2>

        {/* ERROR */}
        {error && (
          <p className="text-sm text-red-600 mb-3">
            {error}
          </p>
        )}

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email del usuario
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="usuario@empresa.cl"
            disabled={loading}
          />
        </div>

        {/* ROLE */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Rol del usuario
          </label>
          <select
            value={clientRole}
            onChange={(e) =>
              setClientRole(e.target.value as any)
            }
            className="w-full px-4 py-2 border rounded-lg"
            disabled={loading}
          >
            <option value="owner">Owner</option>
            <option value="finops_admin">FinOps Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:underline"
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Creando…' : 'Crear usuario'}
          </button>
        </div>
      </div>
    </div>
  );
}
