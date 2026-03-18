'use client';

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

type Snapshot = {
  created_at?: string;
  risk_score?: number;
  governance?: number;
  savings?: number;
  [key: string]: any;
};

export function useSnapshots() {
  const { token, isAuthReady } = useAuth();

  const [latest, setLatest] = useState<Snapshot | null>(null);
  const [trend, setTrend] = useState<any>(null);
  const [delta, setDelta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [latestRes, trendRes, deltaRes] = await Promise.all([
        apiFetch<Snapshot>("/api/client/snapshots/latest", { token }),
        apiFetch<any>("/api/client/snapshots/trend", { token }),
        apiFetch<any>("/api/client/snapshots/delta", { token }),
      ]);
      setLatest(latestRes);
      setTrend(trendRes);
      setDelta(deltaRes);
    } catch (err: any) {
      setError(err?.message || "No se pudieron cargar los snapshots");
      setLatest(null);
      setTrend(null);
      setDelta(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthReady || !token) return;
    fetchAll();
  }, [isAuthReady, token, fetchAll]);

  return { latest, trend, delta, loading, error, refetch: fetchAll };
}
