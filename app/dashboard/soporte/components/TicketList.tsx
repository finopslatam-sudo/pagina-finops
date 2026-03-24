'use client';

import type { SupportTicket } from '../hooks/useSupportTickets';
import { TicketStatusBadge, TicketPriorityBadge } from './TicketStatusBadge';

/* =====================================================
   TYPES
===================================================== */

interface Props {
  tickets: SupportTicket[];
  loading: boolean;
  error: string | null;
  onSelect: (ticket: SupportTicket) => void;
}

/* =====================================================
   COMPONENT
===================================================== */

export default function TicketList({ tickets, loading, error, onSelect }: Props) {
  if (loading) {
    return <p className="text-gray-400 text-sm py-8 text-center">Cargando tickets…</p>;
  }

  if (error) {
    return <p className="text-red-500 text-sm py-4">{error}</p>;
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">🎫</p>
        <p className="text-sm">No tienes tickets de soporte aún.</p>
        <p className="text-xs mt-1">Crea uno con el botón de arriba.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-4 font-semibold text-gray-600">N° Ticket</th>
            <th className="p-4 font-semibold text-gray-600">Asunto</th>
            <th className="p-4 font-semibold text-gray-600">Prioridad</th>
            <th className="p-4 font-semibold text-gray-600">Estado</th>
            <th className="p-4 font-semibold text-gray-600">Fecha</th>
            <th className="p-4 text-right font-semibold text-gray-600">Acción</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {tickets.map(ticket => (
            <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 font-mono text-xs text-gray-500">
                {ticket.ticket_number}
              </td>
              <td className="p-4 font-medium max-w-[240px]">
                <span className="line-clamp-1">{ticket.title}</span>
              </td>
              <td className="p-4">
                <TicketPriorityBadge priority={ticket.priority} />
              </td>
              <td className="p-4">
                <TicketStatusBadge status={ticket.status} />
              </td>
              <td className="p-4 text-gray-500 text-xs">
                {new Date(ticket.created_at).toLocaleDateString('es-CL')}
              </td>
              <td className="p-4 text-right">
                <button
                  onClick={() => onSelect(ticket)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
