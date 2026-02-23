'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';

interface InventoryResource {
  resource_id: string;
  resource_type: string;
  region: string;
  state: string;
  has_findings: boolean;
  findings_count: number;
  tags: Record<string, string>;
  metadata: any;
}

interface InventoryResponse {
  summary: Record<string, number>;
  resources: InventoryResource[];
}

export function useInventory() {
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
        }>('/api/client/inventory', { token });

        if (response.status !== 'ok') {
          throw new Error('Error loading inventory');
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
  }, [isAuthReady, token]);

  return { data, loading, error };
}