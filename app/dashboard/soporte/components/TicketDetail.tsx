'use client';

import { useState, useEffect } from 'react';
import type { SupportTicket, TicketMessage } from '../hooks/useSupportTickets';
import { TicketStatusBadge, TicketPriorityBadge } from './TicketStatusBadge';

/* =====================================================
   TYPES
===================================================== */

interface Props {
  ticket: SupportTicket | null;
  onClose: () => void;
  onAddMessage: (ticketId: number, body: string) => Promise<TicketMessage>;
  onClose_ticket: (ticketId: number) => Promise<void>;
  onRefresh: (ticketId: number) => Promise<SupportTicket | null>;
}

/* =====================================================
   COMPONENT
===================================================== */

export default function TicketDetail({
  ticket,
  onClose,
  onAddMessage,
  onClose_ticket,
  onRefresh,
}: Props) {
  const [detail, setDetail]   = useState<SupportTicket | null>(ticket);
  const [reply, setReply]     = useState('');
  const [sending, setSending] = useState(false);
  const [closing, setClosing] = useState(false);
  const [err, setErr]         = useState<string | null>(null);

  /* Refresh detail when ticket prop changes */
  useEffect(() => {
    setDetail(ticket);
    setReply('');
    setErr(null);
  }, [ticket]);

  if (!detail) return null;

  const isClosed = detail.status === 'closed';

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    setErr(null);
    try {
      await onAddMessage(detail.id, reply.trim());
      setReply('');
      const updated = await onRefresh(detail.id);
      if (updated) setDetail(updated);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Error al enviar');
    } finally {
      setSending(false);
    }
  };

  const handleClose = async () => {
    setClosing(true);
    setErr(null);
    try {
      await onClose_ticket(detail.id);
      const updated = await onRefresh(detail.id);
      if (updated) setDetail(updated);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Error al cerrar');
    } finally {
      setClosing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
      <div className="w-full sm:w-[480px] bg-white h-full shadow-xl flex flex-col overflow-hidden">

        {/* ─── HEADER ─── */}
        <div className="flex justify-between items-start p-5 border-b">
          <div className="flex-1 min-w-0 pr-3">
            <p className="font-mono text-xs text-gray-400 mb-1">
              {detail.ticket_number}
            </p>
            <h2 className="text-base font-semibold leading-tight line-clamp-2">
              {detail.title}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <TicketStatusBadge status={detail.status} />
              <TicketPriorityBadge priority={detail.priority} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* ─── DESCRIPCIÓN ─── */}
        <div className="p-5 border-b bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Descripción</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{detail.description}</p>
          <p className="text-xs text-gray-400 mt-3">
            Creado el {new Date(detail.created_at).toLocaleString('es-CL')}
          </p>
        </div>

        {/* ─── MENSAJES ─── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {(detail.messages ?? []).length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">
              Sin respuestas aún. Escribe tu mensaje abajo.
            </p>
          )}

          {(detail.messages ?? []).map((msg: TicketMessage) => (
            <div
              key={msg.id}
              className={`flex flex-col gap-1 ${msg.is_staff ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.is_staff
                    ? 'bg-blue-50 border border-blue-200 text-blue-900'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="font-semibold text-xs mb-1 opacity-60">
                  {msg.is_staff ? '🛠 Soporte FinOps' : (msg.author_name ?? 'Tú')}
                </p>
                <p className="whitespace-pre-wrap">{msg.body}</p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(msg.created_at).toLocaleString('es-CL')}
              </span>
            </div>
          ))}
        </div>

        {/* ─── REPLY / CLOSE ─── */}
        <div className="p-4 border-t bg-white">
          {err && <p className="text-red-500 text-xs mb-2">{err}</p>}

          {isClosed ? (
            <p className="text-xs text-gray-400 text-center py-2">
              Este ticket está cerrado.
            </p>
          ) : (
            <>
              <form onSubmit={handleSend} className="flex gap-2 mb-3">
                <textarea
                  rows={2}
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Escribe tu respuesta…"
                  maxLength={5000}
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                  type="submit"
                  disabled={sending || !reply.trim()}
                  className="bg-blue-600 text-white px-4 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 self-end"
                >
                  {sending ? '…' : 'Enviar'}
                </button>
              </form>

              <button
                onClick={handleClose}
                disabled={closing}
                className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors py-1"
              >
                {closing ? 'Cerrando…' : 'Cerrar ticket'}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
