'use client';

import { useState } from 'react';
import { AdminUser, useAdminUsers } from '../hooks/useAdminUsers';

interface Props {
  user: AdminUser;
  onClose: () => void;
  onSaved: () => void;
}

export default function UserFormModal({
  user,
  onClose,
  onSaved,
}: Props) {
  const { updateUser } = useAdminUsers();

  const [role, setRole] = useState(user.role);
  const [isActive, setIsActive] = useState(user.is_active);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      // 🔥 CAMBIO CLAVE: pasamos el user completo
      await updateUser(user, {
        role,
        is_active: isActive,
      });

      onSaved();
    } catch (e) {
      setError('No se pudo guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4">
        <h3 className="text-lg font-semibold">
          Editar usuario
        </h3>

        <div>
          <label className="block text-sm font-medium">
            Email
          </label>
          <input
            disabled
            value={user.email}
            className="mt-1 w-full border rounded px-3 py-2 bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Rol
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            {user.type === 'global' ? (
              <>
                <option value="root">root</option>
                <option value="support">support</option>
                <option value="admin">admin</option>
              </>
            ) : (
              <>
                <option value="owner">owner</option>
                <option value="finops_admin">
                  finops_admin
                </option>
                <option value="viewer">viewer</option>
              </>
            )}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span className="text-sm">Activo</span>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
