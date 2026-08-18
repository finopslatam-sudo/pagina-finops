import type { AzureServiceType, AzureServiceConfig } from './azure-types';
import { AZURE_SERVICE_LABELS } from './azure-types';
import type { GCPServiceType, GCPServiceConfig } from './gcp-types';
import { GCP_SERVICE_LABELS } from './gcp-types';

export type Provider = 'aws' | 'azure' | 'gcp';

export const PROVIDER_LABELS: Record<Provider, { label: string; icon: string }> = {
  aws:   { label: 'AWS',   icon: '🟠' },
  azure: { label: 'Azure', icon: '🔷' },
  gcp:   { label: 'GCP',   icon: '🔴' },
};

export type AWSServiceType =
  | 'ec2' | 'rds' | 'lambda' | 's3' | 'ebs'
  | 'dynamodb' | 'nat' | 'ecs' | 'cloudwatch';

export type ServiceType = AWSServiceType | AzureServiceType | GCPServiceType;

export const AWS_SERVICE_LABELS: Record<AWSServiceType, {
  label: string; icon: string; color: string; btnColor: string;
}> = {
  ec2:        { label: 'EC2 Instances',   icon: '💻', color: 'bg-orange-50 border-orange-200', btnColor: 'bg-orange-500 hover:bg-orange-600' },
  rds:        { label: 'RDS / Database',  icon: '🗄️', color: 'bg-blue-50 border-blue-200',    btnColor: 'bg-blue-500 hover:bg-blue-600'    },
  lambda:     { label: 'Lambda',          icon: '⚡', color: 'bg-amber-50 border-amber-200',   btnColor: 'bg-amber-500 hover:bg-amber-600'  },
  s3:         { label: 'S3 Storage',      icon: '🪣', color: 'bg-green-50 border-green-200',   btnColor: 'bg-green-600 hover:bg-green-700'  },
  ebs:        { label: 'EBS Volumes',     icon: '💾', color: 'bg-slate-50 border-slate-200',   btnColor: 'bg-slate-600 hover:bg-slate-700'  },
  dynamodb:   { label: 'DynamoDB',        icon: '📊', color: 'bg-indigo-50 border-indigo-200', btnColor: 'bg-indigo-500 hover:bg-indigo-600'},
  nat:        { label: 'NAT Gateway',     icon: '🌐', color: 'bg-teal-50 border-teal-200',     btnColor: 'bg-teal-600 hover:bg-teal-700'    },
  ecs:        { label: 'ECS Fargate',     icon: '🐳', color: 'bg-cyan-50 border-cyan-200',     btnColor: 'bg-cyan-600 hover:bg-cyan-700'    },
  cloudwatch: { label: 'CloudWatch Logs', icon: '📋', color: 'bg-purple-50 border-purple-200', btnColor: 'bg-purple-600 hover:bg-purple-700'},
};

export const SERVICE_LABELS: Record<ServiceType, {
  label: string; icon: string; color: string; btnColor: string;
}> = {
  ...AWS_SERVICE_LABELS,
  ...AZURE_SERVICE_LABELS,
  ...GCP_SERVICE_LABELS,
};

export const SERVICES_BY_PROVIDER: Record<Provider, ServiceType[]> = {
  aws: Object.keys(AWS_SERVICE_LABELS) as ServiceType[],
  azure: Object.keys(AZURE_SERVICE_LABELS) as ServiceType[],
  gcp: Object.keys(GCP_SERVICE_LABELS) as ServiceType[],
};

export interface EC2Config {
  instanceType: string;
  quantity: number;
  hoursPerMonth: number;
}

export interface RDSConfig {
  instanceType: string;
  quantity: number;
  multiAZ: boolean;
  storageGB: number;
}

export interface LambdaConfig {
  requestsMillions: number;
  avgDurationMs: number;
  memorySizeMB: number;
}

export interface S3Config {
  storageGB: number;
  storageClass: 'standard' | 'ia' | 'glacier';
  getRequestsK: number;
  putRequestsK: number;
}

export interface EBSConfig {
  volumeType: 'gp2' | 'gp3' | 'io1' | 'st1' | 'sc1';
  sizeGB: number;
  quantity: number;
  iops: number;
}

export interface DynamoDBConfig {
  writeMillions: number;
  readMillions: number;
  storageGB: number;
}

export interface NATConfig {
  quantity: number;
  dataGB: number;
}

export interface ECSConfig {
  tasks: number;
  vcpu: number;
  memoryGB: number;
  hoursPerMonth: number;
}

export interface CloudWatchConfig {
  ingestGB: number;
  storageGB: number;
}

export type AWSServiceConfig =
  | { type: 'ec2';        data: EC2Config        }
  | { type: 'rds';        data: RDSConfig        }
  | { type: 'lambda';     data: LambdaConfig     }
  | { type: 's3';         data: S3Config         }
  | { type: 'ebs';        data: EBSConfig        }
  | { type: 'dynamodb';   data: DynamoDBConfig   }
  | { type: 'nat';        data: NATConfig        }
  | { type: 'ecs';        data: ECSConfig        }
  | { type: 'cloudwatch'; data: CloudWatchConfig };

export type ServiceConfig = AWSServiceConfig | AzureServiceConfig | GCPServiceConfig;

export function providerOf(type: ServiceType): Provider {
  if (type.startsWith('azure_')) return 'azure';
  if (type.startsWith('gcp_')) return 'gcp';
  return 'aws';
}

export interface ProjectItem {
  id: string;
  name: string;
  provider: Provider;
  config: ServiceConfig;
  monthlyCost: number;
}
