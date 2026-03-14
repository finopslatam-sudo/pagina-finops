"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { FindingsStats } from "../types";
import { useAwsAccount } from "@/app/dashboard/context/AwsAccountContext";

export function useFindingsStats() {

  const { token, isAuthReady } = useAuth();
  const { selectedAccount } = useAwsAccount();

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

      const endpoint = selectedAccount
        ? `/api/client/findings/stats?aws_account_id=${selectedAccount}`
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
  }, [token, isAuthReady, selectedAccount]);

  return {
    stats,
    loading,
    refetch: fetchStats
  };

}