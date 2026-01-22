'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.finopslatam.com';

/* ============================
   TYPES
============================ */
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

/* ============================
   HOOK
============================ */
export function useAdminUsers() {
  const { token } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ============================
     FETCH USERS
  ============================ */
  const fetchUsers = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al cargar usuarios');
      }

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

  /* ============================
     ACTIVATE / DEACTIVATE
  ============================ */
  const setUserActive = async (
    userId: number,
    isActive: boolean
  ) => {
    if (!token) return;

    try {
      const res = await fetch(
        `${API_URL}/api/admin/users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_active: isActive }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo actualizar');
      }

      await fetchUsers();
    } catch (err) {
      console.error('[ADMIN_USER_UPDATE]', err);
      throw err;
    }
  };

  /* ============================
     DEACTIVATE (DELETE)
  ============================ */
  const deactivateUser = async (userId: number) => {
    if (!token) return;

    try {
      const res = await fetch(
        `${API_URL}/api/admin/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo desactivar');
      }

      await fetchUsers();
    } catch (err) {
      console.error('[ADMIN_USER_DELETE]', err);
      throw err;
    }
  };

  /* ============================
     RESET PASSWORD
  ============================ */
  const resetPassword = async (
    userId: number,
    newPassword: string
  ) => {
    if (!token) return;

    try {
      const res = await fetch(
        `${API_URL}/api/admin/users/${userId}/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo resetear');
      }

      await fetchUsers();
    } catch (err) {
      console.error('[ADMIN_RESET_PASSWORD]', err);
      throw err;
    }
  };

  /* ============================
     PUBLIC API
  ============================ */
  return {
    users,
    loading,
    error,

    refresh: fetchUsers,
    setUserActive,
    deactivateUser,
    resetPassword,
  };
}
