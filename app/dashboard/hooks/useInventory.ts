'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';
import { useAwsAccount } from '../context/AwsAccountContext';

/* =====================================================
   TYPES
===================================================== */

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | null;

interface InventoryResource {
  resource_id: string;
  service_name: string;
  resource_type: string;
  region: string;

  state: {
    raw: string | null;
    label: string;
    category: 'healthy' | 'warning' | 'waste' | 'unknown';
  };

  severity: 'LOW' | 'MEDIUM' | 'HIGH' | null;
  risk_label: string;
  findings_count: number;

  tags?: Record<string, string>;
  detected_at?: string;
  last_seen_at?: string;
}

interface PaginationInfo {
  page: number;
  per_page: number;
  total: number;
  pages: number;
}

interface InventoryResponse {
  summary: Record<string, number>;
  resources: InventoryResource[];
  pagination: PaginationInfo;
}

interface InventoryServices {
  services: Record<string, number>;
}

interface InventoryHealth {
  healthy: number;
  warning: number;
  waste: number;
  unknown: number;
}

/* =====================================================
   HOOK
===================================================== */

export function useInventory(page: number = 1, perPage: number = 50) {

  const { token, isAuthReady } = useAuth();
  const { selectedAccount } = useAwsAccount();

  const [data, setData] = useState<InventoryResponse | null>(null);
  const [servicesMeta, setServicesMeta] = useState<InventoryServices | null>(null);
  const [healthMeta, setHealthMeta] = useState<InventoryHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {

    if (!isAuthReady || !token) return;

    const fetchInventory = async () => {

      try {

        setLoading(true);

        let endpoint = `/api/client/inventory?page=${page}&per_page=${perPage}`;

        if (selectedAccount) {
          endpoint += `&aws_account_id=${selectedAccount}`;
        }

        const inventoryPromise = apiFetch<{
          status: string;
          data: InventoryResponse;
        }>(endpoint, {
          token,
          cacheTtlMs: 20 * 1000,
        });

        const servicesPromise = apiFetch<InventoryServices>(
          "/api/client/inventory/services",
          {
            token,
            cacheTtlMs: 60 * 1000,
          }
        );

        const healthPromise = apiFetch<InventoryHealth>(
          "/api/client/inventory/health",
          {
            token,
            cacheTtlMs: 60 * 1000,
          }
        );

        const [inventoryRes, servicesRes, healthRes] = await Promise.all([
          inventoryPromise,
          servicesPromise,
          healthPromise,
        ]);

        if (inventoryRes.status !== 'ok') {
          throw new Error('Inventory response not ok');
        }

        setData(inventoryRes.data);
        setServicesMeta(servicesRes);
        setHealthMeta(healthRes);
        setError('');

      } catch (err) {

        console.error('INVENTORY ERROR:', err);
        setError('No se pudo cargar el inventario.');

      } finally {

        setLoading(false);

      }

    };

    fetchInventory();

  }, [isAuthReady, token, page, perPage, selectedAccount]);

  return { data, servicesMeta, healthMeta, loading, error };
}
