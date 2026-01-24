'use client';

/* =====================================================
   ADMIN USERS HOOK — FINOPSLATAM
   Capa de dominio ADMIN (usuarios)
===================================================== */

/* =====================================================
   IMPORTS
===================================================== */

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';

/* =====================================================
   TYPES
===================================================== */

/**
 * Usuario administrativo
 * Resultado de JOIN backend: users + clients
 */
export interface AdminUser {
  id: number;
  email: string;

  global_role: 'root' | 'support' | null;
  client_role: 'owner' | 'finops_admin' | 'viewer' | null;

  is_active: boolean;

  company_name: string | null;
  contact_name: string | null;
  client_email: string | null;
  client_active: boolean | null;

  is_root: boolean;
}

/**
 * Payload de creación
 * (alineado con backend)
 */
export type CreateAdminUserPayload = {
  email: string;
  client_id: number;
  client_role: 'owner' | 'finops_admin' | 'viewer';
};

/* =====================================================
   HOOK
===================================================== */

export function useAdminUsers() {
  const { token } = useAuth();

  /* =========================
     STATE
  ========================== */

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =====================================================
     FETCH USERS
     GET /api/admin/users
  ===================================================== */

  const fetchUsers = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<{
        users: AdminUser[];
      }>('/api/admin/users', { token });

      setUsers(data.users);
    } catch (err: any) {
      console.error('[ADMIN_USERS_FETCH]', err);
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* =====================================================
     CREATE USER
     POST /api/admin/users
  ===================================================== */

  const createUser = async (payload: CreateAdminUserPayload) => {
    if (!token) return;

    try {
      await apiFetch('/api/admin/users', {
        method: 'POST',
        token,
        body: payload,
      });

      await fetchUsers();
    } catch (err) {
      console.error('[ADMIN_CREATE_USER]', err);
      throw err;
    }
  };

  /* =====================================================
     ACTIVATE / DEACTIVATE
     PUT /api/admin/users/:id
  ===================================================== */

  const setUserActive = async (
    userId: number,
    isActive: boolean
  ) => {
    if (!token) return;

    try {
      await apiFetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        token,
        body: { is_active: isActive },
      });

      await fetchUsers();
    } catch (err) {
      console.error('[ADMIN_USER_UPDATE]', err);
      throw err;
    }
  };

  /* =====================================================
     DEACTIVATE (SOFT DELETE)
     DELETE /api/admin/users/:id
  ===================================================== */

  const deactivateUser = async (userId: number) => {
    if (!token) return;

    try {
      await apiFetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        token,
      });

      await fetchUsers();
    } catch (err) {
      console.error('[ADMIN_USER_DELETE]', err);
      throw err;
    }
  };

  /* =====================================================
     RESET PASSWORD
     POST /api/admin/users/:id/reset-password
  ===================================================== */

  const resetPassword = async (
    userId: number,
    newPassword: string
  ) => {
    if (!token) return;

    try {
      await apiFetch(
        `/api/admin/users/${userId}/reset-password`,
        {
          method: 'POST',
          token,
          body: { password: newPassword },
        }
      );

      await fetchUsers();
    } catch (err) {
      console.error('[ADMIN_RESET_PASSWORD]', err);
      throw err;
    }
  };

  /* =====================================================
     PUBLIC API
  ===================================================== */

  return {
    users,
    loading,
    error,

    refresh: fetchUsers,
    createUser,
    setUserActive,
    deactivateUser,
    resetPassword,
  };
}
