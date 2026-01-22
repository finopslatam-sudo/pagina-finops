'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';

/* ============================
   TIPOS
============================ */
export interface AdminUser {
  id: number;
  email: string;
  contact_name?: string;
  phone?: string;
  is_active: boolean;
  global_role: 'root' | 'support' | null;
  client_role?: 'owner' | 'finops_admin' | 'viewer' | null;
  client_id?: number | null;
  company_name?: string | null;
}

/* ============================
   HOOK
============================ */
export function useAdminUsers() {
  const { user, token } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ============================
     FETCH USERS
  ============================ */
  const fetchUsers = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch('/api/admin/users', { token });
      setUsers(data);
    } catch (err) {
      console.error('FETCH USERS ERROR:', err);
      setError('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* ============================
     INACTIVATE USER
  ============================ */
  const inactivateUser = async (target: AdminUser) => {
    if (!token || !user) return;

    // 🔒 Reglas de seguridad (frontend)
    if (target.id === user.id) {
      throw new Error('No puedes inactivarte a ti mismo');
    }

    if (
      target.global_role === 'root' &&
      user.global_role !== 'root'
    ) {
      throw new Error('No tienes permisos para inactivar este usuario');
    }

    await apiFetch(`/api/admin/users/${target.id}/inactivate`, {
      method: 'PATCH',
      token,
    });

    await fetchUsers();
  };

  /* ============================
     INIT
  ============================ */
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refresh: fetchUsers,
    inactivateUser,
  };
}
