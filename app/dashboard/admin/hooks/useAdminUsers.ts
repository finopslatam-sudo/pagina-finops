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
  type: 'global' | 'client';
  role: string;
  company_name: string | null;
  is_active: boolean;
  force_password_change?: boolean;
  can_edit: boolean;
}

/* ============================
   HOOK
============================ */

export function useAdminUsers() {
  const { token } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      const json = await res.json();
      setUsers(json.data ?? []);
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

  /* ============================
     UPDATE USER
  ============================ */

  const updateUser = async (
    user: AdminUser,
    payload: {
      role: string;
      is_active: boolean;
    }
  ) => {
    if (!token) return;

    const body: Record<string, any> = {
      is_active: payload.is_active,
    };

    // 🔥 Normalización enterprise
    if (user.type === 'global') {
      body.global_role = payload.role;
    } else {
      body.client_role = payload.role;
    }

    const res = await fetch(
      `${API_URL}/api/admin/users/${user.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
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
