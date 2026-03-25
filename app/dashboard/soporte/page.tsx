'use client';

/* =====================================================
   SOPORTE — PANEL DE TICKETS
===================================================== */

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useSupportTickets } from './hooks/useSupportTickets';
import type { SupportTicket } from './hooks/useSupportTickets';
import TicketList from './components/TicketList';
import TicketCreateModal from './components/TicketCreateModal';
import TicketDetail from './components/TicketDetail';

export default function SoportePage() {
  const { user, token, isAuthReady } = useAuth();
  const router = useRouter();

  const {
    tickets, loading, error,
    loadTickets, getTicket,
    createTicket, addMessage, closeTicket,
  } = useSupportTickets();

  const [statusFilter, setStatusFilter] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selected, setSelected]         = useState<SupportTicket | null>(null);

  /* ─── AUTH GUARD ─── */
  useEffect(() => {
    if (!isAuthReady) return;
    if (!user || !token) { router.replace('/'); return; }
  }, [isAuthReady, user, token, router]);

  /* ─── LOAD ─── */
  useEffect(() => {
    if (isAuthReady && token) {
      loadTickets(statusFilter || undefined);
    }
  }, [isAuthReady, token, statusFilter, loadTickets]);

  /* ─── OPEN DETAIL ─── */
  const handleSelect = async (ticket: SupportTicket) => {
    const detail = await getTicket(ticket.id);
    setSelected(detail ?? ticket);
  };

  if (!isAuthReady) {
    return <p className="text-gray-400 p-6">Cargando…</p>;
  }

  return (
    <section className="space-y-6">

      {/* ─── HEADER ─── */}
      <header className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between
                         bg-gradient-to-r from-blue-600 to-indigo-700 text-white
                         rounded-2xl p-6 lg:p-8 shadow-md">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Soporte FinOps</h1>
          <p className="text-blue-100 text-sm mt-1">
            Envía consultas y solicitudes a nuestro equipo. Respondemos en &lt;24h.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-white text-blue-700 font-semibold px-5 py-2 rounded-lg
                     hover:bg-blue-50 transition-colors text-sm w-full sm:w-auto"
        >
          + Nuevo Ticket
        </button>
      </header>

      {/* ─── KPI ROW ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',      val: tickets.length,                                         color: 'text-gray-700' },
          { label: 'Abiertos',   val: tickets.filter(t => t.status === 'open').length,         color: 'text-blue-600' },
          { label: 'En proceso', val: tickets.filter(t => t.status === 'in_progress').length,  color: 'text-amber-600' },
          { label: 'Resueltos',  val: tickets.filter(t => t.status === 'resolved').length,     color: 'text-green-600' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white border rounded-xl p-4 shadow-sm text-center">
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.val}</p>
            <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* ─── FILTER BAR ─── */}
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
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ─── TABLE ─── */}
      <TicketList
        tickets={tickets}
        loading={loading}
        error={error}
        onSelect={handleSelect}
      />

      {/* ─── MODALS ─── */}
      {isCreateOpen && (
        <TicketCreateModal
          onClose={() => setIsCreateOpen(false)}
          onCreate={async (payload) => {
            await createTicket(payload);
            await loadTickets(statusFilter || undefined);
          }}
        />
      )}

      {selected && (
        <TicketDetail
          ticket={selected}
          onClose={() => setSelected(null)}
          onAddMessage={addMessage}
          onClose_ticket={closeTicket}
          onRefresh={getTicket}
        />
      )}

    </section>
  );
}
