'use client';

import { useState, useEffect } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

export interface GcpAccount {
  id: string;
  project_id: string;
  project_name: string;
  service_account_email: string;
  audit_status?: string;
}

export type ConnectionStatus = "connected" | "disconnected";

export function useGcpConnection() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<GcpAccount[]>([]);
  const [accountLimit, setAccountLimit] = useState<number>(10);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [showConnectionFlow, setShowConnectionFlow] = useState(false);
  const [serviceAccountKey, setServiceAccountKey] = useState("");
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    try {
      const res = await apiFetch<{
        status: ConnectionStatus;
        accounts: GcpAccount[];
        accounts_limit: number;
      }>("/api/client/gcp/status", { token });

      setAccounts(res.accounts || []);
      setAccountLimit(res.accounts_limit || 10);
      setStatus(res.status || "disconnected");
    } catch (err) {
      console.error(err);
      setStatus("disconnected");
      setAccounts([]);
    }
  };

  useEffect(() => {
    if (token) checkConnection();
  }, [token]);

  const handleValidateConnection = async () => {
    setError(null);

    if (!serviceAccountKey.trim()) {
      setError("Pega el contenido del archivo JSON de la Service Account.");
      return;
    }

    let parsedKey: unknown;
    try {
      parsedKey = JSON.parse(serviceAccountKey);
    } catch {
      setError("El texto pegado no es un JSON válido. Copia el contenido completo del archivo descargado.");
      return;
    }

    try {
      setLoading(true);
      await apiFetch("/api/client/gcp/validate", {
        method: "POST",
        token,
        body: { service_account_key: parsedKey },
      });
      await checkConnection();
      setShowConnectionFlow(false);
      setServiceAccountKey("");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "No se pudo validar la conexión con GCP."
      );
    } finally {
      setLoading(false);
    }
  };

  const runAudit = async () => {
    try {
      setLoading(true);
      await apiFetch("/api/client/gcp/audit/run", { method: "POST", token });
      alert("Escaneo de GCP iniciado");
    } catch (error) {
      console.error(error);
      alert("Error al iniciar el escaneo de GCP");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (accountId: string) => {
    try {
      await apiFetch(`/api/client/gcp/accounts/${accountId}`, { method: "DELETE", token });
      await checkConnection();
    } catch (err) {
      console.error(err);
      alert("Error al desconectar el proyecto");
    }
  };

  const accountLimitReached = accounts.length >= accountLimit;

  return {
    loading,
    accounts,
    accountLimit,
    status,
    showConnectionFlow,
    serviceAccountKey,
    error,
    accountLimitReached,
    setShowConnectionFlow,
    setServiceAccountKey,
    handleValidateConnection,
    runAudit,
    deleteAccount,
  };
}
