'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';

/* =====================================================
   TYPES
===================================================== */

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | null;

interface InventoryResource {
  resource_id: string;
  service_name: string;
  resource_type: string;
  region: string;
  state: string;

  severity: SeverityLevel;
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

/* =====================================================
   HOOK
===================================================== */

export function useInventory(page: number = 1, perPage: number = 50) {
  const { token, isAuthReady } = useAuth();

  const [data, setData] = useState<InventoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!isAuthReady || !token) return;

    const fetchInventory = async () => {
      try {
        setLoading(true);

        const response = await apiFetch<{
          status: string;
          data: InventoryResponse;
        }>(`/api/client/inventory?page=${page}&per_page=${perPage}`, {
          token,
        });

        if (response.status !== 'ok') {
          throw new Error('Inventory response not ok');
        }

        setData(response.data);
        setError('');
      } catch (err) {
        console.error('INVENTORY ERROR:', err);
        setError('No se pudo cargar el inventario.');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [isAuthReady, token, page, perPage]);

  return { data, loading, error };
}