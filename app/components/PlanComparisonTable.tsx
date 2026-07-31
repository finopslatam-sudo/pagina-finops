const Check = () => (
  <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const Dash = () => <span className="block text-center text-gray-300 font-bold">—</span>;

const FEATURES: { name: string; us: boolean; a: boolean; b: boolean }[] = [
  { name: 'Integración con AWS',                 us: true, a: true,  b: true  },
  { name: 'Dashboard de costos y cuentas',        us: true, a: true,  b: true  },
  { name: 'Hallazgos y optimización',             us: true, a: true,  b: false },
  { name: 'Inventario de recursos y riesgo',      us: true, a: false, b: true  },
  { name: 'Reportes ejecutivos automatizados',    us: true, a: false, b: false },
  { name: 'Reportes PDF, CSV y XLSX',             us: true, a: true,  b: false },
  { name: 'Análisis de RI & Savings Plans',       us: true, a: true,  b: false },
  { name: 'Gobernanza multi-cuenta',              us: true, a: false, b: false },
  { name: 'Políticas y alertas automáticas',      us: true, a: false, b: true  },
  { name: 'Project Calculator (proyección)',      us: true, a: false, b: false },
  { name: 'Asistente FinOps con IA',              us: true, a: false, b: false },
  { name: 'Soporte prioritario en español',       us: true, a: false, b: false },
];

export default function PlanComparisonTable() {
  return (
    <div>
      <h4 className="text-xl lg:text-2xl font-bold text-center text-gray-900 mb-8">
        FinOps Latam vs. otras herramientas
      </h4>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full min-w-[560px] text-sm">
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
            {FEATURES.map((row, i) => (
              <tr key={row.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 sm:px-6 py-3 text-gray-700 font-medium">{row.name}</td>
                <td className="px-4 py-3 text-center bg-purple-50">{row.us ? <Check /> : <Dash />}</td>
                <td className="px-4 py-3 text-center">{row.a ? <Check /> : <Dash />}</td>
                <td className="px-4 py-3 text-center">{row.b ? <Check /> : <Dash />}</td>
              </tr>
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
