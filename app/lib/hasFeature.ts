export function hasFeature(
  planCode: string | null | undefined,
  feature: "gobernanza" | "optimization"
): boolean {

  if (!planCode) return false;

  if (planCode === "FINOPS_ENTERPRISE") return true;

  if (planCode === "FINOPS_PROFESSIONAL") return true;

  if (planCode === "FINOPS_FOUNDATION") {

    if (feature === "gobernanza") return false;

    if (feature === "optimization") return false;

  }

  return false;

}