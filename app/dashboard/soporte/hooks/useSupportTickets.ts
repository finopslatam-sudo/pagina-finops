'use client';

import { useState, useCallback } from 'react';
import { apiFetch } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';

/* =====================================================
   TYPES
===================================================== */

export interface TicketMessage {
  id: number;
  ticket_id: number;
  user_id: number;
  is_staff: boolean;
  author_name: string | null;
  body: string;
  created_at: string;
}

export interface SupportTicket {
  id: number;
  ticket_number: string;
  client_id: number;
  user_id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assigned_to_id: number | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  messages?: TicketMessage[];
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

/* =====================================================
   HOOK
===================================================== */

export function useSupportTickets() {
  const { token } = useAuth();

  const [tickets, setTickets]   = useState<SupportTicket[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  /* ─── LIST ─── */
  const loadTickets = useCallback(async (status?: string) => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const endpoint = status
        ? `/api/client/support/tickets?status=${status}`
        : '/api/client/support/tickets';
      const res = await apiFetch<{ data: SupportTicket[] }>(endpoint, { token });
      setTickets(res.data ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar tickets';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* ─── GET DETAIL ─── */
  const getTicket = useCallback(async (id: number): Promise<SupportTicket | null> => {
    if (!token) return null;
    try {
      const res = await apiFetch<{ ticket: SupportTicket }>(
        `/api/client/support/tickets/${id}`,
        { token }
      );
      return res.ticket;
    } catch {
      return null;
    }
  }, [token]);

  /* ─── CREATE ─── */
  const createTicket = useCallback(async (payload: CreateTicketPayload): Promise<SupportTicket> => {
    const res = await apiFetch<{ ticket: SupportTicket }>(
      '/api/client/support/tickets',
      { token, method: 'POST', body: payload }
    );
    return res.ticket;
  }, [token]);

  /* ─── ADD MESSAGE ─── */
  const addMessage = useCallback(async (ticketId: number, body: string): Promise<TicketMessage> => {
    const res = await apiFetch<{ message: TicketMessage }>(
      `/api/client/support/tickets/${ticketId}/messages`,
      { token, method: 'POST', body: { body } }
    );
    return res.message;
  }, [token]);

  /* ─── CLOSE ─── */
  const closeTicket = useCallback(async (ticketId: number): Promise<void> => {
    await apiFetch(
      `/api/client/support/tickets/${ticketId}/close`,
      { token, method: 'PATCH' }
    );
  }, [token]);

  return {
    tickets,
    loading,
    error,
    loadTickets,
    getTicket,
    createTicket,
    addMessage,
    closeTicket,
  };
}
