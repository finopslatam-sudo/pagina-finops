'use client';

import type { SupportTicket } from '../hooks/useSupportTickets';

type Status   = SupportTicket['status'];
type Priority = SupportTicket['priority'];

/* =====================================================
   STATUS BADGE
===================================================== */

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  open:        { label: 'Abierto',      className: 'bg-blue-100 text-blue-700'   },
  in_progress: { label: 'En proceso',   className: 'bg-amber-100 text-amber-700' },
  resolved:    { label: 'Resuelto',     className: 'bg-green-100 text-green-700' },
  closed:      { label: 'Cerrado',      className: 'bg-gray-100 text-gray-500'   },
};

export function TicketStatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.open;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

/* =====================================================
   PRIORITY BADGE
===================================================== */

const PRIORITY_CONFIG: Record<Priority, { label: string; className: string }> = {
  low:      { label: 'Baja',     className: 'bg-gray-100 text-gray-500'   },
  medium:   { label: 'Media',    className: 'bg-blue-100 text-blue-700'   },
  high:     { label: 'Alta',     className: 'bg-orange-100 text-orange-700' },
  critical: { label: 'Crítica',  className: 'bg-red-100 text-red-700'     },
};

export function TicketPriorityBadge({ priority }: { priority: Priority }) {
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.medium;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}
