"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { Finding, FindingsResponse } from "../types";

interface UseFindingsParams {
  page?: number;
  severity?: string;
  status?: string;
  search?: string;
  service?: string;
}

export function useFindings(params: UseFindingsParams) {
  const { token, isAuthReady } = useAuth();

  const [data, setData] = useState<Finding[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchFindings = async () => {
    if (!isAuthReady || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const query = new URLSearchParams({
      page: String(params.page || 1),
      severity: params.severity || "",
      status: params.status || "",
      search: params.search || "",
      service: params.service || "",
    });

    const json = await apiFetch<FindingsResponse>(
      `/api/client/findings?${query}`,
      { token }
    );

    setData(json.data);
    setTotal(json.total);
    setPages(json.pages);
    setLoading(false);
  };

  const resolveFinding = async (id: number) => {
    if (!token) return;

    await apiFetch(`/api/client/findings/${id}/resolve`, {
      method: "PATCH",
      token,
    });

    await fetchFindings();
  };

  useEffect(() => {
    fetchFindings();
  }, [params.page, params.severity, params.status, params.search, params.service, token, isAuthReady]);

  return {
    data,
    total,
    pages,
    loading,
    refetch: fetchFindings,
    resolveFinding,
  };
}
