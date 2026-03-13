"use client";

import { useState } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

export interface AuditAccountStatus {
  account_id: number;
  account_name: string;
  status: "idle" | "running" | "completed" | "failed";
}

export function useAuditStatus() {

  const { token } = useAuth();

  const [accounts, setAccounts] = useState<AuditAccountStatus[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {

    if (!token) return;

    setLoading(true);

    try {

      const data = await apiFetch<AuditAccountStatus[]>(
        "/api/client/audit/status",
        { token }
      );

      setAccounts(data);

      return data;

    } catch (err) {

      console.error("AUDIT STATUS ERROR", err);

      return [];

    } finally {

      setLoading(false);

    }

  };

  return {
    accounts,
    loading,
    fetchStatus
  };
}