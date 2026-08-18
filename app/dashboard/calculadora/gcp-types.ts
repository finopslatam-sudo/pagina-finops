export type GCPServiceType =
  | 'gcp_compute' | 'gcp_disk' | 'gcp_storage' | 'gcp_sql' | 'gcp_functions';

export const GCP_SERVICE_LABELS: Record<GCPServiceType, {
  label: string; icon: string; color: string; btnColor: string;
}> = {
  gcp_compute:   { label: 'Compute Engine', icon: '💻', color: 'bg-red-50 border-red-200',       btnColor: 'bg-red-600 hover:bg-red-700'       },
  gcp_disk:      { label: 'Persistent Disk',icon: '💾', color: 'bg-slate-50 border-slate-200',   btnColor: 'bg-slate-600 hover:bg-slate-700'   },
  gcp_storage:   { label: 'Cloud Storage',  icon: '🪣', color: 'bg-yellow-50 border-yellow-200', btnColor: 'bg-yellow-600 hover:bg-yellow-700' },
  gcp_sql:       { label: 'Cloud SQL',      icon: '🗄️', color: 'bg-green-50 border-green-200',  btnColor: 'bg-green-600 hover:bg-green-700'   },
  gcp_functions: { label: 'Cloud Functions',icon: '⚡', color: 'bg-amber-50 border-amber-200',    btnColor: 'bg-amber-500 hover:bg-amber-600'   },
};

export interface GCPComputeConfig {
  instanceType: string;
  quantity: number;
  hoursPerMonth: number;
}

export interface GCPDiskConfig {
  diskType: 'pd_standard' | 'pd_balanced' | 'pd_ssd' | 'pd_extreme';
  sizeGB: number;
  quantity: number;
  provisionedIops: number;
}

export interface GCPStorageConfig {
  storageGB: number;
  storageClass: 'standard' | 'nearline' | 'coldline' | 'archive';
  writeOperationsK: number;
  readOperationsK: number;
}

export interface GCPSQLConfig {
  tier: string;
  quantity: number;
  storageGB: number;
}

export interface GCPFunctionsConfig {
  invocationsMillions: number;
  avgDurationMs: number;
  memorySizeMB: number;
}

export type GCPServiceConfig =
  | { type: 'gcp_compute';   data: GCPComputeConfig   }
  | { type: 'gcp_disk';      data: GCPDiskConfig      }
  | { type: 'gcp_storage';   data: GCPStorageConfig   }
  | { type: 'gcp_sql';       data: GCPSQLConfig       }
  | { type: 'gcp_functions'; data: GCPFunctionsConfig };
