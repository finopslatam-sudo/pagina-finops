"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

interface AwsAccount {
  id: number;
  account_id: string;
  account_name: string;
}

export function useAwsAccounts() {

  const { token, isAuthReady } = useAuth();

  const [accounts, setAccounts] = useState<AwsAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadAccounts = async () => {

      if (!isAuthReady || !token) {
        setLoading(false);
        return;
      }

      try {

        const res = await apiFetch<{ accounts: AwsAccount[] }>(
          "/api/client/aws/accounts",
          {
            token,
            cacheTtlMs: 5 * 60 * 1000,
          }
        );

        setAccounts(res.accounts || []);

      } catch (err) {

        console.error("AWS accounts load error:", err);

      } finally {

        setLoading(false);

      }

    };

    loadAccounts();

  }, [isAuthReady, token]);

  return { accounts, loading };

}
