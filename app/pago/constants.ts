export type PlanSlug = 'foundation' | 'professional' | 'enterprise' | 'consultoria';

export interface PlanInfo {
  name: string;
  priceOriginal: string;  // precio sin descuento (tachado)
  priceDiscount: string;  // precio con 20% de descuento
  period: string;
  description: string;
  badge?: string;
  accentColor: string;
  borderColor: string;
  badgeBg: string;
  features: string[];
}

export const PLANS: Record<PlanSlug, PlanInfo> = {
  foundation: {
    name: 'FinOps Foundation',
    priceOriginal: '$1.140',
    priceDiscount: '$950',
    period: 'USD/mes',
    description: 'Visibilidad y control financiero cloud.',
    accentColor: 'text-slate-700',
    borderColor: 'border-slate-300',
    badgeBg: 'bg-slate-700',
    features: [
      'Integración con AWS (1 cuenta)',
      'Dashboard de costos, cuentas y servicios',
      'Hallazgos y recomendaciones de ahorro',
      'Inventario de recursos y análisis de riesgo',
      'Exportación de reportes (PDF, CSV, XLSX)',
      'Hasta 3 usuarios',
      'Soporte estándar',
    ],
  },
  professional: {
    name: 'FinOps Professional',
    priceOriginal: '$2.100',
    priceDiscount: '$1.750',
    period: 'USD/mes',
    description: 'Optimización activa y decisiones basadas en datos.',
    badge: 'Más elegido',
    accentColor: 'text-blue-600',
    borderColor: 'border-blue-600',
    badgeBg: 'bg-blue-600',
    features: [
      'Todo Foundation',
      'Hasta 5 cuentas AWS',
      'Hasta 9 usuarios',
      'Optimización avanzada (Findings & Rightsizing)',
      'Análisis de Savings Plans y Reserved Instances',
      'Forecast y control presupuestario',
      'Soporte prioritario',
    ],
  },
  enterprise: {
    name: 'FinOps Enterprise',
    priceOriginal: '$3.060',
    priceDiscount: '$2.550',
    period: 'USD/mes',
    description: 'Gobierno completo y automatización avanzada.',
    accentColor: 'text-purple-700',
    borderColor: 'border-purple-300',
    badgeBg: 'bg-purple-700',
    features: [
      'Todo Professional',
      'Hasta 10 cuentas AWS',
      'Hasta 12 usuarios',
      'Policies y alertas automáticas',
      'Gobernanza avanzada multi-account',
      'Asistente FinOps integrado',
      'Acompañamiento estratégico continuo',
    ],
  },
  consultoria: {
    name: 'Consultoría FinOps Estratégica',
    priceOriginal: '$3.060',
    priceDiscount: '$2.550',
    period: 'USD',
    description: 'Diagnóstico, implementación y acompañamiento especializado.',
    accentColor: 'text-emerald-700',
    borderColor: 'border-emerald-300',
    badgeBg: 'bg-emerald-700',
    features: [
      'Assessment FinOps completo',
      'Identificación de desperdicio y quick wins',
      'Diseño de estrategia de ahorro',
      'Baseline de costos y definición de KPIs FinOps',
      'Implementación de políticas FinOps',
      'Presentación ejecutiva a dirección',
    ],
  },
};

export const PLAN_SLUGS: Record<string, PlanSlug> = {
  'FinOps Foundation': 'foundation',
  'FinOps Professional': 'professional',
  'FinOps Enterprise': 'enterprise',
  'Consultoría FinOps Estratégica': 'consultoria',
};
