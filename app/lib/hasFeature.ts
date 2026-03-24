export function hasFeature(
  planCode: string | null | undefined,
  feature: "gobernanza" | "optimization" | "alertas" | "informes"
): boolean {

  if (!planCode) return false;

  // Informes disponible para todos los planes
  if (feature === "informes") return true;

  // Alertas & Políticas alineado con backend actual
  if (feature === "alertas") {
    return [
      "FINOPS_FOUNDATION",
      "FINOPS_PROFESSIONAL",
      "FINOPS_ENTERPRISE",
    ].includes(planCode);
  }

  // Gobernanza y Optimización: Professional + Enterprise
  if (planCode === "FINOPS_ENTERPRISE") return true;
  if (planCode === "FINOPS_PROFESSIONAL") return true;

  return false;

}
