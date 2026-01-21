import { apiFetch } from './api';

export async function getMyPlan() {
  return apiFetch('/api/me/plan');
}

export async function getMyFeatures() {
  return apiFetch('/api/me/features');
}