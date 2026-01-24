'use client';

/* =====================================================
   ADMIN CLIENTS HOOK — FINOPSLATAM
   Capa de dominio ADMIN (clientes)
===================================================== */

/* =====================================================
   IMPORTS
===================================================== */

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';

/* =====================================================
   TYPES
===================================================== */

/**
 * Cliente administrativo
 * Alineado con tabla `clients`
 */
export interface AdminClient {
  id: number;
  company_name: string;
  email: string;
  contact_name: string | null;
  phone: string | null;
  is_active: boolean;
  plan: string | null;
}

/**
 * Payload creación cliente
 * POST /api/admin/clients
 */
export type CreateClientPayload = {
  company_name: string;
  email: string;
  contact_name?: string;
  phone?: string;
  is_active: boolean;
};

/* =====================================================
   HOOK
===================================================== */

export function useAdminClients() {
  const { token } = useAuth();

  /* =========================
     STATE
  ========================== */

  const [clients, setClients] = useState<AdminClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =====================================================
     FETCH CLIENTS
     GET /api/admin/clients
  ===================================================== */

  const fetchClients = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<{
        clients: AdminClient[];
      }>('/api/admin/clients', { token });

      setClients(data.clients);
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

  /* =====================================================
     CREATE CLIENT
     POST /api/admin/clients
  ===================================================== */

  const createClient = async (payload: CreateClientPayload) => {
    if (!token) return;

    try {
      await apiFetch('/api/admin/clients', {
        method: 'POST',
        token,
        body: payload,
      });

      await fetchClients();
    } catch (err) {
      console.error('[ADMIN_CREATE_CLIENT]', err);
      throw err;
    }
  };

  /* =====================================================
     PUBLIC API
  ===================================================== */

  return {
    clients,
    loading,
    error,

    refresh: fetchClients,
    createClient,
  };
}
