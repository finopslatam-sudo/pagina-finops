'use client';

import { useState } from 'react';
import { AdminUser } from '../hooks/useAdminUsers';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';
import Modal from '@/app/components/UI/Modal';

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
  const { token } = useAuth();

  /**
   * 🔑 SOURCE OF TRUTH
   * Backend define tipo y permisos
   */
  const isGlobalUser = user.type === 'global';
  const canEdit = user.can_edit === true;
  const [success, setSuccess] = useState(false);

  /* ============================
     FORM STATE
  ============================ */

  const [email, setEmail] = useState(user.email);
  const [globalRole, setGlobalRole] = useState(
    user.global_role ?? ''
  );
  const [clientRole, setClientRole] = useState(
    user.client_role ?? ''
  );
  const [isActive, setIsActive] = useState(
    user.is_active
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ============================
     SAVE HANDLER (REAL)
  ============================ */

  const handleSave = async () => {
    if (!token || !canEdit) return;

    setSaving(true);
    setError(null);

    try {
      const body: any = {
        email,
        is_active: isActive, // boolean real
      };

      if (isGlobalUser) {
        body.global_role = globalRole;
      } else {
        body.client_role = clientRole;
      }

      await apiFetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        token,
        body,
      });

      setSuccess(true);

      setTimeout(() => {
        onSaved();
      }, 800);

    } catch (err) {
      setError('No se pudo guardar el usuario');
    } finally {
      setSaving(false);
    }
  };

  /* ============================
     UI
  ============================ */

  return (
    <Modal isOpen onClose={onClose}>
      <h2 className="text-xl font-semibold mb-2">
        Editar usuario
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        {user.company_name ?? 'Usuario del sistema'}
      </p>

      {!canEdit && (
        <p className="text-sm text-gray-500 mb-4">
          Este usuario no puede ser modificado por tu rol.
        </p>
      )}

      <div className="space-y-4">
        {/* EMAIL */}
        <div>
          <label className="block text-sm font-medium">
            Email
          </label>
          <input
            disabled={!canEdit}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        {/* USUARIO GLOBAL */}
        {isGlobalUser && (
          <div>
            <label className="block text-sm font-medium">
              Rol del sistema
            </label>
            <select
              disabled={!canEdit}
              value={globalRole}
              onChange={(e) => setGlobalRole(e.target.value)}
              className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
            >
              <option value="root">Root</option>
              <option value="support">Support</option>
            </select>
          </div>
        )}

        {/* USUARIO CLIENTE */}
        {!isGlobalUser && (
          <div>
            <label className="block text-sm font-medium">
              Rol del cliente
            </label>
            <select
              disabled={!canEdit}
              value={clientRole}
              onChange={(e) =>
                setClientRole(e.target.value)
              }
              className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
            >
              <option value="owner">Owner</option>
              <option value="finops_admin">
                FinOps Admin
              </option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        )}

        {/* ACTIVO */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            disabled={!canEdit}
            checked={isActive}
            onChange={(e) =>
              setIsActive(e.target.checked)
            }
          />
          <span>Usuario activo</span>
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-600">
            ✅ Usuario actualizado correctamente
          </p>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !canEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  );
}
