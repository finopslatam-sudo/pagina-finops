export type PolicyStatus = 'active' | 'inactive' | 'draft';

export interface PolicyCard {
  id: string;
  category: string;
  icon: string;
  title: string;
  description: string;
  examples: string[];
  status: PolicyStatus;
  color: string;
  borderColor: string;
  badgeColor: string;
}

export const POLICIES: PolicyCard[] = [
  {
    id: 'budget-monthly',
    category: 'Presupuesto',
    icon: '💰',
    title: 'Alerta de Presupuesto Mensual',
    description: 'Recibe una notificación cuando el gasto mensual supere un umbral definido en USD o porcentaje del presupuesto asignado.',
    examples: ['Alertar al 80% del presupuesto mensual', 'Alertar si gasto supera USD $500/mes', 'Notificar al alcanzar el 100% del límite'],
    status: 'draft',
    color: 'bg-blue-50',
    borderColor: 'border-blue-200',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'budget-annual',
    category: 'Presupuesto',
    icon: '📅',
    title: 'Alerta de Presupuesto Anual',
    description: 'Monitoreo continuo del gasto acumulado anual versus el presupuesto aprobado para el año fiscal.',
    examples: ['Alertar al superar el 50% del presupuesto anual en el primer semestre', 'Proyección de sobre-gasto a fin de año', 'Alerta si el ritmo de gasto supera la proyección'],
    status: 'draft',
    color: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    badgeColor: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'anomaly-spike',
    category: 'Anomalías',
    icon: '📈',
    title: 'Detección de Pico de Gasto',
    description: 'Alerta automática cuando el gasto diario o semanal aumenta de forma anormal respecto al promedio histórico.',
    examples: ['Alerta si el gasto diario sube más de 30% vs promedio', 'Notificar picos por encima de 2x el gasto típico', 'Detección de cargos inusuales en servicios específicos'],
    status: 'draft',
    color: 'bg-rose-50',
    borderColor: 'border-rose-200',
    badgeColor: 'bg-rose-100 text-rose-700',
  },
];

export const STATUS_CONFIG: Record<PolicyStatus, { label: string; color: string }> = {
  active:   { label: 'Activa',    color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  inactive: { label: 'Inactiva',  color: 'bg-slate-100 text-slate-500 border-slate-200' },
  draft:    { label: 'Disponible', color: 'bg-amber-100 text-amber-700 border-amber-200' },
};

export const CATEGORIES = ['Todas', ...Array.from(new Set(POLICIES.map(p => p.category)))];
