import type {
  EC2Config, RDSConfig, LambdaConfig, S3Config, EBSConfig,
  DynamoDBConfig, NATConfig, ECSConfig, CloudWatchConfig, ServiceConfig,
} from './types';

/* ── EC2 On-Demand — us-east-1 (Linux) ──────────────────────── */
export const EC2_INSTANCES: Record<string, { vcpu: number; ram: number; price: number }> = {
  't3.micro':    { vcpu: 2,  ram: 1,   price: 0.0104  },
  't3.small':    { vcpu: 2,  ram: 2,   price: 0.0208  },
  't3.medium':   { vcpu: 2,  ram: 4,   price: 0.0416  },
  't3.large':    { vcpu: 2,  ram: 8,   price: 0.0832  },
  't3.xlarge':   { vcpu: 4,  ram: 16,  price: 0.1664  },
  't3.2xlarge':  { vcpu: 8,  ram: 32,  price: 0.3328  },
  'm5.large':    { vcpu: 2,  ram: 8,   price: 0.096   },
  'm5.xlarge':   { vcpu: 4,  ram: 16,  price: 0.192   },
  'm5.2xlarge':  { vcpu: 8,  ram: 32,  price: 0.384   },
  'm5.4xlarge':  { vcpu: 16, ram: 64,  price: 0.768   },
  'm6i.large':   { vcpu: 2,  ram: 8,   price: 0.096   },
  'm6i.xlarge':  { vcpu: 4,  ram: 16,  price: 0.192   },
  'm6i.2xlarge': { vcpu: 8,  ram: 32,  price: 0.384   },
  'c5.large':    { vcpu: 2,  ram: 4,   price: 0.085   },
  'c5.xlarge':   { vcpu: 4,  ram: 8,   price: 0.17    },
  'c5.2xlarge':  { vcpu: 8,  ram: 16,  price: 0.34    },
  'c5.4xlarge':  { vcpu: 16, ram: 32,  price: 0.68    },
  'c6i.large':   { vcpu: 2,  ram: 4,   price: 0.085   },
  'c6i.xlarge':  { vcpu: 4,  ram: 8,   price: 0.17    },
  'r5.large':    { vcpu: 2,  ram: 16,  price: 0.126   },
  'r5.xlarge':   { vcpu: 4,  ram: 32,  price: 0.252   },
  'r5.2xlarge':  { vcpu: 8,  ram: 64,  price: 0.504   },
  'r5.4xlarge':  { vcpu: 16, ram: 128, price: 1.008   },
  'r6i.large':   { vcpu: 2,  ram: 16,  price: 0.126   },
  'r6i.xlarge':  { vcpu: 4,  ram: 32,  price: 0.252   },
};

/* ── RDS On-Demand — us-east-1 (MySQL/PostgreSQL) ───────────── */
export const RDS_INSTANCES: Record<string, { vcpu: number; ram: number; price: number }> = {
  'db.t3.micro':    { vcpu: 2, ram: 1,  price: 0.017  },
  'db.t3.small':    { vcpu: 2, ram: 2,  price: 0.034  },
  'db.t3.medium':   { vcpu: 2, ram: 4,  price: 0.068  },
  'db.t3.large':    { vcpu: 2, ram: 8,  price: 0.136  },
  'db.m5.large':    { vcpu: 2, ram: 8,  price: 0.192  },
  'db.m5.xlarge':   { vcpu: 4, ram: 16, price: 0.384  },
  'db.m5.2xlarge':  { vcpu: 8, ram: 32, price: 0.768  },
  'db.m6g.large':   { vcpu: 2, ram: 8,  price: 0.171  },
  'db.m6g.xlarge':  { vcpu: 4, ram: 16, price: 0.342  },
  'db.r5.large':    { vcpu: 2, ram: 16, price: 0.24   },
  'db.r5.xlarge':   { vcpu: 4, ram: 32, price: 0.48   },
  'db.r5.2xlarge':  { vcpu: 8, ram: 64, price: 0.96   },
  'db.r6g.large':   { vcpu: 2, ram: 16, price: 0.192  },
  'db.r6g.xlarge':  { vcpu: 4, ram: 32, price: 0.384  },
};

/* ── EBS ─────────────────────────────────────────────────────── */
export const EBS_TYPES: Record<string, { label: string; perGB: number }> = {
  gp2: { label: 'gp2 — General Purpose SSD',      perGB: 0.10  },
  gp3: { label: 'gp3 — General Purpose SSD v3',   perGB: 0.08  },
  io1: { label: 'io1 — Provisioned IOPS SSD',     perGB: 0.125 },
  st1: { label: 'st1 — Throughput Optimized HDD', perGB: 0.045 },
  sc1: { label: 'sc1 — Cold HDD',                 perGB: 0.025 },
};
const IO1_IOPS_MONTH = 0.065;

/* ── S3 ──────────────────────────────────────────────────────── */
export const S3_CLASSES: Record<string, { label: string; perGB: number }> = {
  standard: { label: 'Standard',          perGB: 0.023  },
  ia:       { label: 'Standard-IA',       perGB: 0.0125 },
  glacier:  { label: 'Glacier Flexible',  perGB: 0.004  },
};
const S3_GET_PER_1K = 0.0004;
const S3_PUT_PER_1K = 0.005;

/* ── Lambda ──────────────────────────────────────────────────── */
const LAMBDA_REQ_PER_M   = 0.20;
const LAMBDA_GBS_PRICE   = 0.0000166667;

/* ── DynamoDB ────────────────────────────────────────────────── */
const DDB_WRITE_PER_M    = 1.25;
const DDB_READ_PER_M     = 0.25;
const DDB_STORAGE_PER_GB = 0.25;

/* ── NAT Gateway ─────────────────────────────────────────────── */
const NAT_PER_HOUR = 0.045;
const NAT_PER_GB   = 0.045;

/* ── ECS Fargate ─────────────────────────────────────────────── */
const ECS_VCPU_HR   = 0.04048;
const ECS_MEM_HR    = 0.004445;

/* ── CloudWatch Logs ─────────────────────────────────────────── */
const CW_INGEST_PER_GB  = 0.50;
const CW_STORAGE_PER_GB = 0.03;

/* ── Hours constant ──────────────────────────────────────────── */
export const HOURS_MONTH = 730;

/* ── Calculation functions ───────────────────────────────────── */

export function calcEC2(cfg: EC2Config): number {
  const inst = EC2_INSTANCES[cfg.instanceType];
  if (!inst) return 0;
  return inst.price * cfg.hoursPerMonth * cfg.quantity;
}

export function calcRDS(cfg: RDSConfig): number {
  const inst = RDS_INSTANCES[cfg.instanceType];
  if (!inst) return 0;
  const az = cfg.multiAZ ? 2 : 1;
  const compute = inst.price * HOURS_MONTH * cfg.quantity * az;
  const storage = 0.115 * cfg.storageGB * cfg.quantity;
  return compute + storage;
}

export function calcLambda(cfg: LambdaConfig): number {
  const reqCost = Math.max(0, cfg.requestsMillions - 1) * LAMBDA_REQ_PER_M;
  const gbSec   = cfg.requestsMillions * 1_000_000 * (cfg.avgDurationMs / 1000) * (cfg.memorySizeMB / 1024);
  const computeCost = Math.max(0, gbSec - 400_000) * LAMBDA_GBS_PRICE;
  return reqCost + computeCost;
}

export function calcS3(cfg: S3Config): number {
  const cls = S3_CLASSES[cfg.storageClass];
  return cls.perGB * cfg.storageGB + cfg.getRequestsK * S3_GET_PER_1K + cfg.putRequestsK * S3_PUT_PER_1K;
}

export function calcEBS(cfg: EBSConfig): number {
  const vol = EBS_TYPES[cfg.volumeType];
  if (!vol) return 0;
  let cost = vol.perGB * cfg.sizeGB * cfg.quantity;
  if (cfg.volumeType === 'io1') cost += IO1_IOPS_MONTH * cfg.iops * cfg.quantity;
  return cost;
}

export function calcDynamoDB(cfg: DynamoDBConfig): number {
  return cfg.writeMillions * DDB_WRITE_PER_M + cfg.readMillions * DDB_READ_PER_M + cfg.storageGB * DDB_STORAGE_PER_GB;
}

export function calcNAT(cfg: NATConfig): number {
  return cfg.quantity * (NAT_PER_HOUR * HOURS_MONTH + cfg.dataGB * NAT_PER_GB);
}

export function calcECS(cfg: ECSConfig): number {
  return cfg.tasks * cfg.hoursPerMonth * (cfg.vcpu * ECS_VCPU_HR + cfg.memoryGB * ECS_MEM_HR);
}

export function calcCloudWatch(cfg: CloudWatchConfig): number {
  return cfg.ingestGB * CW_INGEST_PER_GB + cfg.storageGB * CW_STORAGE_PER_GB;
}

export function calcCost(config: ServiceConfig): number {
  switch (config.type) {
    case 'ec2':        return calcEC2(config.data);
    case 'rds':        return calcRDS(config.data);
    case 'lambda':     return calcLambda(config.data);
    case 's3':         return calcS3(config.data);
    case 'ebs':        return calcEBS(config.data);
    case 'dynamodb':   return calcDynamoDB(config.data);
    case 'nat':        return calcNAT(config.data);
    case 'ecs':        return calcECS(config.data);
    case 'cloudwatch': return calcCloudWatch(config.data);
    default:           return 0;
  }
}
