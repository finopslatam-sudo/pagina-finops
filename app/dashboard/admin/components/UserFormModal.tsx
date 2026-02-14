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
 
  const isGlobalUser = user.type === 'global';
  const canEdit = user.can_edit === true;

  const [success, setSuccess] = useState(false);
  const { token, user: currentUser } = useAuth();

  const isRoot = currentUser?.global_role === 'root';
  const isAdmin = currentUser?.global_role === 'admin';
  const isSupport = currentUser?.global_role === 'support';

  const isSelf = currentUser?.id === user.id;


  /* ============================
     FORM STATE - EDIT USER
  ============================ */

  const [email, setEmail] = useState(user.email);
  const [contactName, setContactName] = useState(
    user.contact_name || ''
  );  
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
     RESET PASSWORD STATE
  ============================ */

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');
  const [showPassword, setShowPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [resetLoading, setResetLoading] =
    useState(false);
  const [resetSuccess, setResetSuccess] =
    useState(false);
  const [resetError, setResetError] =
    useState<string | null>(null);

  /* ============================
     SAVE USER
  ============================ */

  const handleSave = async () => {
    if (!token || !canEdit) return;

    setSaving(true);
    setError(null);

    try {
      const body: any = {
        email,
        contact_name: contactName,
        is_active: isActive,
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
     RESET PASSWORD HANDLER
  ============================ */

  const handleResetPassword = async () => {
    if (!token || !canEdit) return;

    setResetError(null);
    setResetSuccess(false);

    if (newPassword.length < 8) {
      setResetError(
        'La contraseña debe tener al menos 8 caracteres'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError('Las contraseñas no coinciden');
      return;
    }

    try {
      setResetLoading(true);

      await apiFetch(
        `/api/admin/users/${user.id}/set-password`,
        {
          method: 'POST',
          token,
          body: {
            password: newPassword,
          },
        }
      );

      setResetSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setResetError(
        'No tienes permiso para resetear la contraseña'
      );
    } finally {
      setResetLoading(false);
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
          {/* CONTACT NAME */}
          <div>
            <label className="block text-sm font-medium">
              Nombre de contacto
            </label>
            <input
              disabled={!canEdit}
              value={contactName}
              onChange={(e) =>
                setContactName(e.target.value)
              }
              className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
            />
          </div>

          <input
            disabled={!canEdit}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
          />
        </div>

        {/* GLOBAL */}
        {isGlobalUser && (
          <div>
            <label className="block text-sm font-medium">
              Rol del sistema
            </label>
            <select
              disabled={
                !canEdit ||
                isSelf ||                         // nadie cambia su propio rol
                (isSupport && user.global_role !== null) ||// support no edita global
                (isAdmin && user.global_role === 'root') // admin no edita root
              }
              value={globalRole}
              onChange={(e) =>
                setGlobalRole(e.target.value)
              }
              className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
            >
              {/* Root puede ver root */}
              {isRoot && (
                <option value="root">Root</option>
              )}

              {/* Root y Admin pueden ver admin */}
              {(isRoot || isAdmin) && (
                <option value="admin">Admin</option>
              )}

              {/* Root y Admin pueden ver support */}
              {(isRoot || isAdmin) && (
                <option value="support">Support</option>
              )}
            </select>

          </div>
        )}

        {/* CLIENT */}
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

        {/* ============================
            RESET PASSWORD SECTION
        ============================ */}

        {canEdit && (
          <>
            <hr className="my-4" />

            <h3 className="font-semibold text-lg">
              Reset Password
            </h3>

            {/* NEW PASSWORD */}
            <div>
              <label className="block text-sm font-medium">
                Nueva password
              </label>
              <div className="relative">
                <input
                  type={
                    showPassword ? 'text' : 'password'
                  }
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  className="w-full border rounded px-3 py-2 pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-2 top-2 text-sm"
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium">
                Confirmar nueva password
              </label>
              <div className="relative">
                <input
                  type={
                    showConfirmPassword ? 'text' : 'password'
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  className="w-full border rounded px-3 py-2 pr-10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-2 top-2 text-sm"
                >
                  {showConfirmPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {resetError && (
              <p className="text-sm text-red-600">
                {resetError}
              </p>
            )}

            {resetSuccess && (
              <p className="text-sm text-green-600">
                ✅ Password actualizada correctamente
              </p>
            )}

            <button
              onClick={handleResetPassword}
              disabled={resetLoading}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-50"
            >
              {resetLoading
                ? 'Reseteando...'
                : 'Reset Password'}
            </button>
          </>
        )}

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
