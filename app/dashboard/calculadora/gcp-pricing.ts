import type {
  GCPComputeConfig, GCPDiskConfig, GCPStorageConfig, GCPSQLConfig,
  GCPFunctionsConfig, GCPServiceConfig,
} from './gcp-types';
import { HOURS_MONTH } from './pricing';

/* ── Compute Engine — us-central1, On-Demand (Linux) ────────── */
export const GCP_MACHINE_TYPES: Record<string, { vcpu: number; ram: number; price: number }> = {
  'e2-small':      { vcpu: 2,  ram: 2,  price: 0.0201 },
  'e2-medium':     { vcpu: 2,  ram: 4,  price: 0.0402 },
  'e2-standard-2': { vcpu: 2,  ram: 8,  price: 0.0804 },
  'e2-standard-4': { vcpu: 4,  ram: 16, price: 0.1608 },
  'e2-standard-8': { vcpu: 8,  ram: 32, price: 0.3216 },
  'n2-standard-2': { vcpu: 2,  ram: 8,  price: 0.0971 },
  'n2-standard-4': { vcpu: 4,  ram: 16, price: 0.1942 },
  'n2-standard-8': { vcpu: 8,  ram: 32, price: 0.3885 },
  'c2-standard-4': { vcpu: 4,  ram: 16, price: 0.2088 },
  'c2-standard-8': { vcpu: 8,  ram: 32, price: 0.4176 },
};

/* ── Persistent Disk (per GB/mes) ────────────────────────────── */
export const GCP_DISK_TYPES: Record<string, { label: string; perGB: number }> = {
  pd_standard: { label: 'Standard (HDD)', perGB: 0.04  },
  pd_balanced: { label: 'Balanced',       perGB: 0.10  },
  pd_ssd:      { label: 'SSD',            perGB: 0.17  },
  pd_extreme:  { label: 'Extreme',        perGB: 0.125 },
};
const PD_EXTREME_IOPS_MONTH = 0.065;

/* ── Cloud Storage (per GB/mes) ──────────────────────────────── */
export const GCP_STORAGE_CLASSES: Record<string, { label: string; perGB: number }> = {
  standard: { label: 'Standard', perGB: 0.02   },
  nearline: { label: 'Nearline', perGB: 0.01   },
  coldline: { label: 'Coldline', perGB: 0.004  },
  archive:  { label: 'Archive',  perGB: 0.0012 },
};
const STORAGE_WRITE_PER_10K = 0.05;
const STORAGE_READ_PER_10K  = 0.004;

/* ── Cloud SQL — instancias custom (2/4/8 vCPU) ──────────────── */
export const GCP_SQL_TIERS: Record<string, { vcpu: number; price: number }> = {
  'db-custom-2-8192':  { vcpu: 2, price: 0.0932 },
  'db-custom-4-16384': { vcpu: 4, price: 0.1863 },
  'db-custom-8-32768': { vcpu: 8, price: 0.3726 },
};
const SQL_STORAGE_PER_GB = 0.17;

/* ── Cloud Functions — 2nd gen ────────────────────────────────── */
const FUNCTIONS_REQ_PER_M = 0.40;
const FUNCTIONS_GBS_PRICE = 0.0000025;

/* ── Calculation functions ───────────────────────────────────── */

export function calcGCPCompute(cfg: GCPComputeConfig): number {
  const inst = GCP_MACHINE_TYPES[cfg.instanceType];
  if (!inst) return 0;
  return inst.price * cfg.hoursPerMonth * cfg.quantity;
}

export function calcGCPDisk(cfg: GCPDiskConfig): number {
  const disk = GCP_DISK_TYPES[cfg.diskType];
  if (!disk) return 0;
  let cost = disk.perGB * cfg.sizeGB * cfg.quantity;
  if (cfg.diskType === 'pd_extreme') cost += PD_EXTREME_IOPS_MONTH * cfg.provisionedIops * cfg.quantity;
  return cost;
}

export function calcGCPStorage(cfg: GCPStorageConfig): number {
  const cls = GCP_STORAGE_CLASSES[cfg.storageClass];
  if (!cls) return 0;
  return cls.perGB * cfg.storageGB
    + (cfg.writeOperationsK / 10) * STORAGE_WRITE_PER_10K
    + (cfg.readOperationsK / 10) * STORAGE_READ_PER_10K;
}

export function calcGCPSQL(cfg: GCPSQLConfig): number {
  const tier = GCP_SQL_TIERS[cfg.tier];
  if (!tier) return 0;
  const compute = tier.price * HOURS_MONTH * cfg.quantity;
  const storage = SQL_STORAGE_PER_GB * cfg.storageGB * cfg.quantity;
  return compute + storage;
}

export function calcGCPFunctions(cfg: GCPFunctionsConfig): number {
  const reqCost = Math.max(0, cfg.invocationsMillions - 2) * FUNCTIONS_REQ_PER_M;
  const gbSec = cfg.invocationsMillions * 1_000_000 * (cfg.avgDurationMs / 1000) * (cfg.memorySizeMB / 1024);
  const computeCost = Math.max(0, gbSec - 400_000) * FUNCTIONS_GBS_PRICE;
  return reqCost + computeCost;
}

export function calcGCPCost(config: GCPServiceConfig): number {
  switch (config.type) {
    case 'gcp_compute':   return calcGCPCompute(config.data);
    case 'gcp_disk':      return calcGCPDisk(config.data);
    case 'gcp_storage':   return calcGCPStorage(config.data);
    case 'gcp_sql':       return calcGCPSQL(config.data);
    case 'gcp_functions': return calcGCPFunctions(config.data);
    default:              return 0;
  }
}
