'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useState } from 'react';
import { useAdminUsers } from './hooks/useAdminUsers';
import UsersTable from './components/UsersTable';
import UserFormModal from './components/UserFormModal';
import { useAuth } from '@/app/context/AuthContext';

/* =====================================================
   COMPONENT
===================================================== */

/**
 * AdminUsers
 *
 * Módulo principal del Panel Administrativo.
 *
 * Responsabilidades:
 * - Orquestar gestión de usuarios
 * - Renderizar tabla y modales
 * - Aplicar permisos de UI (staff)
 *
 * NOTA:
 * - No contiene lógica de negocio
 * - No llama APIs directamente
 * - Backend valida JWT + roles
 */
export default function AdminUsers() {
  /* =========================
     DATA (HOOK)
  ========================== */

  const {
    users,
    loading,
    error,
    refresh,
    setUserActive,
    deactivateUser,
    resetPassword,
  } = useAdminUsers();

  /* =========================
     AUTH / PERMISSIONS
  ========================== */

  const { user } = useAuth();

  /**
   * Solo ROOT o SUPPORT pueden gestionar usuarios
   */
  const canManageUsers =
    user?.global_role === 'root' ||
    user?.global_role === 'support';

  /* =========================
     UI STATE
  ========================== */

  const [showCreateModal, setShowCreateModal] = useState(false);

  /**
   * ⚠️ DEFAULT CLIENT ID
   *
   * Uso temporal / controlado.
   * En producción avanzada:
   * - usar selector de cliente
   * - o default backend
   */
  const DEFAULT_CLIENT_ID = 1;

  /* =========================
     RENDER
  ========================== */

  return (
    <div className="space-y-6">

      {/* =========================
         HEADER
      ========================== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Administración de Usuarios
          </h1>
          <p className="text-sm text-gray-600">
            Gestión de usuarios internos y usuarios de clientes
          </p>
        </div>

        {/* ACCIÓN SOLO STAFF */}
        {canManageUsers && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            ➕ Crear usuario
          </button>
        )}
      </div>

      {/* =========================
         USERS TABLE
      ========================== */}
      <UsersTable
        users={users}
        loading={loading}
        error={error}
        onToggleActive={setUserActive}
        onDelete={deactivateUser}
        onResetPassword={resetPassword}
      />

      {/* =========================
         CREATE USER MODAL
      ========================== */}
      {showCreateModal && (
        <UserFormModal
          clientId={DEFAULT_CLIENT_ID}
          onClose={() => setShowCreateModal(false)}
          onCreate={async () => {
            /**
             * Refresca listado post-creación
             * Mantiene UI consistente
             */
            await refresh();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}
