'use client';

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../api";
import { useAuth } from "@/app/context/AuthContext";

type PlanResponse = any; // backend devuelve array vacío o plan; tipar cuando se amplíe

export function useClientPlan() {
  const { token, isAuthReady } = useAuth();
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlan = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<PlanResponse>("/api/client/plan", {
        token,
      });
      setPlan(data);
    } catch (err: any) {
      setError(err?.message || "No se pudo cargar el plan");
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthReady || !token) return;
    fetchPlan();
  }, [isAuthReady, token, fetchPlan]);

  return { plan, loading, error, refetch: fetchPlan };
}
