'use client';

import PlanComparisonTable from '@/app/components/PlanComparisonTable';

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
        <PlanComparisonTable />

      </div>
    </section>
  );
}
