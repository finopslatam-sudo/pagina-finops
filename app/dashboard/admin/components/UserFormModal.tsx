'use client';

import { useState } from 'react';

export type CreateUserPayload = {
  email: string;
  client_id: number;
  client_role: 'owner' | 'finops_admin' | 'viewer';
};

interface Props {
  clientId: number;
  onClose: () => void;
  onCreate: (payload: CreateUserPayload) => Promise<void>;
}

export default function UserFormModal({
  clientId,
  onClose,
  onCreate,
}: Props) {
  const [email, setEmail] = useState('');
  const [clientRole, setClientRole] =
    useState<'owner' | 'finops_admin' | 'viewer'>('viewer');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!email) {
      setError('Email es obligatorio');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onCreate({
        email,
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

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">

        <h2 className="text-lg font-semibold mb-4">
          Crear usuario
        </h2>

        {error && (
          <p className="text-sm text-red-600 mb-3">
            {error}
          </p>
        )}

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="usuario@empresa.cl"
          />
        </div>

        {/* ROLE */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Rol
          </label>
          <select
            value={clientRole}
            onChange={(e) =>
              setClientRole(e.target.value as any)
            }
            className="w-full px-4 py-2 border rounded-lg"
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
