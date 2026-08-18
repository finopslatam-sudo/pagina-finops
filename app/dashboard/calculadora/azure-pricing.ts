import type {
  AzureVMConfig, AzureDiskConfig, AzureBlobConfig, AzureSQLConfig,
  AzureFunctionsConfig, AzureServiceConfig,
} from './azure-types';
import { HOURS_MONTH } from './pricing';

/* ── Virtual Machines — East US, Pay-As-You-Go (Linux) ──────── */
export const AZURE_VM_SIZES: Record<string, { vcpu: number; ram: number; price: number }> = {
  'B2s':          { vcpu: 2,  ram: 4,   price: 0.0416 },
  'B2ms':         { vcpu: 2,  ram: 8,   price: 0.0832 },
  'D2s_v5':       { vcpu: 2,  ram: 8,   price: 0.096  },
  'D4s_v5':       { vcpu: 4,  ram: 16,  price: 0.192  },
  'D8s_v5':       { vcpu: 8,  ram: 32,  price: 0.384  },
  'D16s_v5':      { vcpu: 16, ram: 64,  price: 0.768  },
  'E2s_v5':       { vcpu: 2,  ram: 16,  price: 0.126  },
  'E4s_v5':       { vcpu: 4,  ram: 32,  price: 0.252  },
  'E8s_v5':       { vcpu: 8,  ram: 64,  price: 0.504  },
  'F2s_v2':       { vcpu: 2,  ram: 4,   price: 0.085  },
  'F4s_v2':       { vcpu: 4,  ram: 8,   price: 0.169  },
  'F8s_v2':       { vcpu: 8,  ram: 16,  price: 0.338  },
};

/* ── Managed Disks (LRS, per GB/mes) ────────────────────────── */
export const AZURE_DISK_TYPES: Record<string, { label: string; perGB: number }> = {
  standard_hdd:   { label: 'Standard HDD',    perGB: 0.04  },
  standard_ssd:   { label: 'Standard SSD',    perGB: 0.075 },
  premium_ssd:    { label: 'Premium SSD',     perGB: 0.135 },
  premium_ssd_v2: { label: 'Premium SSD v2',  perGB: 0.095 },
  ultra_disk:     { label: 'Ultra Disk',      perGB: 0.12  },
};
const PREMIUM_V2_IOPS_MONTH = 0.006;
const ULTRA_IOPS_MONTH = 0.045;

/* ── Blob Storage (LRS, per GB/mes) ─────────────────────────── */
export const AZURE_BLOB_TIERS: Record<string, { label: string; perGB: number }> = {
  hot:     { label: 'Hot',     perGB: 0.0184  },
  cool:    { label: 'Cool',    perGB: 0.01    },
  archive: { label: 'Archive', perGB: 0.00099 },
};
const BLOB_WRITE_PER_10K = 0.05;
const BLOB_READ_PER_10K  = 0.004;

/* ── SQL Database — vCore, General Purpose (Gen5) ───────────── */
export const AZURE_SQL_TIERS: Record<string, { vcpu: number; price: number }> = {
  'GP_Gen5_2':  { vcpu: 2, price: 0.246 },
  'GP_Gen5_4':  { vcpu: 4, price: 0.492 },
  'GP_Gen5_8':  { vcpu: 8, price: 0.984 },
};
const SQL_STORAGE_PER_GB = 0.115;

/* ── Functions — Consumption plan ───────────────────────────── */
const FUNCTIONS_REQ_PER_M = 0.20;
const FUNCTIONS_GBS_PRICE = 0.000016;

/* ── Calculation functions ──────────────────────────────────── */

export function calcAzureVM(cfg: AzureVMConfig): number {
  const inst = AZURE_VM_SIZES[cfg.instanceType];
  if (!inst) return 0;
  return inst.price * cfg.hoursPerMonth * cfg.quantity;
}

export function calcAzureDisk(cfg: AzureDiskConfig): number {
  const disk = AZURE_DISK_TYPES[cfg.diskType];
  if (!disk) return 0;
  let cost = disk.perGB * cfg.sizeGB * cfg.quantity;
  if (cfg.diskType === 'premium_ssd_v2') cost += PREMIUM_V2_IOPS_MONTH * cfg.provisionedIops * cfg.quantity;
  if (cfg.diskType === 'ultra_disk') cost += ULTRA_IOPS_MONTH * cfg.provisionedIops * cfg.quantity;
  return cost;
}

export function calcAzureBlob(cfg: AzureBlobConfig): number {
  const tier = AZURE_BLOB_TIERS[cfg.tier];
  if (!tier) return 0;
  return tier.perGB * cfg.storageGB
    + (cfg.writeOperationsK / 10) * BLOB_WRITE_PER_10K
    + (cfg.readOperationsK / 10) * BLOB_READ_PER_10K;
}

export function calcAzureSQL(cfg: AzureSQLConfig): number {
  const tier = AZURE_SQL_TIERS[cfg.tier];
  if (!tier) return 0;
  const compute = tier.price * HOURS_MONTH * cfg.quantity;
  const storage = SQL_STORAGE_PER_GB * cfg.storageGB * cfg.quantity;
  return compute + storage;
}

export function calcAzureFunctions(cfg: AzureFunctionsConfig): number {
  const reqCost = Math.max(0, cfg.executionsMillions - 1) * FUNCTIONS_REQ_PER_M;
  const gbSec = cfg.executionsMillions * 1_000_000 * (cfg.avgDurationMs / 1000) * (cfg.memorySizeMB / 1024);
  const computeCost = Math.max(0, gbSec - 400_000) * FUNCTIONS_GBS_PRICE;
  return reqCost + computeCost;
}

export function calcAzureCost(config: AzureServiceConfig): number {
  switch (config.type) {
    case 'azure_vm':        return calcAzureVM(config.data);
    case 'azure_disk':      return calcAzureDisk(config.data);
    case 'azure_blob':      return calcAzureBlob(config.data);
    case 'azure_sql':       return calcAzureSQL(config.data);
    case 'azure_functions': return calcAzureFunctions(config.data);
    default:                return 0;
  }
}
