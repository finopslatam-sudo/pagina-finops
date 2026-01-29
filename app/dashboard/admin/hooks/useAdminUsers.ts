'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';

/* ============================
   RAW BACKEND TYPE
   (contrato REAL del backend)
============================ */

interface RawAdminUser {
  id: number;
  email: string;

  /**
   * Backend expone:
   * - type: global | client
   * - role: root | support | owner | viewer | finops_admin
   */
  role: 'root' | 'admin' | 'support' | 'owner' | 'finops_admin' | 'viewer';
  type: 'global' | 'client';

  client?: {
    id: number;
    company_name: string;
  } | null;

  company_name?: string | null;

  is_active: boolean;
  force_password_change: boolean;

  // Estos pueden venir ahora o a futuro
  created_at?: string | null;
  password_expires_at?: string | null;
}

/* ============================
   FRONTEND TYPE
   (modelo CANÓNICO para UI)
============================ */

export interface AdminUser {
  // === users table ===
  id: number;
  email: string;

  global_role: 'root' | 'admin' | 'support' | null;
  client_role: 'owner' | 'finops_admin' | 'viewer' | null;

  client_id: number | null;

  is_active: boolean;
  created_at: string | null;
  force_password_change: boolean;
  password_expires_at: string | null;

  // === client join (derivado) ===
  company_name: string | null;
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
      const res = await apiFetch<{ data: RawAdminUser[] }>(
        '/api/admin/users',
        { token }
      );

      /**
       * 🔥 NORMALIZACIÓN ÚNICA
       * Este es el punto crítico del sistema
       */
      const adapted: AdminUser[] = res.data.map((u) => ({
        id: u.id,
        email: u.email,

        global_role:
          u.type === 'global'
            ? (u.role as AdminUser['global_role'])
            : null,

        client_role:
          u.type === 'client'
            ? (u.role as AdminUser['client_role'])
            : null,

        client_id: u.client?.id ?? null,

        is_active: Boolean(u.is_active),
        force_password_change: Boolean(u.force_password_change),

        created_at: u.created_at ?? null,
        password_expires_at: u.password_expires_at ?? null,

        company_name:
          u.company_name ??
          u.client?.company_name ??
          null,
      }));

      setUsers(adapted);
    } catch (err) {
      console.error('[useAdminUsers]', err);
      setError('No se pudieron cargar los usuarios');
      setUsers([]);
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
