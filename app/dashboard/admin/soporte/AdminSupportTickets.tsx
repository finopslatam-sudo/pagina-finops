'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';
import { TicketStatusBadge, TicketPriorityBadge } from '../../soporte/components/TicketStatusBadge';
import TicketDetailPanel, { AdminTicket } from './components/TicketDetailPanel';

const STATUS_FILTERS = [
  { label: 'Todos',      value: ''            },
  { label: 'Abiertos',   value: 'open'        },
  { label: 'En proceso', value: 'in_progress' },
  { label: 'Resueltos',  value: 'resolved'    },
  { label: 'Cerrados',   value: 'closed'      },
];

export default function AdminSupportTickets() {
  const { token } = useAuth();
  const [tickets, setTickets]     = useState<AdminTicket[]>([]);
  const [loading, setLoading]     = useState(true);
  const [statusFilter, setStatus] = useState('');
  const [selected, setSelected]   = useState<AdminTicket | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const endpoint = statusFilter
        ? `/api/admin/support/tickets?status=${statusFilter}`
        : '/api/admin/support/tickets';
      const res = await apiFetch<{ data: AdminTicket[] }>(endpoint, { token });
      setTickets(res.data ?? []);
    } catch { setTickets([]); }
    finally { setLoading(false); }
  }, [token, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const pending = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-6 lg:p-8 shadow-md">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Tickets de Soporte</h1>
          <p className="text-indigo-100 text-sm mt-1">Gestiona las consultas de los clientes.</p>
        </div>
        <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
          <p className="text-2xl font-bold">{pending}</p>
          <p className="text-xs text-indigo-100">Pendientes</p>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map(f => (
          <button key={f.value} onClick={() => setStatus(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${statusFilter === f.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f.label}
          </button>
        ))}
      </div>

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
                {['N° Ticket', 'Empresa', 'Asunto', 'Prioridad', 'Estado', 'Fecha', 'Acción'].map((h, i) => (
                  <th key={h} className={`p-4 font-semibold text-gray-600 ${i === 6 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {tickets.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono text-xs text-gray-500">{t.ticket_number}</td>
                  <td className="p-4 text-indigo-700 font-medium">{t.company_name}</td>
                  <td className="p-4 max-w-[200px]"><span className="line-clamp-1">{t.title}</span></td>
                  <td className="p-4"><TicketPriorityBadge priority={t.priority} /></td>
                  <td className="p-4"><TicketStatusBadge status={t.status} /></td>
                  <td className="p-4 text-gray-500 text-xs">{new Date(t.created_at).toLocaleDateString('es-CL')}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setSelected(t)} className="text-indigo-600 hover:underline text-sm">Atender</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && <TicketDetailPanel ticket={selected} onClose={() => setSelected(null)} onRefresh={load} />}
    </div>
  );
}
