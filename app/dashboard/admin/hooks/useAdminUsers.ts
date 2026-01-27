'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';

/* ============================
   TYPES
============================ */

export interface AdminUser {
  id: number;
  email: string;

  /* ROLES */
  global_role: 'root' | 'admin' | 'support' | null;
  client_role: 'owner' | 'finops_admin' | 'viewer' | null;

  /* CLIENT */
  client_id: number | null;
  company_name: string | null;

  /* FLAGS */
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
      const data = await apiFetch<{
        users: any[];
      }>('/api/admin/users', { token });

      /**
       * 🔥 ADAPTADOR DE CONTRATO
       * Backend → Frontend
       */
      const adapted: AdminUser[] = data.users.map((u) => ({
        id: u.id,
        email: u.email,

        global_role: u.global_role ?? null,
        client_role: u.client_role ?? null,

        client_id: u.client?.id ?? null,
        company_name: u.client?.company_name ?? null,

        is_active: u.is_active,
        force_password_change: u.force_password_change,
      }));

      setUsers(adapted);
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

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}
