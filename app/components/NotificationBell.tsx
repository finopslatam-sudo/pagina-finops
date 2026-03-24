'use client';

import { useEffect, useRef, useState } from 'react';
import { useNotifications, AppNotification } from '@/app/dashboard/hooks/useNotifications';

const TYPE_ICON: Record<string, string> = {
  plan_upgrade_requested: '📈',
  plan_upgrade_approved:  '✅',
  plan_upgrade_rejected:  '❌',
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return 'Ahora';
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} h`;
  return `Hace ${Math.floor(diff / 86400)} d`;
}

export default function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // cerrar al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => setOpen(prev => !prev);

  const handleClick = async (n: AppNotification) => {
    if (!n.is_read) await markRead(n.id);
  };

  return (
    <div ref={ref} className="relative">

      {/* ── BOTÓN CAMPANA ── */}
      <button
        onClick={handleOpen}
        aria-label="Notificaciones"
        className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold
                           w-4 h-4 rounded-full flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── DROPDOWN ── */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">

          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <span className="font-semibold text-slate-800 text-sm">Notificaciones</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {/* lista */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">Sin notificaciones</p>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition
                    ${n.is_read ? 'opacity-60' : 'bg-blue-50/40'}`}
                >
                  <span className="text-xl mt-0.5 shrink-0">{TYPE_ICON[n.type] ?? '🔔'}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-snug text-slate-800 ${n.is_read ? '' : 'font-semibold'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.is_read && (
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}
