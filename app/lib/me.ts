import { apiFetch } from "./api";

/**
 * Single source for client plan info.
 * Backend expone /api/client/plan (no /api/me/plan).
 */
export async function getClientPlan() {
  return apiFetch("/api/client/plan");
}

/**
 * Placeholder de features derivadas del plan.
 * Hoy el backend no expone /api/me/features; si se necesita,
 * se pueden calcular en frontend a partir de getClientPlan().
 */
export async function getClientFeatures() {
  const plan = await getClientPlan();
  // Ajustar cuando el backend devuelva features explícitas
  return plan;
}

// Aliases legacy para mantener compatibilidad si alguien importa los nombres antiguos.
export const getMyPlan = getClientPlan;
export const getMyFeatures = getClientFeatures;
