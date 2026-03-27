export type ChannelType = 'email' | 'slack' | 'teams';

export type HistoryEntry = {
  dbId?: string;
  policyId: string;
  title: string;
  account: string;
  channel: ChannelType;
  destination: string;
  threshold: string;
  thresholdType: string;
  period?: string;
  email?: string;
  aws_account_id?: string;
  createdAt?: string;
};

export type AlertPolicyApiItem = {
  id?: number | string;
  policy_id?: string;
  title: string;
  channel: string;
  threshold?: number | null;
  threshold_type?: string | null;
  period?: string;
  email?: string;
  aws_account_id?: number | string | null;
  created_at?: string | null;
  account?: {
    account_name?: string;
    account_id?: string;
  } | null;
  account_name?: string | null;
  aws_account_name?: string | null;
  aws_account_number?: string | null;
};

export type AlertPoliciesResponse = {
  data?: AlertPolicyApiItem[];
  policies?: AlertPolicyApiItem[];
};

export type AlertPolicyMutationResponse = {
  data?: AlertPolicyApiItem;
  policy?: AlertPolicyApiItem;
};

export type SavePayload = {
  dbId?: string;
  policyId: string;
  title: string;
  account: string;
  channel: string;
  destination: string;
  threshold: string;
  thresholdType: string;
  period?: string;
  email?: string;
  aws_account_id?: string;
};
