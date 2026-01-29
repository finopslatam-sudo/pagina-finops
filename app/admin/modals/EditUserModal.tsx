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

  const isGlobalUser = user.global_role !== null;

  const [form, setForm] = useState({
    email: user.email,
    global_role: user.global_role,
    client_role: user.client_role,
    is_active: user.is_active,
    force_password_change: user.force_password_change,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    if (!token) return;

    setSaving(true);
    setError('');

    try {
      await apiFetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        token,
        body: {
          email: form.email,
          is_active: form.is_active,
          global_role: isGlobalUser ? form.global_role : null,
          client_role: !isGlobalUser ? form.client_role : null,
        },
      });

      onSaved();
    } catch {
      setError('No se pudo guardar el usuario');
    } finally {
      setSaving(false);
    }
  };

  const resetPassword = async () => {
    if (!token) return;

    if (!confirm('¿Resetear contraseña? El usuario deberá cambiarla al iniciar sesión.')) {
      return;
    }

    await apiFetch(`/api/admin/users/${user.id}/reset-password`, {
      method: 'POST',
      token,
    });

    alert('Contraseña reseteada correctamente');
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-4">

        <h2 className="text-lg font-semibold">Editar usuario</h2>

        <p className="text-sm text-gray-500">
          ID #{user.id} · {user.company_name ?? 'Usuario del sistema'}
        </p>

        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="Email"
        />

        {isGlobalUser && (
          <select
            value={form.global_role ?? ''}
            onChange={(e) =>
              setForm({ ...form, global_role: e.target.value as any })
            }
            className="w-full border p-2 rounded"
          >
            <option value="root">Root</option>
            <option value="support">Support</option>
          </select>
        )}

        {!isGlobalUser && (
          <select
            value={form.client_role ?? ''}
            onChange={(e) =>
              setForm({ ...form, client_role: e.target.value as any })
            }
            className="w-full border p-2 rounded"
          >
            <option value="owner">Owner</option>
            <option value="finops_admin">FinOps Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        )}

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) =>
              setForm({ ...form, is_active: e.target.checked })
            }
          />
          Usuario activo
        </label>

        {user.force_password_change && (
          <p className="text-sm text-orange-600">
            ⚠ Este usuario deberá cambiar su contraseña al iniciar sesión
          </p>
        )}


        <button
          onClick={resetPassword}
          className="text-sm text-red-600 underline"
        >
          Resetear contraseña
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={save} disabled={saving}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
