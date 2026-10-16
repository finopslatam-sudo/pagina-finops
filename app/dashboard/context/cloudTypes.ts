export type CloudProviderId = 'all' | 'aws' | 'azure' | 'gcp';

export interface CloudAccountItem {
  id: number | string;
  name: string;
  identifier: string;
  provider: 'aws' | 'azure' | 'gcp';
  isActive: boolean;
  lastSync?: string | null;
  auditStatus?: string | null;
}

export interface CloudProviderInfo {
  provider: 'aws' | 'azure' | 'gcp';
  name: string;
  icon: string;
  accountLabel: string;
  isConfigured: boolean;
  status: 'connected' | 'disconnected';
  accountsCount: number;
  accountsLimit: number;
  accounts: CloudAccountItem[];
}

export interface CloudContextType {
  clouds: Record<'aws' | 'azure' | 'gcp', CloudProviderInfo>;
  loading: boolean;
  configuredProviders: ('aws' | 'azure' | 'gcp')[];
  selectedProvider: CloudProviderId;
  setSelectedProvider: (provider: CloudProviderId) => void;
  selectedAccountId: string | number | null;
  setSelectedAccountId: (id: string | number | null) => void;
  selectedAccountItem: CloudAccountItem | null;
  refreshClouds: () => Promise<void>;
}

export const DEFAULT_CLOUDS: Record<'aws' | 'azure' | 'gcp', CloudProviderInfo> = {
  aws: {
    provider: 'aws',
    name: 'AWS',
    icon: '🟠',
    accountLabel: 'cuentas',
    isConfigured: false,
    status: 'disconnected',
    accountsCount: 0,
    accountsLimit: 10,
    accounts: [],
  },
  azure: {
    provider: 'azure',
    name: 'Azure',
    icon: '🔷',
    accountLabel: 'suscripciones',
    isConfigured: false,
    status: 'disconnected',
    accountsCount: 0,
    accountsLimit: 10,
    accounts: [],
  },
  gcp: {
    provider: 'gcp',
    name: 'GCP',
    icon: '🔴',
    accountLabel: 'proyectos',
    isConfigured: false,
    status: 'disconnected',
    accountsCount: 0,
    accountsLimit: 10,
    accounts: [],
  },
};

