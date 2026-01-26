'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useState } from 'react';
import { apiFetch } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';

/* =====================================================
   TYPES
===================================================== */

interface EditableUser {
  id: number;
  email: string;
  global_role: string | null;
  client_role: string | null;
  is_active: boolean | null;
  client?: {
    company_name: string;
  } | null;
}

interface EditUserModalProps {
  user: EditableUser;
  onClose: () => void;
  onSaved: () => void;
}

/* =====================================================
   COMPONENT
===================================================== */

export default function EditUserModal({
  user,
  onClose,
  onSaved,
}: EditUserModalProps) {
  const { token } = useAuth();

  const [email, setEmail] = useState(user.email);
  const [globalRole, setGlobalRole] = useState(user.global_role ?? '');
  const [clientRole, setClientRole] = useState(user.client_role ?? '');
  const [isActive, setIsActive] = useState(Boolean(user.is_active));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  /* =====================================================
     SAVE HANDLER
  ===================================================== */

  const handleSave = async () => {
    if (!token) return;

    setSaving(true);
    setError('');

    try {
      await apiFetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        token,
        body: {
          email,
          global_role: globalRole || null,
          client_role: clientRole || null,
          is_active: isActive,
        },
      });

      onSaved();
      onClose();
    } catch (err) {
      console.error('EDIT USER ERROR:', err);
      setError('No se pudo guardar el usuario');
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-lg">

        {/* HEADER */}
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">
            Editar usuario
          </h2>
          {user.client && (
            <p className="text-sm text-gray-500">
              Empresa: {user.client.company_name}
            </p>
          )}
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* GLOBAL ROLE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Rol global
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={globalRole}
              onChange={(e) => setGlobalRole(e.target.value)}
            >
              <option value="">Usuario</option>
              <option value="admin">Admin</option>
              <option value="support">Support</option>
            </select>
          </div>

          {/* CLIENT ROLE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Rol en empresa
            </label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={clientRole}
              onChange={(e) => setClientRole(e.target.value)}
            >
              <option value="">Sin rol</option>
              <option value="owner">Owner</option>
              <option value="finops_admin">FinOps Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          {/* ACTIVE */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span className="text-sm">Usuario activo</span>
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button
            className="px-4 py-2 text-sm"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
            onClick={handleSave}
            disabled={saving}
          >
            Guardar cambios
          </button>
        </div>

      </div>
    </div>
  );
}
