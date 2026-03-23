'use client';

import { useState, useEffect, useRef } from "react";
import { apiFetch, API_URL } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

export interface AwsAccount {
  id: string;
  account_id: string;
  account_name: string;
}

export type ConnectionStatus = "connected" | "pending" | "disconnected";

export interface UseAwsConnectionReturn {
  loading: boolean;
  cloudformationUrl: string | null;
  externalId: string | null;
  accountId: string;
  accounts: AwsAccount[];
  accountLimit: number;
  status: ConnectionStatus;
  copied: boolean;
  showConnectionFlow: boolean;
  stepsRef: React.RefObject<HTMLDivElement | null>;
  templateDownloadUrl: string;
  accountLimitReached: boolean;
  setAccountId: (id: string) => void;
  setShowConnectionFlow: (show: boolean) => void;
  setCopied: (copied: boolean) => void;
  handleConnectAws: () => Promise<void>;
  handleValidateConnection: () => Promise<void>;
  runAudit: () => Promise<void>;
}

export function useAwsConnection(): UseAwsConnectionReturn {
  const { token } = useAuth();
  const templateDownloadUrl = `${API_URL}/api/client/aws/template`;

  const [loading, setLoading] = useState(false);
  const [cloudformationUrl, setCloudformationUrl] = useState<string | null>(null);
  const [externalId, setExternalId] = useState<string | null>(null);
  const [accountId, setAccountId] = useState("");
  const [accounts, setAccounts] = useState<AwsAccount[]>([]);
  const [accountLimit, setAccountLimit] = useState<number>(1);
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [copied, setCopied] = useState(false);
  const [showConnectionFlow, setShowConnectionFlow] = useState(false);
  const stepsRef = useRef<HTMLDivElement | null>(null);

  const checkConnection = async () => {
    try {
      const res = await apiFetch<{
        status: ConnectionStatus;
        accounts: AwsAccount[];
        accounts_limit: number;
        accounts_used: number;
      }>("/api/client/aws/status", { token });

      setAccounts(res.accounts || []);
      setAccountLimit(res.accounts_limit || 1);
      setStatus(res.status || "disconnected");
    } catch (err) {
      console.error(err);
      setStatus("disconnected");
      setAccounts([]);
    }
  };

  useEffect(() => {
    if (token) {
      checkConnection();
    }
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        checkConnection();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [token]);

  const handleConnectAws = async () => {
    try {
      setLoading(true);
      const response = await apiFetch<{
        cloudformation_url: string;
        external_id: string;
      }>("/api/client/aws/connect", {
        method: "POST",
        token,
      });
      setCloudformationUrl(response.cloudformation_url);
      setExternalId(response.external_id);
      setStatus("pending");
      await checkConnection();
    } catch (error) {
      console.error(error);
      alert("Error generating CloudFormation stack");
    } finally {
      setLoading(false);
    }
  };

  const handleValidateConnection = async () => {
    try {
      if (!accountId || !externalId) {
        alert("Debes ingresar el AWS Account ID");
        return;
      }
      if (!/^\d{12}$/.test(accountId)) {
        alert("AWS Account ID debe tener 12 dígitos");
        return;
      }
      await apiFetch("/api/client/aws/validate", {
        method: "POST",
        token,
        body: {
          account_id: accountId,
          external_id: externalId,
        },
      });
      await checkConnection();
      setShowConnectionFlow(false);
    } catch (err) {
      console.error(err);
      alert("Error validating AWS connection");
    }
  };

  const runAudit = async () => {
    try {
      setLoading(true);
      await apiFetch("/api/client/audit/run", {
        method: "POST",
        token,
      });
      alert("Audit started successfully");
    } catch (error) {
      console.error(error);
      alert("Error running audit");
    } finally {
      setLoading(false);
    }
  };

  const accountLimitReached = accounts.length >= accountLimit;

  return {
    loading,
    cloudformationUrl,
    externalId,
    accountId,
    accounts,
    accountLimit,
    status,
    copied,
    showConnectionFlow,
    stepsRef,
    templateDownloadUrl,
    accountLimitReached,
    setAccountId,
    setShowConnectionFlow,
    setCopied,
    handleConnectAws,
    handleValidateConnection,
    runAudit,
  };
}
