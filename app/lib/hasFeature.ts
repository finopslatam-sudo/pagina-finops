export function hasFeature(
  planCode: string | null | undefined,
  feature: "gobernanza" | "optimization" | "alertas" | "informes" | "calculadora"
): boolean {

  if (!planCode) return false;

  // Informes disponible para todos los planes
  if (feature === "informes") return true;

  // Alertas & Políticas: solo Enterprise
  if (feature === "alertas") {
    return planCode === "FINOPS_ENTERPRISE";
  }

  // Calculadora de Proyectos: solo Enterprise
  if (feature === "calculadora") {
    return planCode === "FINOPS_ENTERPRISE";
  }

  // Gobernanza y Optimización: Professional + Enterprise
  if (planCode === "FINOPS_ENTERPRISE") return true;
  if (planCode === "FINOPS_PROFESSIONAL") return true;

  return false;

}
