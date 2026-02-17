"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import { Finding, FindingsResponse } from "../types";

interface UseFindingsParams {
  page?: number;
  severity?: string;
  status?: string;
  search?: string;
}

export function useFindings(params: UseFindingsParams) {
  const [data, setData] = useState<Finding[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchFindings = async () => {
    setLoading(true);

    const query = new URLSearchParams({
      page: String(params.page || 1),
      severity: params.severity || "",
      status: params.status || "",
      search: params.search || "",
    });

    const res = await apiFetch(`/api/client/findings?${query}`);

    const json: FindingsResponse = await res.json();

    setData(json.data);
    setTotal(json.total);
    setPages(json.pages);
    setLoading(false);
  };

  const resolveFinding = async (id: number) => {
    await apiFetch(`/api/client/findings/${id}/resolve`, {
      method: "PATCH",
    });

    await fetchFindings();
  };

  useEffect(() => {
    fetchFindings();
  }, [params.page, params.severity, params.status, params.search]);

  return {
    data,
    total,
    pages,
    loading,
    refetch: fetchFindings,
    resolveFinding,
  };
}
