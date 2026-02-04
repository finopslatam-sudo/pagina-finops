'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';
import { AdminUser } from '@/app/dashboard/admin/hooks/useAdminUsers';

interface Props {
  user: AdminUser;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditUserModal({
  user,
  onClose,
  onSaved,
}: Props) {
  const { token } = useAuth();

  /**
   * 🔑 SOURCE OF TRUTH
   * El backend define tipo y permisos
   */
  const isGlobalUser = user.type === 'global';
  const canEdit = user.can_edit === true;

  const [form, setForm] = useState({
    email: user.email,
    global_role: user.global_role,
    client_role: user.client_role,
    is_active: user.is_active,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!token || !canEdit) return;

    setSaving(true);
    setError('');

    try {
      const body: any = {
        email: form.email,
        is_active: form.is_active, // boolean real
      };

      if (isGlobalUser) {
        body.global_role = form.global_role;
      } else {
        body.client_role = form.client_role;
      }

      await apiFetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        token,
        body,
      });

      onSaved();
    } catch {
      setError('No se pudo guardar el usuario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-4">

        <h2 className="text-lg font-semibold">Editar usuario</h2>

        <p className="text-sm text-gray-500">
          ID #{user.id} · {user.company_name ?? 'Usuario del sistema'}
        </p>

        {!canEdit && (
          <p className="text-sm text-gray-500">
            Este usuario no puede ser modificado por tu rol.
          </p>
        )}

        {/* EMAIL */}
        <input
          disabled={!canEdit}
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          className="w-full border p-2 rounded disabled:bg-gray-100"
          placeholder="Email"
        />

        {/* USUARIO GLOBAL */}
        {isGlobalUser && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Rol del sistema
            </label>
            <select
              disabled={!canEdit}
              value={form.global_role ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  global_role: e.target.value as AdminUser['global_role'],
                })
              }
              className="w-full border p-2 rounded disabled:bg-gray-100"
            >
              <option value="root">Root</option>
              <option value="support">Support</option>
            </select>
          </div>
        )}

        {/* USUARIO CLIENTE */}
        {!isGlobalUser && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Rol del cliente
            </label>
            <select
              disabled={!canEdit}
              value={form.client_role ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  client_role: e.target.value as AdminUser['client_role'],
                })
              }
              className="w-full border p-2 rounded disabled:bg-gray-100"
            >
              <option value="owner">Owner</option>
              <option value="finops_admin">FinOps Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        )}

        {/* ACTIVO */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            disabled={!canEdit}
            checked={form.is_active}
            onChange={(e) =>
              setForm({ ...form, is_active: e.target.checked })
            }
          />
          Usuario activo
        </label>

        {error && (
          <p className="text-red-600 text-sm">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button onClick={onClose}>Cancelar</button>
          <button
            onClick={save}
            disabled={saving || !canEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
