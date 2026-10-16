'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { apiFetch } from '@/app/lib/api';
import { useAuth } from '@/app/context/AuthContext';
import {
  CloudProviderId,
  CloudAccountItem,
  CloudProviderInfo,
  CloudContextType,
  DEFAULT_CLOUDS,
} from './cloudTypes';

export * from './cloudTypes';

const CloudContext = createContext<CloudContextType>({
  clouds: DEFAULT_CLOUDS,
  loading: true,
  configuredProviders: [],
  selectedProvider: 'all',
  setSelectedProvider: () => {},
  selectedAccountId: null,
  setSelectedAccountId: () => {},
  selectedAccountItem: null,
  refreshClouds: async () => {},
});

export function CloudProvider({ children }: { children: React.ReactNode }) {
  const { token, isAuthReady } = useAuth();
  const pathname = usePathname();

  const [clouds, setClouds] = useState<Record<'aws' | 'azure' | 'gcp', CloudProviderInfo>>(DEFAULT_CLOUDS);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProviderState] = useState<CloudProviderId>('all');
  const [selectedAccountId, setSelectedAccountIdState] = useState<string | number | null>(null);

  useEffect(() => {
    setSelectedAccountIdState(null);
  }, [pathname]);

  const fetchCloudStatus = useCallback(async () => {
    if (!isAuthReady || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Intentar primero el endpoint unificado
      try {
        const res = await apiFetch<{
          status: string;
          clouds: Record<'aws' | 'azure' | 'gcp', {
            provider: 'aws' | 'azure' | 'gcp';
            name: string;
            icon: string;
            account_label: string;
            is_configured: boolean;
            status: 'connected' | 'disconnected';
            accounts_count: number;
            accounts_limit: number;
            accounts: Record<string, unknown>[];
          }>;
          configured_providers: ('aws' | 'azure' | 'gcp')[];
        }>('/api/client/cloud/status', { token, cacheTtlMs: 30 * 1000 });

        if (res?.clouds) {
          const mapped: Record<'aws' | 'azure' | 'gcp', CloudProviderInfo> = {
            aws: {
              provider: 'aws',
              name: 'AWS',
              icon: '🟠',
              accountLabel: 'cuentas',
              isConfigured: res.clouds.aws?.is_configured ?? false,
              status: res.clouds.aws?.status ?? 'disconnected',
              accountsCount: res.clouds.aws?.accounts_count ?? 0,
              accountsLimit: res.clouds.aws?.accounts_limit ?? 10,
              accounts: (res.clouds.aws?.accounts ?? []).map((a: any) => ({
                id: a.id,
                name: a.account_name || `Account ${a.account_id}`,
                identifier: a.account_id || String(a.id),
                provider: 'aws' as const,
                isActive: a.is_active ?? true,
                lastSync: a.last_sync,
                auditStatus: a.audit_status,
              })),
            },
            azure: {
              provider: 'azure',
              name: 'Azure',
              icon: '🔷',
              accountLabel: 'suscripciones',
              isConfigured: res.clouds.azure?.is_configured ?? false,
              status: res.clouds.azure?.status ?? 'disconnected',
              accountsCount: res.clouds.azure?.accounts_count ?? 0,
              accountsLimit: res.clouds.azure?.accounts_limit ?? 10,
              accounts: (res.clouds.azure?.accounts ?? []).map((a: any) => ({
                id: a.id,
                name: a.subscription_name || `Sub ${a.subscription_id}`,
                identifier: a.subscription_id || String(a.id),
                provider: 'azure' as const,
                isActive: a.is_active ?? true,
                lastSync: a.last_sync,
                auditStatus: a.audit_status,
              })),
            },
            gcp: {
              provider: 'gcp',
              name: 'GCP',
              icon: '🔴',
              accountLabel: 'proyectos',
              isConfigured: res.clouds.gcp?.is_configured ?? false,
              status: res.clouds.gcp?.status ?? 'disconnected',
              accountsCount: res.clouds.gcp?.accounts_count ?? 0,
              accountsLimit: res.clouds.gcp?.accounts_limit ?? 10,
              accounts: (res.clouds.gcp?.accounts ?? []).map((a: any) => ({
                id: a.id,
                name: a.project_name || `Project ${a.project_id}`,
                identifier: a.project_id || String(a.id),
                provider: 'gcp' as const,
                isActive: a.is_active ?? true,
                lastSync: a.last_sync,
                auditStatus: a.audit_status,
              })),
            },
          };

          setClouds(mapped);
          return;
        }
      } catch {
        // Fallback en paralelo
      }

      const [awsRes, azureRes, gcpRes] = await Promise.allSettled([
        apiFetch<{ accounts: any[] }>('/api/client/aws/accounts', { token }),
        apiFetch<{ status: 'connected' | 'disconnected'; accounts: any[]; accounts_limit: number }>('/api/client/azure/status', { token }),
        apiFetch<{ status: 'connected' | 'disconnected'; accounts: any[]; accounts_limit: number }>('/api/client/gcp/status', { token }),
      ]);

      const awsAccounts = awsRes.status === 'fulfilled' ? (awsRes.value?.accounts ?? []) : [];
      const azureData = azureRes.status === 'fulfilled' ? azureRes.value : null;
      const gcpData = gcpRes.status === 'fulfilled' ? gcpRes.value : null;

      const fallbackMapped: Record<'aws' | 'azure' | 'gcp', CloudProviderInfo> = {
        aws: {
          provider: 'aws',
          name: 'AWS',
          icon: '🟠',
          accountLabel: 'cuentas',
          isConfigured: awsAccounts.length > 0,
          status: awsAccounts.length > 0 ? 'connected' : 'disconnected',
          accountsCount: awsAccounts.length,
          accountsLimit: 10,
          accounts: awsAccounts.map((a: any) => ({
            id: a.id,
            name: a.account_name || `Account ${a.account_id}`,
            identifier: a.account_id || String(a.id),
            provider: 'aws' as const,
            isActive: a.is_active ?? true,
            lastSync: a.last_sync,
            auditStatus: a.audit_status,
          })),
        },
        azure: {
          provider: 'azure',
          name: 'Azure',
          icon: '🔷',
          accountLabel: 'suscripciones',
          isConfigured: (azureData?.accounts?.length ?? 0) > 0,
          status: azureData?.status ?? 'disconnected',
          accountsCount: azureData?.accounts?.length ?? 0,
          accountsLimit: azureData?.accounts_limit ?? 10,
          accounts: (azureData?.accounts ?? []).map((a: any) => ({
            id: a.id,
            name: a.subscription_name || `Sub ${a.subscription_id}`,
            identifier: a.subscription_id || String(a.id),
            provider: 'azure' as const,
            isActive: a.is_active ?? true,
            lastSync: a.last_sync,
            auditStatus: a.audit_status,
          })),
        },
        gcp: {
          provider: 'gcp',
          name: 'GCP',
          icon: '🔴',
          accountLabel: 'proyectos',
          isConfigured: (gcpData?.accounts?.length ?? 0) > 0,
          status: gcpData?.status ?? 'disconnected',
          accountsCount: gcpData?.accounts?.length ?? 0,
          accountsLimit: gcpData?.accounts_limit ?? 10,
          accounts: (gcpData?.accounts ?? []).map((a: any) => ({
            id: a.id,
            name: a.project_name || `Project ${a.project_id}`,
            identifier: a.project_id || String(a.id),
            provider: 'gcp' as const,
            isActive: a.is_active ?? true,
            lastSync: a.last_sync,
            auditStatus: a.audit_status,
          })),
        },
      };

      setClouds(fallbackMapped);
    } catch (err) {
      console.error('Error fetching cloud status:', err);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthReady]);

  useEffect(() => {
    fetchCloudStatus();
  }, [fetchCloudStatus]);

  const configuredProviders = useMemo(() => {
    const list: ('aws' | 'azure' | 'gcp')[] = [];
    if (clouds.aws.isConfigured) list.push('aws');
    if (clouds.azure.isConfigured) list.push('azure');
    if (clouds.gcp.isConfigured) list.push('gcp');
    return list;
  }, [clouds]);

  const setSelectedProvider = (provider: CloudProviderId) => {
    setSelectedProviderState(provider);
    setSelectedAccountIdState(null);
  };

  const setSelectedAccountId = (id: string | number | null) => {
    setSelectedAccountIdState(id);
  };

  const selectedAccountItem = useMemo(() => {
    if (!selectedAccountId) return null;
    for (const key of ['aws', 'azure', 'gcp'] as const) {
      const match = clouds[key].accounts.find((a) => String(a.id) === String(selectedAccountId));
      if (match) return match;
    }
    return null;
  }, [selectedAccountId, clouds]);

  return (
    <CloudContext.Provider
      value={{
        clouds,
        loading,
        configuredProviders,
        selectedProvider,
        setSelectedProvider,
        selectedAccountId,
        setSelectedAccountId,
        selectedAccountItem,
        refreshClouds: fetchCloudStatus,
      }}
    >
      {children}
    </CloudContext.Provider>
  );
}

export function useCloud() {
  return useContext(CloudContext);
}

