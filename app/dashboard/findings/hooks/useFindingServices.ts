"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

interface FindingServiceSummaryItem {
  service: string;
}

interface FindingServiceSummaryResponse {
  data: FindingServiceSummaryItem[];
}

export function useFindingServices() {
  const { token, isAuthReady } = useAuth();

  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthReady || !token) return;

    const fetchServices = async () => {
      try {
        const res = await apiFetch<FindingServiceSummaryResponse>(
          "/api/client/findings/summary-by-service",
          {
            token,
            cacheTtlMs: 2 * 60 * 1000,
          }
        );

        const names = res.data.map((s) => s.service);

        setServices(names);
      } catch (err) {
        console.error("Error loading services:", err);
      }
    };

    fetchServices();
  }, [isAuthReady, token]);

  return services;
}
