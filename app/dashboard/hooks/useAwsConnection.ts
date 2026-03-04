"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

interface AwsConnectionStatus {
  connected: boolean;
  account_id?: string;
  role_arn?: string;
  external_id?: string;
}

export function useAwsConnection() {

  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const [connection, setConnection] = useState<AwsConnectionStatus>({
    connected: false
  });

  /* ============================================
     GET CONNECTION STATUS
  ============================================ */

  const fetchStatus = useCallback(async () => {

    if (!token) return;

    try {

      setLoading(true);

      const res = await apiFetch<{
        connected: boolean;
        account_id?: string;
        role_arn?: string;
        external_id?: string;
      }>("/api/client/aws/status", {
        token
      });

      setConnection(res);

    } catch (error) {

      console.error("AWS status error:", error);

      setConnection({
        connected: false
      });

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
     VALIDATE ROLE
  ============================================ */

  const validateRole = async (roleArn: string) => {

    const res = await apiFetch("/api/client/aws/validate", {
      method: "POST",
      token,
      body: {
        role_arn: roleArn
      }
    });

    await fetchStatus();

    return res;

  };

  /* ============================================
     DISCONNECT AWS
  ============================================ */

  const disconnectAws = async () => {

    await apiFetch("/api/client/aws/disconnect", {
      method: "POST",
      token
    });

    await fetchStatus();

  };

  /* ============================================
     LOAD STATUS
  ============================================ */

  useEffect(() => {

    fetchStatus();

  }, [fetchStatus]);

  return {

    loading,
    connecting,

    connection,

    connectAws,
    validateRole,
    disconnectAws,
    refresh: fetchStatus

  };

}