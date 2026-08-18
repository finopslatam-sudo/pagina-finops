'use client';

import { useState, useEffect } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

export interface AzureAccount {
  id: string;
  subscription_id: string;
  subscription_name: string;
  audit_status?: string;
}

export type ConnectionStatus = "connected" | "disconnected";

export interface AzureFormState {
  subscriptionId: string;
  tenantId: string;
  appClientId: string;
  clientSecret: string;
}

const EMPTY_FORM: AzureFormState = {
  subscriptionId: "",
  tenantId: "",
  appClientId: "",
  clientSecret: "",
};

export function useAzureConnection() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<AzureAccount[]>([]);
  const [accountLimit, setAccountLimit] = useState<number>(10);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [showConnectionFlow, setShowConnectionFlow] = useState(false);
  const [form, setForm] = useState<AzureFormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    try {
      const res = await apiFetch<{
        status: ConnectionStatus;
        accounts: AzureAccount[];
        accounts_limit: number;
      }>("/api/client/azure/status", { token });

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

    if (!form.subscriptionId || !form.tenantId || !form.appClientId || !form.clientSecret) {
      setError("Completa los 4 campos: Subscription ID, Tenant ID, Application (client) ID y Client Secret.");
      return;
    }

    try {
      setLoading(true);
      await apiFetch("/api/client/azure/validate", {
        method: "POST",
        token,
        body: {
          subscription_id: form.subscriptionId,
          tenant_id: form.tenantId,
          app_client_id: form.appClientId,
          client_secret: form.clientSecret,
        },
      });
      await checkConnection();
      setShowConnectionFlow(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "No se pudo validar la conexión con Azure."
      );
    } finally {
      setLoading(false);
    }
  };

  const runAudit = async () => {
    try {
      setLoading(true);
      await apiFetch("/api/client/azure/audit/run", { method: "POST", token });
      alert("Escaneo de Azure iniciado");
    } catch (error) {
      console.error(error);
      alert("Error al iniciar el escaneo de Azure");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (accountId: string) => {
    try {
      await apiFetch(`/api/client/azure/accounts/${accountId}`, { method: "DELETE", token });
      await checkConnection();
    } catch (err) {
      console.error(err);
      alert("Error al desconectar la cuenta");
    }
  };

  const accountLimitReached = accounts.length >= accountLimit;

  return {
    loading,
    accounts,
    accountLimit,
    status,
    showConnectionFlow,
    form,
    error,
    accountLimitReached,
    setShowConnectionFlow,
    setForm,
    handleValidateConnection,
    runAudit,
    deleteAccount,
  };
}
