"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import { FindingsStats } from "../types";

export function useFindingsStats() {
  const [stats, setStats] = useState<FindingsStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    const res = await apiFetch("/api/client/findings/stats");
    const json = await res.json();
    setStats(json.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refetch: fetchStats };
}
