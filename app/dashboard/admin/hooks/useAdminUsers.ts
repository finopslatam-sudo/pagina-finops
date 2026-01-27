'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.finopslatam.com';

/* ============================
   TYPES (ALINEADO A BD)
============================ */

export interface AdminUser {
  id: number;
  email: string;
  global_role: 'root' | 'admin' | 'support' | null;
  client_role: 'owner' | 'finops_admin' | 'viewer' | null;
  client: {
    id: number;
    company_name: string;
  } | null;
  is_active: boolean;
  force_password_change: boolean;
}

/* ============================
   HOOK
============================ */

export function useAdminUsers() {
  const { token } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const json = await res.json();

      setUsers(json.users ?? []);
    } catch (err) {
      console.error('[useAdminUsers]', err);
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUser = async (
    userId: number,
    payload: Partial<{
      email: string;
      global_role: 'admin' | 'support' | null;
      client_role: 'owner' | 'finops_admin' | 'viewer' | null;
      is_active: boolean;
      force_password_change: boolean;
    }>
  ) => {
    if (!token) return;

    const res = await fetch(
      `${API_URL}/api/admin/users/${userId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      throw new Error('Error actualizando usuario');
    }

    await fetchUsers();
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    updateUser,
  };
}
