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

  const [email, setEmail] = useState(user.email);
  const [isActive, setIsActive] = useState(user.is_active);
  const [forceChange, setForceChange] =
    useState(user.force_password_change);

  const [globalRole, setGlobalRole] =
    useState(user.global_role);

  const [clientRole, setClientRole] =
    useState(user.client_role);

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    await updateUser(user, {
      email,
      is_active: isActive,
      force_password_change: forceChange,
      ...(user.type === 'global'
        ? { global_role: globalRole }
        : { client_role: clientRole }),
    });

    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 space-y-4">
        <h3 className="text-lg font-semibold">
          Editar usuario
        </h3>

        {/* EMAIL */}
        <div>
          <label className="text-sm">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* ROLE */}
        <div>
          <label className="text-sm">Rol</label>

          {user.type === 'global' ? (
            <select
              value={globalRole ?? ''}
              onChange={(e) =>
                setGlobalRole(
                  e.target.value as AdminUser['global_role']
                )
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="root">root</option>
              <option value="admin">admin</option>
              <option value="support">support</option>
            </select>
          ) : (
            <select
              value={clientRole ?? ''}
              onChange={(e) =>
                setClientRole(
                  e.target.value as AdminUser['client_role']
                )
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="owner">owner</option>
              <option value="viewer">viewer</option>
            </select>
          )}
        </div>

        {/* FLAGS */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Usuario activo
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={forceChange}
              onChange={(e) =>
                setForceChange(e.target.checked)
              }
            />
            Forzar cambio de contraseña
          </label>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            disabled={loading}
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
