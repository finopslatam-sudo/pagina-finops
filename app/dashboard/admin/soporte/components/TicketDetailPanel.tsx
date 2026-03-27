'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';
import { TicketStatusBadge, TicketPriorityBadge } from '../../../soporte/components/TicketStatusBadge';
import type { SupportTicket, TicketMessage } from '../../../soporte/hooks/useSupportTickets';

export interface AdminTicket extends SupportTicket { company_name: string }

interface Props { ticket: AdminTicket; onClose: () => void; onRefresh: () => void }

const STATUS_LABELS: Record<string, string> = {
  open: 'Abierto', in_progress: 'En proceso', resolved: 'Resuelto', closed: 'Cerrado',
};

export default function TicketDetailPanel({ ticket, onClose, onRefresh }: Props) {
  const { token } = useAuth();
  const [detail, setDetail]   = useState<AdminTicket>(ticket);
  const [reply, setReply]     = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr]         = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch<{ ticket: AdminTicket }>(`/api/admin/support/tickets/${ticket.id}`, { token })
      .then(res => setDetail(res.ticket))
      .catch(() => {});
  }, [ticket.id, token]);

  const reload = async () => {
    const res = await apiFetch<{ ticket: AdminTicket }>(`/api/admin/support/tickets/${detail.id}`, { token });
    setDetail(res.ticket);
    onRefresh();
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !token) return;
    setSending(true);
    setErr(null);
    try {
      await apiFetch(`/api/admin/support/tickets/${detail.id}/messages`, { token, method: 'POST', body: { body: reply.trim() } });
      setReply('');
      await reload();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Error al enviar');
    } finally { setSending(false); }
  };

  const handleStatus = async (status: string) => {
    if (!token) return;
    try {
      await apiFetch(`/api/admin/support/tickets/${detail.id}/status`, { token, method: 'PATCH', body: { status } });
      await reload();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Error al cambiar estado');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="w-full sm:w-[520px] bg-white h-full shadow-xl flex flex-col overflow-hidden">
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

        <div className="px-5 py-3 border-b bg-gray-50 flex flex-wrap gap-2 text-xs">
          <span className="text-gray-500 self-center font-medium">Cambiar estado:</span>
          {(['open','in_progress','resolved','closed'] as const).map(s => (
            <button key={s} onClick={() => handleStatus(s)} disabled={detail.status === s}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors ${detail.status === s ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-100 text-gray-600'}`}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <div className="p-5 border-b bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Descripción</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{detail.description}</p>
          <p className="text-xs text-gray-400 mt-3">Creado el {new Date(detail.created_at).toLocaleString('es-CL')}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {(detail.messages ?? []).length === 0 && <p className="text-xs text-gray-400 text-center py-4">Sin mensajes aún.</p>}
          {(detail.messages ?? []).map((msg: TicketMessage) => (
            <div key={msg.id} className={`flex flex-col gap-1 ${msg.is_staff ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.is_staff ? 'bg-indigo-50 border border-indigo-200 text-indigo-900' : 'bg-gray-100 text-gray-800'}`}>
                <p className="font-semibold text-xs mb-1 opacity-60">{msg.is_staff ? '🛠 Soporte (tú)' : (msg.author_name ?? 'Cliente')}</p>
                <p className="whitespace-pre-wrap">{msg.body}</p>
              </div>
              <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString('es-CL')}</span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-white">
          {err && <p className="text-red-500 text-xs mb-2">{err}</p>}
          {detail.status !== 'closed' ? (
            <form onSubmit={handleSend} className="flex gap-2">
              <textarea rows={2} value={reply} onChange={e => setReply(e.target.value)} placeholder="Responde al cliente…" maxLength={5000}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              <button type="submit" disabled={sending || !reply.trim()} className="bg-indigo-600 text-white px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 self-end">
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
