export type AzureServiceType =
  | 'azure_vm' | 'azure_disk' | 'azure_blob' | 'azure_sql' | 'azure_functions';

export const AZURE_SERVICE_LABELS: Record<AzureServiceType, {
  label: string; icon: string; color: string; btnColor: string;
}> = {
  azure_vm:        { label: 'Virtual Machines', icon: '💻', color: 'bg-blue-50 border-blue-200',       btnColor: 'bg-blue-600 hover:bg-blue-700'       },
  azure_disk:      { label: 'Managed Disks',     icon: '💾', color: 'bg-slate-50 border-slate-200',     btnColor: 'bg-slate-600 hover:bg-slate-700'     },
  azure_blob:      { label: 'Blob Storage',      icon: '🪣', color: 'bg-cyan-50 border-cyan-200',       btnColor: 'bg-cyan-600 hover:bg-cyan-700'       },
  azure_sql:       { label: 'SQL Database',      icon: '🗄️', color: 'bg-indigo-50 border-indigo-200',  btnColor: 'bg-indigo-600 hover:bg-indigo-700'   },
  azure_functions: { label: 'Functions',         icon: '⚡', color: 'bg-amber-50 border-amber-200',     btnColor: 'bg-amber-500 hover:bg-amber-600'     },
};

export interface AzureVMConfig {
  instanceType: string;
  quantity: number;
  hoursPerMonth: number;
}

export interface AzureDiskConfig {
  diskType: 'standard_hdd' | 'standard_ssd' | 'premium_ssd' | 'premium_ssd_v2' | 'ultra_disk';
  sizeGB: number;
  quantity: number;
  provisionedIops: number;
}

export interface AzureBlobConfig {
  storageGB: number;
  tier: 'hot' | 'cool' | 'archive';
  writeOperationsK: number;
  readOperationsK: number;
}

export interface AzureSQLConfig {
  tier: string;
  quantity: number;
  storageGB: number;
}

export interface AzureFunctionsConfig {
  executionsMillions: number;
  avgDurationMs: number;
  memorySizeMB: number;
}

export type AzureServiceConfig =
  | { type: 'azure_vm';        data: AzureVMConfig        }
  | { type: 'azure_disk';      data: AzureDiskConfig      }
  | { type: 'azure_blob';      data: AzureBlobConfig      }
  | { type: 'azure_sql';       data: AzureSQLConfig       }
  | { type: 'azure_functions'; data: AzureFunctionsConfig };
