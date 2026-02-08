'use client';

/* =====================================================
   ADMIN CLIENTS HOOK — FINOPSLATAM
===================================================== */

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';

/* =====================================================
   TYPES
===================================================== */

export interface AdminClient {
  id: number;
  company_name: string;
  email: string;
  contact_name: string | null;
  phone: string | null;
  is_active: boolean;
  plan: string | null;
  created_at: string;
  is_system: boolean;
}

export type CreateClientPayload = {
  company_name: string;
  email: string;
  contact_name?: string;
  phone?: string;
  is_active: boolean;
  plan_id: number;
};

/* =====================================================
   HOOK
===================================================== */

export function useAdminClients() {
  const { token } = useAuth();

  const [clients, setClients] = useState<AdminClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ======================
     FETCH CLIENTS
  ====================== */

  const fetchClients = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch<{
        data: AdminClient[];
        meta: { total: number };
      }>('/api/admin/clients', { token });

      setClients(res.data);
    } catch (err) {
      console.error('[ADMIN_CLIENTS_FETCH]', err);
      setError('No se pudieron cargar los clientes');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  /* ======================
     CREATE CLIENT
  ====================== */

  const createClient = async (
    payload: CreateClientPayload
  ) => {
    if (!token) throw new Error('No token');

    try {
      const res = await apiFetch<{
        data: {
          id: number;
          company_name: string;
          email: string;
        };
      }>('/api/admin/clients', {
        method: 'POST',
        token,
        body: payload,
      });

      await fetchClients();
      return res.data;
    } catch (err) {
      console.error('[ADMIN_CREATE_CLIENT]', err);
      throw err;
    }
  };

  /* ======================
     UPDATE CLIENT
  ====================== */

  const updateClient = async (
    clientId: number,
    payload: Partial<AdminClient>
  ) => {
    if (!token) return;

    try {
      await apiFetch(`/api/admin/clients/${clientId}`, {
        method: 'PATCH',
        token,
        body: payload,
      });

      await fetchClients();
    } catch (err) {
      console.error('[ADMIN_UPDATE_CLIENT]', err);
      throw err;
    }
  };

  /* ======================
     CHANGE PLAN
  ====================== */

  const changeClientPlan = async (
    clientId: number,
    planId: number
  ) => {
    if (!token) return;

    await apiFetch(
      `/api/admin/clients/${clientId}/subscription`,
      {
        method: 'PATCH',
        token,
        body: { plan_id: planId },
      }
    );

    await fetchClients();
  };

  /* ======================
     PUBLIC API
  ====================== */

  return {
    clients,
    loading,
    error,
    refresh: fetchClients,
    createClient,
    updateClient,
    changeClientPlan,
  };
}
