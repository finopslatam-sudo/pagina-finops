'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export interface AppNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export function useNotifications() {
  const { token, isAuthReady } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthReady || !token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const json = await res.json();
      setNotifications(json.data ?? []);
      setUnreadCount(json.unread_count ?? 0);
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, [token, isAuthReady]);

  const markRead = useCallback(async (id: number) => {
    if (!token) return;
    await fetch(`${API_URL}/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [token]);

  const markAllRead = useCallback(async () => {
    if (!token) return;
    await fetch(`${API_URL}/api/notifications/read-all`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, [token]);

  const clearRead = useCallback(async () => {
    if (!token) return;
    await fetch(`${API_URL}/api/notifications`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications(prev => prev.filter(n => !n.is_read));
  }, [token]);

  // Carga inicial + polling cada 60 s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  return { notifications, unreadCount, loading, markRead, markAllRead, clearRead, refetch: fetchNotifications };
}
