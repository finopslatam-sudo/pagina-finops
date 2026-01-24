'use client';

/* =====================================================
   USERS TABLE — ADMIN PANEL
   Visualiza usuarios de plataforma y clientes agrupados
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

  const staffUsers = users.filter(
    (u) => u.global_role !== null
  );

  const clientUsers = users.filter(
    (u) => u.client_role !== null && u.company_name
  );

  const usersByClient = clientUsers.reduce(
    (acc, user) => {
      const key = user.company_name as string;
      if (!acc[key]) acc[key] = [];
      acc[key].push(user);
      return acc;
    },
    {} as Record<string, AdminUser[]>
  );

  /* =====================================================
     RENDER
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

  return (
    <>
      {/* STAFF */}
      {staffUsers.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-6 mb-2">
            Usuarios de Plataforma
          </h2>
          {renderTable(staffUsers)}
        </>
      )}

      {/* CLIENTES */}
      {Object.entries(usersByClient).map(
        ([company, list]) => (
          <div key={company} className="mt-8">
            <h2 className="text-lg font-semibold mb-2">
              {company}
            </h2>
            {renderTable(list)}
          </div>
        )
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
