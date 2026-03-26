const Check = () => (
  <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const Dash = () => <span className="block text-center text-gray-300 font-bold">—</span>;

const FEATURES: { name: string; f: boolean; p: boolean; e: boolean }[] = [
  { name: 'AWS Integration',           f: true,  p: true,  e: true  },
  { name: 'Ticket Support',            f: true,  p: true,  e: true  },
  { name: 'Cost and account dashboard',f: true,  p: true,  e: true  },
  { name: 'Findings & Optimization',   f: true,  p: true,  e: true  },
  { name: 'Risk & Assets',             f: true,  p: true,  e: true  },
  { name: 'Cost & Financials',         f: true,  p: true,  e: true  },
  { name: 'Report (PDF, CSV, XLSX)',   f: true,  p: true,  e: true  },
  { name: 'Finding Report',            f: true,  p: true,  e: true  },
  { name: 'Executive Report',          f: false, p: true,  e: true  },
  { name: 'Cost Report',               f: false, p: true,  e: true  },
  { name: 'Risk Report',               f: false, p: true,  e: true  },
  { name: 'Resource Report',           f: false, p: true,  e: true  },
  { name: 'RI & Saving Plans',         f: false, p: true,  e: true  },
  { name: 'Governance',                f: false, p: true,  e: true  },
  { name: 'Policies y Alerts',         f: false, p: false, e: true  },
  { name: 'Project Calculator',        f: false, p: false, e: true  },
  { name: 'Assistant Bot',             f: false, p: false, e: true  },
];

export default function PlanComparisonTable() {
  return (
    <div>
      <h4 className="text-xl lg:text-2xl font-bold text-center text-gray-900 mb-8">
        Comparativa de planes
      </h4>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr>
              <th className="text-left px-6 py-4 font-semibold w-1/2 bg-gray-900 text-white rounded-tl-2xl">
                Funcionalidad
              </th>
              <th className="px-4 py-4 font-semibold text-center bg-slate-500 text-white">
                Foundation
              </th>
              <th className="px-4 py-4 font-semibold text-center bg-blue-700 text-white">
                Professional
              </th>
              <th className="px-4 py-4 font-semibold text-center bg-purple-800 text-white rounded-tr-2xl">
                Enterprise
              </th>
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((row, i) => (
              <tr key={row.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-3 text-gray-700 font-medium">{row.name}</td>
                <td className="px-4 py-3 text-center">{row.f ? <Check /> : <Dash />}</td>
                <td className="px-4 py-3 text-center bg-blue-50">{row.p ? <Check /> : <Dash />}</td>
                <td className="px-4 py-3 text-center bg-purple-50">{row.e ? <Check /> : <Dash />}</td>
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
        y te ayudamos a elegir el plan ideal.
      </p>
    </div>
  );
}
