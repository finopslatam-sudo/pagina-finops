'use client';

import { useState } from 'react';
import { useAdminUsers } from './hooks/useAdminUsers';
import UsersTable from './components/UsersTable';
import UserFormModal from './components/UserFormModal';
import { useAuth } from '@/app/context/AuthContext';

export default function AdminUsers() {
  const {
    users,
    loading,
    error,
    refresh,
    setUserActive,
    deactivateUser,
    resetPassword,
  } = useAdminUsers();

  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const DEFAULT_CLIENT_ID = 1;

  const canManageUsers =
    user?.global_role === 'root' ||
    user?.global_role === 'support';

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Administración de Usuarios
          </h1>
          <p className="text-sm text-gray-600">
            Gestión de usuarios internos y usuarios de clientes
          </p>
        </div>

        {canManageUsers && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ➕ Crear usuario
          </button>
        )}
      </div>

      {/* USERS TABLE */}
      <UsersTable
        users={users}
        loading={loading}
        error={error}
        onToggleActive={setUserActive}
        onDelete={deactivateUser}
        onResetPassword={resetPassword}
      />

      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <UserFormModal
          clientId={DEFAULT_CLIENT_ID}
          onClose={() => setShowCreateModal(false)}
          onCreate={async () => {
            await refresh();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
