"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { FindingsStats } from "../types";

interface UseFindingsStatsParams {
  severity?: string;
  status?: string;
  search?: string;
  service?: string;
  account?: number | "";
  region?: string;
}

export function useFindingsStats(params: UseFindingsStatsParams = {}) {

  const { token, isAuthReady } = useAuth();

  const [stats, setStats] = useState<FindingsStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {

    if (!isAuthReady || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {

      /* =====================================================
         BUILD ENDPOINT WITH ACCOUNT FILTER
      ===================================================== */

      const query = new URLSearchParams({
        ...(params.severity ? { severity: params.severity } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.search ? { search: params.search } : {}),
        ...(params.service ? { service: params.service } : {}),
        ...(params.account ? { aws_account_id: String(params.account) } : {}),
        ...(params.region ? { region: params.region } : {}),
      });

      const endpoint = query.toString()
        ? `/api/client/findings/stats?${query.toString()}`
        : `/api/client/findings/stats`;

      const json = await apiFetch<{ data: FindingsStats }>(
        endpoint,
        { token }
      );

      setStats(json.data);

    } catch (error) {

      console.error("FINDINGS STATS ERROR:", error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchStats();
  }, [
    token,
    isAuthReady,
    params.severity,
    params.status,
    params.search,
    params.service,
    params.account,
    params.region
  ]);

  return {
    stats,
    loading,
    refetch: fetchStats
  };

}
