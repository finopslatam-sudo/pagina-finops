'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useState } from 'react';
import { useAdminUsers } from './hooks/useAdminUsers';
import UsersTable from './components/UsersTable';
import UserFormModal from './components/UserFormModal';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import CreateClientModal from './components/CreateClientModal';


/* =====================================================
   COMPONENT
===================================================== */

/**
 * AdminUsers
 *
 * Panel Administrativo — Usuarios y Clientes
 *
 * Responsabilidades:
 * - Visualizar TODOS los usuarios del sistema
 *   (root, admin, soporte, clientes)
 * - Crear usuarios asociados a clientes
 * - Punto de entrada para gestión de clientes
 *
 * Importante:
 * - NO contiene lógica de negocio
 * - Backend es la fuente de verdad
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
  const router = useRouter();

  /**
   * Solo ROOT o SUPPORT
   */
  const canManage =
    user?.global_role === 'root' ||
    user?.global_role === 'support';

  /* =========================
     UI STATE
  ========================== */

  const [showCreateUserModal, setShowCreateUserModal] =
    useState(false);

  /**
   * Cliente por defecto
   * (backend lo controla realmente)
   *
   * ✔ No rompe nada
   * ✔ Permite crear usuarios ahora
   * ✔ Escalable a selector real después
   */
  const DEFAULT_CLIENT_ID = 1;
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);

  /* =========================
     RENDER
  ========================== */

  return (
    <div className="space-y-6">

      {/* =========================
         HEADER
      ========================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-semibold">
            Panel de Administración
          </h1>
          <p className="text-sm text-gray-600">
            Gestión de clientes y usuarios del sistema
          </p>
        </div>

        {/* ACCIONES ADMIN */}
        {canManage && (
          <div className="flex gap-3">

            {/* CREAR CLIENTE */}
            <button
              onClick={() => setShowCreateClientModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              🏢 Crear cliente
            </button>

            {/* CREAR USUARIO */}
            <button
              onClick={() => setShowCreateUserModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              ➕ Crear usuario
            </button>
          </div>
        )}
      </div>

      {/* =========================
         USERS TABLE
         (incluye root / admin / clientes)
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
      {showCreateClientModal && (
        <CreateClientModal
          onClose={() => setShowCreateClientModal(false)}
          onCreate={async () => {
            await refresh();
            setShowCreateClientModal(false);
          }}
        />
      )}

      {showCreateUserModal && (
        <UserFormModal
          onClose={() => setShowCreateUserModal(false)}
          onCreate={async () => {
            await refresh();
            setShowCreateUserModal(false);
          }}
        />
      )}
    </div>
  );
}
