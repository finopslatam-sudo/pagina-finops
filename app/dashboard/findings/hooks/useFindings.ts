"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { useAwsAccount } from "@/app/dashboard/context/AwsAccountContext";
import { Finding, FindingsResponse } from "../types";

interface UseFindingsParams {
  page?: number;
  severity?: string;
  status?: string;
  search?: string;
  service?: string;
  account?: number | "";
  region?: string;
}

export function useFindings(params: UseFindingsParams) {

  const { token, isAuthReady } = useAuth();
  const { selectedAccount } = useAwsAccount();

  const [data, setData] = useState<Finding[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFindings = useCallback(async () => {

    if (!isAuthReady) return;

    if (!token) {
      setLoading(false);
      setError("Authentication token not available");
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const query = new URLSearchParams({
        page: String(params.page ?? 1),
        ...(params.severity ? { severity: params.severity } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.search ? { search: params.search } : {}),
        ...(params.service ? { service: params.service } : {}),
        ...(params.account ? { aws_account_id: String(params.account) } : {}),
        ...(params.region ? { region: params.region } : {}),
      });

      if (selectedAccount) {
        query.append("aws_account_id", String(selectedAccount));
      }

      const json = await apiFetch<FindingsResponse>(
        `/api/client/findings/?${query.toString()}`,
        { token }
      );

      setData(Array.isArray(json?.data) ? json.data : []);
      setTotal(typeof json?.total === "number" ? json.total : 0);
      setPages(typeof json?.pages === "number" ? json.pages : 1);

    } catch (err: any) {

      console.error("FINDINGS FETCH ERROR:", err);

      if (err?.status === 401) {
        setError("Unauthorized request");
      } else if (err?.status === 403) {
        setError("Forbidden access");
      } else {
        setError("Failed to load findings");
      }

      setData([]);
      setTotal(0);
      setPages(1);

    } finally {

      setLoading(false);

    }

  }, [
    params.page,
    params.severity,
    params.status,
    params.search,
    params.service,
    params.account,
    params.region,
    token,
    isAuthReady,
    selectedAccount
  ]);

  const resolveFinding = useCallback(async (id: number) => {

    if (!token) return;

    try {

      await apiFetch(`/api/client/findings/${id}/resolve`, {
        method: "PATCH",
        token,
      });

      await fetchFindings();

    } catch (err) {

      console.error("RESOLVE FINDING ERROR:", err);

    }

  }, [token, fetchFindings]);

  useEffect(() => {
    fetchFindings();
  }, [fetchFindings]);

  return {
    data,
    total,
    pages,
    loading,
    error,
    refetch: fetchFindings,
    resolveFinding,
  };

}