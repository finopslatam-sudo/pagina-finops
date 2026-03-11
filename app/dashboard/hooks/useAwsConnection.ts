"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

interface AwsAccount {
  account_id: string;
  role_arn: string;
}

interface AwsStatus {
  status: "connected" | "disconnected";
  accounts: AwsAccount[];
  accounts_used: number;
  accounts_limit: number;
}

export function useAwsConnection() {

  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const [status, setStatus] = useState<AwsStatus | null>(null);

  /* ============================================
     GET CONNECTION STATUS
  ============================================ */

  const fetchStatus = useCallback(async () => {

    if (!token) return;

    try {

      setLoading(true);

      const res = await apiFetch<AwsStatus>(
        "/api/client/aws/status",
        { token }
      );

      setStatus(res);

    } catch (error) {

      console.error("AWS status error:", error);

      setStatus(null);

    } finally {

      setLoading(false);

    }

  }, [token]);

  /* ============================================
     GENERATE CLOUDFORMATION
  ============================================ */

  const connectAws = async () => {

    try {

      setConnecting(true);

      const res = await apiFetch<{
        cloudformation_url: string;
        external_id: string;
      }>("/api/client/aws/connect", {
        method: "POST",
        token
      });

      return res;

    } catch (error) {

      console.error("AWS connect error:", error);
      throw error;

    } finally {

      setConnecting(false);

    }

  };

  /* ============================================
     VALIDATE CONNECTION
  ============================================ */

  const validateConnection = async (
    accountId: string,
    externalId: string
  ) => {

    const res = await apiFetch(
      "/api/client/aws/validate",
      {
        method: "POST",
        token,
        body: {
          account_id: accountId,
          external_id: externalId
        }
      }
    );

    await fetchStatus();

    return res;

  };

  useEffect(() => {

    fetchStatus();

  }, [fetchStatus]);

  return {

    loading,
    connecting,

    status,

    connectAws,
    validateConnection,
    refresh: fetchStatus

  };

}