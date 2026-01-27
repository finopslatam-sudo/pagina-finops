'use client';

import { useState } from 'react';
import { AdminUser, useAdminUsers } from '../hooks/useAdminUsers';
import Modal from '@/app/components/UI/Modal';

interface Props {
  user: AdminUser;
  onClose: () => void;
  onSaved: () => void;
}

const GLOBAL_ROLES = ['admin', 'support'] as const;
const CLIENT_ROLES = ['owner', 'finops_admin', 'viewer'] as const;

export default function UserFormModal({
  user,
  onClose,
  onSaved,
}: Props) {
  const { updateUser } = useAdminUsers();

  const isSystemUser = user.global_role !== null;
  const isRoot = user.global_role === 'root';

  const [email, setEmail] = useState(user.email);
  const [globalRole, setGlobalRole] =
    useState<'admin' | 'support' | null>(
      user.global_role === 'root' ? null : user.global_role
    );

  const [clientRole, setClientRole] =
    useState<'owner' | 'finops_admin' | 'viewer' | null>(
      user.client_role
    );

  const [isActive, setIsActive] = useState(user.is_active);
  const [forcePasswordChange, setForcePasswordChange] =
    useState(user.force_password_change);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (isRoot) return;

    setSaving(true);
    setError(null);

    try {
      await updateUser(user.id, {
        email,
        is_active: isActive,
        force_password_change: forcePasswordChange,
        global_role: isSystemUser ? globalRole : null,
        client_role: !isSystemUser ? clientRole : null,
      });

      onSaved();
    } catch {
      setError('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">
        Editar usuario
      </h2>

      <div className="space-y-4">
        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium">
            Email
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isRoot}
          />
        </div>

        {/* ROLES */}
        {isSystemUser ? (
          <div>
            <label className="block text-sm font-medium">
              Rol del sistema
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={globalRole ?? ''}
              onChange={(e) =>
                setGlobalRole(
                  e.target.value as 'admin' | 'support'
                )
              }
              disabled={isRoot}
            >
              <option value="">Seleccione</option>
              {GLOBAL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium">
              Rol del cliente
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={clientRole ?? ''}
              onChange={(e) =>
                setClientRole(
                  e.target.value as
                    | 'owner'
                    | 'finops_admin'
                    | 'viewer'
                )
              }
            >
              <option value="">Seleccione</option>
              {CLIENT_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ESTADO */}
        {!isRoot && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) =>
                setIsActive(e.target.checked)
              }
            />
            Usuario activo
          </label>
        )}

        {/* FORCE PASSWORD CHANGE */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={forcePasswordChange}
            onChange={(e) =>
              setForcePasswordChange(e.target.checked)
            }
          />
          Forzar cambio de contraseña
        </label>

        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            className="px-4 py-2 border rounded"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>

          {!isRoot && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={handleSave}
              disabled={saving}
            >
              Guardar
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
