'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.finopslatam.com';

export interface AdminUser {
  id: number;
  email: string;
  role: string | null;
  company_name: string | null;
  is_active: boolean;
  global_role?: string | null;
  client_role?: string | null;
}

export function useAdminUsers() {
  const { token } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(
          `Error ${res.status}`
        );
      }

      const json = await res.json();

      const mapped: AdminUser[] =
        (json.users ?? []).map((u: any) => ({
          id: u.id,
          email: u.email,
          role: u.global_role ?? u.client_role ?? null,
          company_name:
            u.client?.company_name ?? null,
          is_active: u.is_active,
          global_role: u.global_role,
          client_role: u.client_role,
        }));

      setUsers(mapped);
    } catch (err) {
      console.error(err);
      setError(
        'No se pudieron cargar los usuarios'
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  // 🔥 CLAVE: refetch cuando token aparece
  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, fetchUsers]);

  return {
    users,
    loading,
    error,
  };
}
