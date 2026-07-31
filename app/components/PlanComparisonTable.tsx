import { Fragment } from 'react';

const Check = () => (
  <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const Dash = () => <span className="block text-center text-gray-300 font-bold">—</span>;

type FeatureRow = { name: string; us: boolean; a: boolean; b: boolean };
type FeatureGroup = { category: string; items: FeatureRow[] };

const FEATURE_GROUPS: FeatureGroup[] = [
  {
    category: 'Conexión AWS',
    items: [
      { name: 'Conexión segura vía rol IAM (sin credenciales expuestas)', us: true, a: true,  b: true  },
      { name: 'Hasta 10 cuentas AWS conectadas por cliente',              us: true, a: true,  b: false },
    ],
  },
  {
    category: 'Costos',
    items: [
      { name: 'Dashboard de costos con KPIs en tiempo real',              us: true, a: true,  b: true  },
      { name: 'Cobertura de Reserved Instances y Savings Plans',          us: true, a: true,  b: false },
      { name: 'Calculadora de costos AWS por servicio (EC2, RDS, S3...)', us: true, a: false, b: false },
    ],
  },
  {
    category: 'Optimización',
    items: [
      { name: 'Recomendaciones de rightsizing',                          us: true, a: true,  b: false },
      { name: 'Widgets de optimización accionables en el dashboard',     us: true, a: false, b: false },
    ],
  },
  {
    category: 'Riesgo y Seguridad',
    items: [
      { name: 'Findings de seguridad y compliance con severidad',        us: true, a: true,  b: false },
      { name: 'Snapshots históricos de riesgo (tendencia y delta)',      us: true, a: false, b: false },
      { name: 'Configuración de seguridad por cliente',                 us: true, a: false, b: true  },
    ],
  },
  {
    category: 'Inventario de Activos',
    items: [
      { name: 'Inventario de recursos AWS con estado de salud',          us: true, a: false, b: true  },
    ],
  },
  {
    category: 'Alertas',
    items: [
      { name: 'Políticas de alertas configurables',                      us: true, a: false, b: true  },
      { name: 'Motor de ejecución y canales de notificación',            us: true, a: false, b: false },
    ],
  },
  {
    category: 'Gobernanza',
    items: [
      { name: 'Compliance gauge y breakdown de riesgo',                  us: true, a: false, b: false },
      { name: 'Resumen ejecutivo con proyección de ROI de remediación',  us: true, a: false, b: false },
    ],
  },
  {
    category: 'Reportes',
    items: [
      { name: 'Reportes ejecutivos (PDF)',                               us: true, a: false, b: false },
      { name: 'Reportes de costos, riesgo e inventario (PDF/CSV/XLSX)', us: true, a: true,  b: false },
    ],
  },
  {
    category: 'Soporte y Asistente',
    items: [
      { name: 'Mesa de tickets de soporte en español',                   us: true, a: false, b: false },
      { name: 'Asistente FinOps.ia (consultas automáticas sobre tus datos)', us: true, a: false, b: false },
    ],
  },
];

export default function PlanComparisonTable() {
  return (
    <div>
      <h4 className="text-xl lg:text-2xl font-bold text-center text-gray-900 mb-2">
        FinOps Latam vs. otras herramientas
      </h4>
      <p className="text-center text-gray-500 text-sm mb-8 max-w-2xl mx-auto">
        Comparativa funcionalidad por funcionalidad, todo incluido en tu plan Enterprise.
      </p>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr>
              <th className="text-left px-4 sm:px-6 py-4 font-semibold w-1/2 bg-gray-900 text-white rounded-tl-2xl">
                Funcionalidad
              </th>
              <th className="px-4 py-4 font-semibold text-center bg-purple-800 text-white">
                FinOps Latam
              </th>
              <th className="px-4 py-4 font-semibold text-center bg-slate-500 text-white">
                Herramienta A
              </th>
              <th className="px-4 py-4 font-semibold text-center bg-slate-500 text-white rounded-tr-2xl">
                Herramienta B
              </th>
            </tr>
          </thead>
          <tbody>
            {FEATURE_GROUPS.map((group) => (
              <Fragment key={group.category}>
                <tr className="bg-gray-100">
                  <td colSpan={4} className="px-4 sm:px-6 py-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                    {group.category}
                  </td>
                </tr>
                {group.items.map((row) => (
                  <tr key={row.name} className="bg-white odd:bg-gray-50">
                    <td className="px-4 sm:px-6 py-3 text-gray-700 font-medium">{row.name}</td>
                    <td className="px-4 py-3 text-center bg-purple-50">{row.us ? <Check /> : <Dash />}</td>
                    <td className="px-4 py-3 text-center">{row.a ? <Check /> : <Dash />}</td>
                    <td className="px-4 py-3 text-center">{row.b ? <Check /> : <Dash />}</td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-center text-gray-400 text-xs mt-4">
        ¿Tienes dudas?{' '}
        <a href="https://wa.me/56965090121" target="_blank" className="text-blue-500 hover:underline">
          Contáctanos por WhatsApp
        </a>{' '}
        y te contamos todo lo que incluye FinOps Enterprise.
      </p>
    </div>
  );
}
