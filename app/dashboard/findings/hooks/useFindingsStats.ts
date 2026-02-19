"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { FindingsStats } from "../types";

export function useFindingsStats() {
  const { token, isAuthReady } = useAuth();

  const [stats, setStats] = useState<FindingsStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!isAuthReady || !token) return;

    setLoading(true);

    const json = await apiFetch<{ data: FindingsStats }>(
      "/api/client/findings/stats",
      { token }
    );

    setStats(json.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [token, isAuthReady]);

  return { stats, loading, refetch: fetchStats };
}
