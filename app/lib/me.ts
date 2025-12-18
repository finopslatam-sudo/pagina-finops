import { apiFetch } from "./api";

export async function getMyPlan(token: string) {
  return apiFetch("/api/me/plan", token);
}

export async function getMyFeatures(token: string) {
  return apiFetch("/api/me/features", token);
}
