export type ExportFormat = 'pdf' | 'csv' | 'xlsx';

export interface ReportDef {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  includes: string[];
  formats: ExportFormat[];
  endpoint: string | null;
  color: string;
  headerColor: string;
  available: boolean;
  allowedPlans: ('foundation' | 'professional' | 'enterprise')[];
}

export const REPORTS: ReportDef[] = [
  {
    id: 'findings', icon: '🔎', title: 'Findings & Rightsizing', subtitle: 'Reporte técnico-ejecutivo',
    description: 'Informe completo de todos los hallazgos detectados en tu entorno cloud: ineficiencias, riesgos, recursos sobre-aprovisionados y oportunidades de ahorro con su resolución recomendada.',
    includes: [
      'Resumen ejecutivo con KPIs de ahorro',
      'Listado de hallazgos activos y resueltos',
      'Clasificación por severidad (HIGH / MEDIUM / LOW)',
      'Recomendaciones de resolución por tipo de finding',
      'Ahorro estimado mensual acumulado',
      'Distribución por servicio y cuenta AWS',
    ],
    formats: ['pdf', 'csv', 'xlsx'], endpoint: '/api/client/reports',
    color: 'bg-blue-50 border-blue-200', headerColor: 'bg-blue-600',
    available: true, allowedPlans: ['foundation', 'professional', 'enterprise'],
  },
  {
    id: 'executive', icon: '📊', title: 'Resumen Ejecutivo', subtitle: 'Para dirección y stakeholders',
    description: 'Informe de alto nivel orientado a la dirección: visión consolidada del gasto cloud, cumplimiento, riesgo y ROI de las iniciativas FinOps. Diseñado para presentaciones ejecutivas.',
    includes: [
      'Dashboard de gasto mensual vs año anterior',
      'Score de cumplimiento y nivel de riesgo',
      'Top 5 oportunidades de ahorro identificadas',
      'Tendencia histórica de costos (últimos 6 meses)',
      'Distribución de costos por servicio',
      'Estado de hallazgos: activos, resueltos, alta severidad',
    ],
    formats: ['pdf'], endpoint: '/api/client/reports/executive',
    color: 'bg-indigo-50 border-indigo-200', headerColor: 'bg-indigo-600',
    available: true, allowedPlans: ['professional', 'enterprise'],
  },
  {
    id: 'costs', icon: '💰', title: 'Reporte de Costos', subtitle: 'Análisis financiero detallado',
    description: 'Análisis financiero completo del gasto cloud por servicio, cuenta y región. Incluye comparativas mensuales y anuales, distribución de gastos y tendencia histórica.',
    includes: [
      'Gasto mensual y anual por cuenta AWS',
      'Distribución de costos por servicio',
      'Comparativa mes actual vs mes anterior',
      'Gasto año actual vs año anterior',
      'Tendencia de costos últimos 6 meses',
      'Top servicios por mayor costo',
    ],
    formats: ['pdf', 'xlsx'], endpoint: '/api/client/reports/costs',
    color: 'bg-emerald-50 border-emerald-200', headerColor: 'bg-emerald-600',
    available: true, allowedPlans: ['professional', 'enterprise'],
  },
  {
    id: 'risk', icon: '🛡️', title: 'Reporte de Riesgo & Compliance', subtitle: 'Gobernanza y cumplimiento',
    description: 'Evaluación completa del posicionamiento de riesgo de tu entorno cloud: score de compliance, hallazgos críticos, riesgo por servicio y recomendaciones de remediación.',
    includes: [
      'Score de compliance y nivel de riesgo global',
      'Distribución de riesgo: CRITICAL / HIGH / MEDIUM / LOW',
      'Hallazgos de alta severidad con ahorro potencial',
      'Riesgo desglosado por servicio AWS',
      'Total findings activos, resueltos y pendientes',
      'Recomendaciones prioritarias de remediación',
    ],
    formats: ['pdf', 'xlsx'], endpoint: '/api/client/reports/risk',
    color: 'bg-rose-50 border-rose-200', headerColor: 'bg-rose-600',
    available: true, allowedPlans: ['professional', 'enterprise'],
  },
  {
    id: 'assets', icon: '📦', title: 'Inventario de Recursos', subtitle: 'Inventario completo cloud',
    description: 'Inventario detallado de todos los recursos activos en tus cuentas AWS: instancias, bases de datos, almacenamiento, funciones serverless y más, con estado y costo asociado.',
    includes: [
      'Listado completo de recursos activos por cuenta',
      'Clasificación por tipo y servicio AWS',
      'Estado de cada recurso (running, stopped, idle)',
      'Costo estimado por recurso',
      'Recursos sin hallazgos vs con hallazgos',
      'Inventario por región geográfica',
    ],
    formats: ['csv', 'xlsx'], endpoint: '/api/client/reports/inventory',
    color: 'bg-amber-50 border-amber-200', headerColor: 'bg-amber-600',
    available: true, allowedPlans: ['professional', 'enterprise'],
  },
];

export const FORMAT_CONFIG: Record<ExportFormat, { label: string; color: string; icon: string }> = {
  pdf:  { label: 'PDF',  color: 'bg-blue-600 hover:bg-blue-700 text-white',       icon: '📄' },
  csv:  { label: 'CSV',  color: 'bg-emerald-600 hover:bg-emerald-700 text-white', icon: '📊' },
  xlsx: { label: 'XLSX', color: 'bg-indigo-600 hover:bg-indigo-700 text-white',   icon: '📋' },
};
