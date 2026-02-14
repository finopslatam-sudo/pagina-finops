'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';

/* =====================================================
   TYPES
===================================================== */

export interface AdminUser {
  id: number;
  email: string;
  type: 'global' | 'client';
  global_role: 'root' | 'admin' | 'support' | null;
  client_role: 'owner' | 'finops_admin' | 'viewer' | null;
  client_id: number | null;
  is_active: boolean;
  force_password_change: boolean;
  can_edit: boolean;
  created_at: string | null;
  password_expires_at: string | null;
  company_name: string | null;
  contact_name?: string | null;
}

export function useAdminUsers() {
  const { token } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ======================
     FETCH USERS
  ====================== */

  const fetchUsers = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch<{ data: any[] }>(
        '/api/admin/users',
        { token }
      );

      const adapted: AdminUser[] = res.data.map((u) => ({
        id: u.id,
        email: u.email,
        type: u.type,
        global_role: u.type === 'global' ? u.role : null,
        client_role: u.type === 'client' ? u.role : null,
        client_id: u.client?.id ?? null,
        is_active: Boolean(u.is_active),
        force_password_change: Boolean(u.force_password_change),
        can_edit: Boolean(u.can_edit),
        created_at: u.created_at ?? null,
        password_expires_at: u.password_expires_at ?? null,
        company_name:
          u.company_name ??
          u.client?.company_name ??
          null,
        contact_name: u.contact_name ?? null, 
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

  /* ======================
     CREATE USER
  ====================== */

  const createUser = async (payload: {
    email: string;
    client_id: number;
    client_role: 'owner' | 'finops_admin' | 'viewer';
  }) => {
    if (!token) throw new Error('No token');

    await apiFetch('/api/admin', {
      method: 'POST',
      token,
      body: payload,
    });
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
  };
}
