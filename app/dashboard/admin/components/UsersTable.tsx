'use client';

/* =====================================================
   USERS TABLE — ADMIN PANEL
   Visualiza usuarios de plataforma
===================================================== */

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

import ConfirmDialog from './ConfirmDialog';
import ResetPasswordModal from './ResetPasswordModal';

import { AdminUser } from '../hooks/useAdminUsers';

/* =====================================================
   PROPS
===================================================== */

interface UsersTableProps {
  users: AdminUser[];
  loading: boolean;
  error: string | null;

  onToggleActive: (userId: number, isActive: boolean) => Promise<void>;
  onDelete: (userId: number) => Promise<void>;
  onResetPassword: (userId: number, newPassword: string) => Promise<void>;
}

/* =====================================================
   COMPONENT
===================================================== */

export default function UsersTable({
  users,
  loading,
  error,
  onToggleActive,
  onDelete,
  onResetPassword,
}: UsersTableProps) {
  const { user: currentUser } = useAuth();

  const [confirmUser, setConfirmUser] =
    useState<AdminUser | null>(null);

  const [resetUser, setResetUser] =
    useState<AdminUser | null>(null);

  /* =====================================================
     PERMISSIONS
  ===================================================== */

  const isSupport = currentUser?.global_role === 'support';

  const canModify = (target: AdminUser) => {
    if (!currentUser) return false;
    if (target.id === currentUser.id) return false;
    if (isSupport && target.global_role === 'root') return false;
    return true;
  };

  /* =====================================================
     STATES
  ===================================================== */

  if (loading) {
    return <p className="text-gray-400">Cargando usuarios…</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!users.length) {
    return <p className="text-gray-500">No hay usuarios</p>;
  }

  /* =====================================================
     DATA NORMALIZATION
  ===================================================== */

  // Usuarios de plataforma (root, admin, support)
  const staffUsers = users.filter(
    (u) => u.global_role !== null
  );

  /* =====================================================
     RENDER HELPERS
  ===================================================== */

  const renderTable = (list: AdminUser[]) => (
    <div className="overflow-x-auto bg-white rounded-xl shadow border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left">Usuario</th>
            <th className="px-4 py-3 text-left">Empresa</th>
            <th className="px-4 py-3 text-left">Rol</th>
            <th className="px-4 py-3 text-left">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {list.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{u.email}</td>
              <td className="px-4 py-3">{u.company_name || '—'}</td>
              <td className="px-4 py-3">
                {u.global_role || u.client_role}
              </td>
              <td className="px-4 py-3">
                {u.is_active ? (
                  <span className="text-green-600">Activo</span>
                ) : (
                  <span className="text-red-600">Inactivo</span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                {canModify(u) && (
                  <button
                    onClick={() => setConfirmUser(u)}
                    className="text-blue-600 hover:underline"
                  >
                    Gestionar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <>
      {/* USUARIOS DE PLATAFORMA */}
      {staffUsers.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-6 mb-2">
            Usuarios de Plataforma
          </h2>
          {renderTable(staffUsers)}
        </>
      )}

      {/* MODALS */}
      {confirmUser && (
        <ConfirmDialog
          title={
            confirmUser.is_active
              ? 'Desactivar usuario'
              : 'Activar usuario'
          }
          message={`¿Confirmas acción sobre ${confirmUser.email}?`}
          confirmText="Confirmar"
          onCancel={() => setConfirmUser(null)}
          onConfirm={async () => {
            await onToggleActive(
              confirmUser.id,
              !confirmUser.is_active
            );
            setConfirmUser(null);
          }}
        />
      )}

      {resetUser && (
        <ResetPasswordModal
          user={resetUser}
          onClose={() => setResetUser(null)}
          onSubmit={async (newPassword) => {
            await onResetPassword(
              resetUser.id,
              newPassword
            );
            setResetUser(null);
          }}
        />
      )}
    </>
  );
}
