import type { ChannelType } from './types';

export const CHANNEL_LABELS: Record<ChannelType, string> = {
  email: 'Correo',
  slack: 'Slack',
  teams: 'Teams',
};

export const PERIOD_LABELS: Record<string, string> = {
  daily: 'Diaria',
  weekly: 'Semanal',
  monthly: 'Mensual',
  annual: 'Anual',
};
