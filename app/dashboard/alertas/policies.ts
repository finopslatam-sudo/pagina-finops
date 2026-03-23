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
  {
    id: 'off-hours',
    category: 'Uso No Hábil',
    icon: '🌙',
    title: 'Consumo en Horario No Hábil',
    description: 'Detecta y alerta cuando recursos cloud están activos fuera del horario laboral definido, identificando costos evitables.',
    examples: ['Alertar por instancias EC2 activas entre 22:00 y 06:00', 'Detectar bases de datos RDS corriendo fines de semana', 'Notificar clusters EKS sin carga en horario nocturno'],
    status: 'draft',
    color: 'bg-violet-50',
    borderColor: 'border-violet-200',
    badgeColor: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'service-cost',
    category: 'Servicios',
    icon: '⚙️',
    title: 'Alerta por Servicio AWS',
    description: 'Define umbrales de costo específicos por servicio. Recibe alertas si EC2, RDS, S3 u otro servicio supera el límite configurado.',
    examples: ['Alerta si EC2 supera USD $200 en el mes', 'Notificar si S3 supera USD $50 de almacenamiento', 'Alerta si CloudWatch excede USD $30 en logs'],
    status: 'draft',
    color: 'bg-amber-50',
    borderColor: 'border-amber-200',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'tagging-policy',
    category: 'Gobernanza',
    icon: '🏷️',
    title: 'Política de Etiquetado (Tagging)',
    description: 'Garantiza que todos los recursos cloud estén etiquetados correctamente según los estándares organizacionales para control de costos.',
    examples: ['Alertar por recursos sin tag "Environment"', 'Detectar recursos sin tag "CostCenter"', 'Notificar recursos sin propietario definido'],
    status: 'draft',
    color: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'idle-resources',
    category: 'Optimización',
    icon: '💤',
    title: 'Recursos Inactivos o Subutilizados',
    description: 'Alerta periódica sobre recursos con utilización por debajo del umbral definido que representan gasto sin valor.',
    examples: ['Alertar instancias EC2 con CPU < 5% por 7 días', 'Detectar volumes EBS sin snapshots en 30+ días', 'Notificar Elastic IPs no asociadas a instancias activas'],
    status: 'draft',
    color: 'bg-slate-50',
    borderColor: 'border-slate-200',
    badgeColor: 'bg-slate-100 text-slate-700',
  },
  {
    id: 'lifecycle',
    category: 'Ciclo de Vida',
    icon: '♻️',
    title: 'Política de Ciclo de Vida de Recursos',
    description: 'Define reglas automáticas para el ciclo de vida de recursos: apagado programado, eliminación de snapshots antiguos, archivado de datos.',
    examples: ['Eliminar snapshots de más de 90 días automáticamente', 'Apagar instancias de desarrollo a las 20:00', 'Archivar objetos S3 sin acceso en 60+ días'],
    status: 'draft',
    color: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    badgeColor: 'bg-cyan-100 text-cyan-700',
  },
  {
    id: 'forecast',
    category: 'Proyección',
    icon: '🔮',
    title: 'Alerta de Proyección de Gasto',
    description: 'Análisis predictivo que alerta si la proyección de gasto al cierre del mes o año supera el presupuesto aprobado.',
    examples: ['Alertar si proyección mensual supera el 110% del presupuesto', 'Notificar variación mayor a 20% respecto al mes anterior', 'Alerta de tendencia alcista sostenida por 3+ semanas'],
    status: 'draft',
    color: 'bg-fuchsia-50',
    borderColor: 'border-fuchsia-200',
    badgeColor: 'bg-fuchsia-100 text-fuchsia-700',
  },
];

export const STATUS_CONFIG: Record<PolicyStatus, { label: string; color: string }> = {
  active:   { label: 'Activa',    color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  inactive: { label: 'Inactiva',  color: 'bg-slate-100 text-slate-500 border-slate-200' },
  draft:    { label: 'Disponible', color: 'bg-amber-100 text-amber-700 border-amber-200' },
};

export const CATEGORIES = ['Todas', ...Array.from(new Set(POLICIES.map(p => p.category)))];
