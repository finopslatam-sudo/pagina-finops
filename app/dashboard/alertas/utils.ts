import { POLICIES } from './policies';
import type { AlertPolicyApiItem, ChannelType, HistoryEntry } from './types';
import type { PolicyCard } from './policies';

export function getDestination(channel: string, email?: string | null): string {
  if (channel === 'email') return email || 'Sin correo configurado';
  if (channel === 'slack') return 'Grupo o canal de Slack';
  return 'Grupo o canal de Teams';
}

export function toHistoryEntry(item: AlertPolicyApiItem): HistoryEntry {
  const channel = (item.channel === 'slack' || item.channel === 'teams'
    ? item.channel
    : 'email') as ChannelType;

  return {
    dbId: item.id != null ? String(item.id) : undefined,
    policyId: item.policy_id || String(item.id || ''),
    title: item.title,
    account:
      item.account?.account_name ||
      item.account_name ||
      item.aws_account_name ||
      item.account?.account_id ||
      item.aws_account_number ||
      'Todas las cuentas',
    channel,
    destination: getDestination(channel, item.email),
    threshold: item.threshold != null ? String(item.threshold) : '-',
    thresholdType: item.threshold_type || '',
    period: item.period,
    email: item.email,
    aws_account_id: item.aws_account_id ? String(item.aws_account_id) : undefined,
    createdAt: item.created_at || undefined,
  };
}

export function getPolicyDefinition(policyId: string, title: string): PolicyCard {
  const existing = POLICIES.find(p => p.id === policyId);
  if (existing) return existing;

  return {
    id: policyId,
    category: 'Configurada',
    icon: '🔔',
    title,
    description: 'Edita la configuración de esta política creada anteriormente.',
    examples: [],
    status: 'active',
    color: 'bg-slate-50',
    borderColor: 'border-slate-200',
    badgeColor: 'bg-slate-100 text-slate-700',
  };
}
