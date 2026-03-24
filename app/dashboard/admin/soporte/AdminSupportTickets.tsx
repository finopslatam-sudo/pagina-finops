'use client';

/* =====================================================
   ADMIN SUPPORT TICKETS
===================================================== */

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';
import { TicketStatusBadge, TicketPriorityBadge } from '../../soporte/components/TicketStatusBadge';
import type { SupportTicket, TicketMessage } from '../../soporte/hooks/useSupportTickets';

/* =====================================================
   EXTENDED TYPE (includes company_name)
===================================================== */

interface AdminTicket extends SupportTicket {
  company_name: string;
}

/* =====================================================
   DETAIL PANEL
===================================================== */

interface DetailPanelProps {
  ticket: AdminTicket;
  onClose: () => void;
  onRefresh: () => void;
}

function DetailPanel({ ticket, onClose, onRefresh }: DetailPanelProps) {
  const { token } = useAuth();
  const [detail, setDetail]   = useState<AdminTicket>(ticket);
  const [reply, setReply]     = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr]         = useState<string | null>(null);

  /* Load full detail with messages */
  useEffect(() => {
    if (!token) return;
    apiFetch<{ ticket: AdminTicket }>(
      `/api/admin/support/tickets/${ticket.id}`,
      { token }
    ).then(res => setDetail(res.ticket)).catch(() => {});
  }, [ticket.id, token]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !token) return;
    setSending(true);
    setErr(null);
    try {
      await apiFetch(`/api/admin/support/tickets/${detail.id}/messages`, {
        token, method: 'POST', body: { body: reply.trim() },
      });
      setReply('');
      const res = await apiFetch<{ ticket: AdminTicket }>(
        `/api/admin/support/tickets/${detail.id}`, { token }
      );
      setDetail(res.ticket);
      onRefresh();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Error al enviar');
    } finally {
      setSending(false);
    }
  };

  const handleStatus = async (status: string) => {
    if (!token) return;
    try {
      await apiFetch(`/api/admin/support/tickets/${detail.id}/status`, {
        token, method: 'PATCH', body: { status },
      });
      const res = await apiFetch<{ ticket: AdminTicket }>(
        `/api/admin/support/tickets/${detail.id}`, { token }
      );
      setDetail(res.ticket);
      onRefresh();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Error al cambiar estado');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="w-full sm:w-[520px] bg-white h-full shadow-xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-start p-5 border-b">
          <div className="flex-1 min-w-0 pr-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-gray-400">{detail.ticket_number}</span>
              <span className="text-xs text-gray-500">·</span>
              <span className="text-xs font-semibold text-indigo-600">{detail.company_name}</span>
            </div>
            <h2 className="text-base font-semibold leading-tight">{detail.title}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <TicketStatusBadge status={detail.status} />
              <TicketPriorityBadge priority={detail.priority} />
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
        </div>

        {/* Change status */}
        <div className="px-5 py-3 border-b bg-gray-50 flex flex-wrap gap-2 text-xs">
          <span className="text-gray-500 self-center font-medium">Cambiar estado:</span>
          {(['open','in_progress','resolved','closed'] as const).map(s => (
            <button
              key={s}
              onClick={() => handleStatus(s)}
              disabled={detail.status === s}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                detail.status === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border hover:bg-gray-100 text-gray-600'
              }`}
            >
              {{ open: 'Abierto', in_progress: 'En proceso', resolved: 'Resuelto', closed: 'Cerrado' }[s]}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className="p-5 border-b bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Descripción</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{detail.description}</p>
          <p className="text-xs text-gray-400 mt-3">
            Creado el {new Date(detail.created_at).toLocaleString('es-CL')}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {(detail.messages ?? []).length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">Sin mensajes aún.</p>
          )}
          {(detail.messages ?? []).map((msg: TicketMessage) => (
            <div key={msg.id} className={`flex flex-col gap-1 ${msg.is_staff ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.is_staff
                  ? 'bg-indigo-50 border border-indigo-200 text-indigo-900'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="font-semibold text-xs mb-1 opacity-60">
                  {msg.is_staff ? '🛠 Soporte (tú)' : (msg.author_name ?? 'Cliente')}
                </p>
                <p className="whitespace-pre-wrap">{msg.body}</p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(msg.created_at).toLocaleString('es-CL')}
              </span>
            </div>
          ))}
        </div>

        {/* Reply */}
        <div className="p-4 border-t bg-white">
          {err && <p className="text-red-500 text-xs mb-2">{err}</p>}
          {detail.status !== 'closed' ? (
            <form onSubmit={handleSend} className="flex gap-2">
              <textarea
                rows={2}
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Responde al cliente…"
                maxLength={5000}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <button
                type="submit"
                disabled={sending || !reply.trim()}
                className="bg-indigo-600 text-white px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 self-end"
              >
                {sending ? '…' : 'Enviar'}
              </button>
            </form>
          ) : (
            <p className="text-xs text-gray-400 text-center py-1">Ticket cerrado.</p>
          )}
        </div>

      </div>
    </div>
  );
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function AdminSupportTickets() {
  const { token } = useAuth();

  const [tickets, setTickets]   = useState<AdminTicket[]>([]);
  const [loading, setLoading]   = useState(true);
  const [statusFilter, setStatus] = useState('');
  const [selected, setSelected] = useState<AdminTicket | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const endpoint = statusFilter
        ? `/api/admin/support/tickets?status=${statusFilter}`
        : '/api/admin/support/tickets';
      const res = await apiFetch<{ data: AdminTicket[] }>(endpoint, { token });
      setTickets(res.data ?? []);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">

      {/* ─── HEADER ─── */}
      <header className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between
                         bg-gradient-to-r from-indigo-600 to-purple-700 text-white
                         rounded-2xl p-6 lg:p-8 shadow-md">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Tickets de Soporte</h1>
          <p className="text-indigo-100 text-sm mt-1">
            Gestiona las consultas de los clientes.
          </p>
        </div>
        <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
          <p className="text-2xl font-bold">{tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length}</p>
          <p className="text-xs text-indigo-100">Pendientes</p>
        </div>
      </header>

      {/* ─── FILTERS ─── */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Todos',      value: ''           },
          { label: 'Abiertos',   value: 'open'       },
          { label: 'En proceso', value: 'in_progress'},
          { label: 'Resueltos',  value: 'resolved'   },
          { label: 'Cerrados',   value: 'closed'     },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ─── TABLE ─── */}
      {loading ? (
        <p className="text-gray-400 text-sm text-center py-12">Cargando tickets…</p>
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🎫</p>
          <p className="text-sm">No hay tickets en esta categoría.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4 font-semibold text-gray-600">N° Ticket</th>
                <th className="p-4 font-semibold text-gray-600">Empresa</th>
                <th className="p-4 font-semibold text-gray-600">Asunto</th>
                <th className="p-4 font-semibold text-gray-600">Prioridad</th>
                <th className="p-4 font-semibold text-gray-600">Estado</th>
                <th className="p-4 font-semibold text-gray-600">Fecha</th>
                <th className="p-4 text-right font-semibold text-gray-600">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tickets.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono text-xs text-gray-500">{t.ticket_number}</td>
                  <td className="p-4 text-indigo-700 font-medium">{t.company_name}</td>
                  <td className="p-4 max-w-[200px]">
                    <span className="line-clamp-1">{t.title}</span>
                  </td>
                  <td className="p-4"><TicketPriorityBadge priority={t.priority} /></td>
                  <td className="p-4"><TicketStatusBadge status={t.status} /></td>
                  <td className="p-4 text-gray-500 text-xs">
                    {new Date(t.created_at).toLocaleDateString('es-CL')}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelected(t)}
                      className="text-indigo-600 hover:underline text-sm"
                    >
                      Atender
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ─── DETAIL ─── */}
      {selected && (
        <DetailPanel
          ticket={selected}
          onClose={() => setSelected(null)}
          onRefresh={load}
        />
      )}

    </div>
  );
}
