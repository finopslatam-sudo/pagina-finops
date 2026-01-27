'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.finopslatam.com';

/* ============================
   TYPES (ALINEADOS A BD)
============================ */

export interface AdminUser {
  id: number;
  email: string;
  type: 'global' | 'client';
  global_role: 'root' | 'admin' | 'support' | null;
  client_role: 'owner' | 'viewer' | null;
  company_name: string | null;
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
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      const json = await res.json();
      setUsers(json.users); // ← backend real
    } catch {
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUser = async (
    user: AdminUser,
    payload: {
      email?: string;
      is_active?: boolean;
      global_role?: AdminUser['global_role'];
      client_role?: AdminUser['client_role'];
      force_password_change?: boolean;
    }
  ) => {
    if (!token) return;

    const res = await fetch(
      `${API_URL}/api/admin/users/${user.id}`,
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
    updateUser,
  };
}
