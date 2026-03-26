'use client';

const Check = () => (
  <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);
const Dash = () => <span className="block text-center text-gray-300 font-bold">—</span>;

const FEATURES: { name: string; f: boolean; p: boolean; e: boolean }[] = [
  { name: 'Dashboard ejecutivo de costos',         f: true,  p: true,  e: true  },
  { name: 'Inventario de recursos AWS',             f: true,  p: true,  e: true  },
  { name: 'Hallazgos y recomendaciones',            f: true,  p: true,  e: true  },
  { name: 'Risk & Governance Score',                f: true,  p: true,  e: true  },
  { name: 'Reportes ejecutivos PDF / CSV / XLSX',   f: true,  p: true,  e: true  },
  { name: 'Bot asistente FinOps',                   f: true,  p: true,  e: true  },
  { name: 'Rightsizing EC2, RDS y Lambda',          f: false, p: true,  e: true  },
  { name: 'Savings Plans y Reserved Instances',     f: false, p: true,  e: true  },
  { name: 'Proyección financiera (ROI & Savings)',  f: false, p: true,  e: true  },
  { name: 'Forecast y seguimiento presupuestario',  f: false, p: true,  e: true  },
  { name: 'Reunión estratégica quincenal',          f: false, p: true,  e: true  },
  { name: 'Multi-account visibility',               f: false, p: false, e: true  },
  { name: 'Roadmap estratégico FinOps',             f: false, p: false, e: true  },
  { name: 'Modelo operativo FinOps',                f: false, p: false, e: true  },
  { name: 'Sesión ejecutiva mensual C-Level',       f: false, p: false, e: true  },
  { name: 'Acompañamiento en compromisos cloud',    f: false, p: false, e: true  },
];

export default function ServicesSection() {
  return (
    <section id="servicios" className="px-4 lg:px-6 py-16 lg:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* TÍTULO */}
        <div className="text-center mb-10 lg:mb-16">
          <h3 className="text-2xl lg:text-4xl font-bold mb-4 text-gray-900">Servicios FinOps</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Modelos de servicio diseñados para acompañar la madurez FinOps de tu organización
          </p>
        </div>

        {/* GRID DE PLANES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">

          {/* FOUNDATION */}
          <a href="/servicios" className="group block rounded-3xl border bg-gradient-to-b from-blue-50 to-white p-8 shadow-sm hover:shadow-xl transition">
            <div className="flex justify-center mb-6">
              <span className="bg-green-500 text-white text-sm font-semibold px-4 py-1 rounded-full">🎉 20% DCTO</span>
            </div>
            <h4 className="text-2xl font-bold mb-2 text-gray-900">FinOps Foundation</h4>
            <p className="text-gray-500 mb-6 text-sm">Visibilidad y control financiero cloud.</p>
            <ul className="space-y-2 text-gray-700 mb-10 text-sm">
              <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✔</span> Dashboard ejecutivo de costos y riesgo</li>
              <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✔</span> Inventario completo de recursos AWS</li>
              <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✔</span> Hallazgos y recomendaciones de ahorro</li>
              <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✔</span> Risk &amp; Governance Score</li>
              <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✔</span> Reportes ejecutivos PDF / CSV / XLSX</li>
              <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✔</span> Bot asistente FinOps</li>
            </ul>
            <div className="mt-auto">
              <div className="bg-gray-800 text-white text-center font-semibold py-3 rounded-xl group-hover:bg-gray-900 transition">
                Contratar Plan
              </div>
            </div>
          </a>

          {/* PROFESSIONAL (DESTACADO) */}
          <a href="/servicios" className="group block rounded-3xl border-2 border-blue-600 bg-gradient-to-b from-blue-50 to-white p-8 shadow-lg hover:shadow-2xl transition relative">
            <div className="flex justify-center gap-2 mb-6">
              <span className="bg-green-500 text-white text-sm font-semibold px-4 py-1 rounded-full">🎉 20% DCTO</span>
              <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">Más elegido</span>
            </div>
            <h4 className="text-2xl font-bold mb-2 text-gray-900">FinOps Professional</h4>
            <p className="text-gray-500 mb-6 text-sm">Optimización activa y decisiones basadas en datos.</p>
            <ul className="space-y-2 text-gray-700 mb-10 text-sm">
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">✔</span> Todo lo incluido en Foundation</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">✔</span> Rightsizing EC2, RDS y Lambda</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">✔</span> Análisis Savings Plans y Reserved Instances</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">✔</span> Proyección financiera (ROI &amp; Savings)</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">✔</span> Forecast y seguimiento presupuestario</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">✔</span> Reunión estratégica quincenal</li>
            </ul>
            <div className="mt-auto">
              <div className="bg-blue-600 text-white text-center font-semibold py-3 rounded-xl group-hover:bg-blue-700 transition">
                Contratar Plan
              </div>
            </div>
          </a>

          {/* ENTERPRISE */}
          <a href="/servicios" className="group block rounded-3xl border bg-gradient-to-b from-purple-50 to-white p-8 shadow-sm hover:shadow-xl transition">
            <div className="flex justify-center mb-6">
              <span className="bg-green-500 text-white text-sm font-semibold px-4 py-1 rounded-full">🎉 20% DCTO</span>
            </div>
            <h4 className="text-2xl font-bold mb-2 text-gray-900">FinOps Enterprise</h4>
            <p className="text-gray-500 mb-6 text-sm">Gobierno completo y automatización avanzada.</p>
            <ul className="space-y-2 text-gray-700 mb-10 text-sm">
              <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">✔</span> Todo lo incluido en Professional</li>
              <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">✔</span> Multi-account visibility</li>
              <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">✔</span> Roadmap estratégico FinOps</li>
              <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">✔</span> Modelo operativo FinOps (definición inicial)</li>
              <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">✔</span> Sesión ejecutiva mensual C-Level</li>
              <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">✔</span> Acompañamiento en compromisos cloud</li>
            </ul>
            <div className="mt-auto">
              <div className="bg-purple-600 text-white text-center font-semibold py-3 rounded-xl group-hover:bg-purple-700 transition">
                Contratar Plan
              </div>
            </div>
          </a>

        </div>

        {/* TABLA COMPARATIVA */}
        <div>
          <h4 className="text-xl lg:text-2xl font-bold text-center text-gray-900 mb-8">
            Comparativa de planes
          </h4>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="text-left px-6 py-4 font-semibold w-1/2">Funcionalidad</th>
                  <th className="px-4 py-4 font-semibold text-center">Foundation</th>
                  <th className="px-4 py-4 font-semibold text-center bg-blue-700">Professional</th>
                  <th className="px-4 py-4 font-semibold text-center bg-purple-800">Enterprise</th>
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
            ¿Tienes dudas? <a href="https://wa.me/56965090121" target="_blank" className="text-blue-500 hover:underline">Contáctanos por WhatsApp</a> y te ayudamos a elegir el plan ideal.
          </p>
        </div>

      </div>
    </section>
  );
}
