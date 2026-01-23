'use client';

import { useState } from 'react';
import { AdminUser } from '../hooks/useAdminUsers';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useAuth } from '@/app/context/AuthContext';
import ConfirmDialog from './ConfirmDialog';
import ResetPasswordModal from './ResetPasswordModal';

/* ============================
   PROPS
============================ */
interface UsersTableProps {
    users: AdminUser[];
    loading: boolean;
    error: string | null;
  
    onToggleActive: (userId: number, isActive: boolean) => Promise<void>;
    onDelete: (userId: number) => Promise<void>;
    onResetPassword: (userId: number, newPassword: string) => Promise<void>;
  }

/* ============================
   COMPONENT
============================ */
export default function UsersTable({
  users,
  loading,
  error,
}: UsersTableProps) {
  const { user: currentUser } = useAuth();
  const {
    setUserActive,
    deactivateUser,
  } = useAdminUsers();

  const [confirmUser, setConfirmUser] =
    useState<AdminUser | null>(null);

  const [resetUser, setResetUser] =
    useState<AdminUser | null>(null);

  /* ============================
     PERMISSIONS
  ============================ */
  const isRoot = currentUser?.global_role === 'root';
  const isSupport = currentUser?.global_role === 'support';

  const canModify = (target: AdminUser) => {
    if (!currentUser) return false;

    // ❌ no self
    if (target.id === currentUser.id) return false;

    // support no puede tocar root
    if (isSupport && target.global_role === 'root') return false;

    return true;
  };

  /* ============================
     STATES
  ============================ */
  if (loading) {
    return <p className="text-gray-400">Cargando usuarios…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!users.length) {
    return <p className="text-gray-500">No hay usuarios</p>;
  }

  /* ============================
     RENDER
  ============================ */
  return (
    <>
      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Empresa</th>
              <th className="px-4 py-3 text-left">Rol</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className="border-b hover:bg-gray-50"
              >
                {/* EMAIL */}
                <td className="px-4 py-3">
                  <div className="font-medium">{u.email}</div>
                  {u.is_root && (
                    <span className="text-xs text-red-600">
                      ROOT
                    </span>
                  )}
                </td>

                {/* COMPANY */}
                <td className="px-4 py-3">
                  {u.company_name || '—'}
                </td>

                {/* ROLE */}
                <td className="px-4 py-3">
                  {u.global_role || u.client_role || 'cliente'}
                </td>

                {/* STATUS */}
                <td className="px-4 py-3">
                  {u.is_active ? (
                    <span className="text-green-600">
                      Activo
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Inactivo
                    </span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-3 text-right space-x-2">
                  {/* RESET PASSWORD */}
                  {canModify(u) && (
                    <button
                      onClick={() => setResetUser(u)}
                      className="text-blue-600 hover:underline"
                    >
                      Reset
                    </button>
                  )}

                  {/* ACTIVATE / DEACTIVATE */}
                  {canModify(u) && (
                    <button
                      onClick={() => setConfirmUser(u)}
                      className={`${
                        u.is_active
                          ? 'text-red-600'
                          : 'text-green-600'
                      } hover:underline`}
                    >
                      {u.is_active
                        ? 'Desactivar'
                        : 'Activar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ============================
          CONFIRM DIALOG
      ============================ */}
      {confirmUser && (
        <ConfirmDialog
          title={
            confirmUser.is_active
              ? 'Desactivar usuario'
              : 'Activar usuario'
          }
          message={`¿Confirmas ${
            confirmUser.is_active
              ? 'desactivar'
              : 'activar'
          } a ${confirmUser.email}?`}
          confirmText="Confirmar"
          onCancel={() => setConfirmUser(null)}
          onConfirm={async () => {
            if (confirmUser.is_active) {
              await deactivateUser(confirmUser.id);
            } else {
              await setUserActive(
                confirmUser.id,
                true
              );
            }
            setConfirmUser(null);
          }}
        />
      )}

      {/* ============================
          RESET PASSWORD MODAL
      ============================ */}
      {resetUser && (
        <ResetPasswordModal
          user={resetUser}
          onClose={() => setResetUser(null)}
        />
      )}
    </>
  );
}
