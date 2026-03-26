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
              <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✔</span> Integración con AWS (1 cuenta)</li>
              <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✔</span> Dashboard de costos, cuentas y servicios</li>
              <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✔</span> Hallazgos y recomendaciones de ahorro</li>
              <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✔</span> Inventario de recursos y análisis de riesgo</li>
              <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✔</span> Costos y financieros (visión general)</li>
              <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✔</span> Exportación de reportes (PDF, CSV, XLSX)</li>
              <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✔</span> Hasta 3 usuarios</li>
              <li className="flex items-start gap-2"><span className="text-green-500 font-bold mt-0.5">✔</span> Soporte estándar</li>
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
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">✔</span> Hasta 5 cuentas AWS</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">✔</span> Hasta 9 usuarios</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">✔</span> Optimización avanzada (Findings & Rightsizing)</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">✔</span> Análisis de Savings Plans y Reserved Instances</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">✔</span> Reportes detallados: Cost, Risk y Resource</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">✔</span> Proyección financiera (ROI & Savings)</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">✔</span> Forecast y control presupuestario</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">✔</span> Governance FinOps</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">✔</span> Planes de ahorro (RI & Savings Plans)</li>
              <li className="flex items-start gap-2"><span className="text-blue-500 font-bold mt-0.5">✔</span> Soporte prioritario</li>
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
              <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">✔</span> Hasta 10 cuentas AWS</li>
              <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">✔</span> Hasta 12 usuarios</li>
              <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">✔</span> Policies y alertas automáticas</li>
              <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">✔</span> Gobernanza avanzada multi-account"</li>
              <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">✔</span> Reportes ejecutivos automatizados</li>
              <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">✔</span> Project Calculator (proyección de costos)</li>
              <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">✔</span> MAsistente FinOps integrado</li>
              <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">✔</span> Modelo operativo FinOps</li>
              <li className="flex items-start gap-2"><span className="text-purple-500 font-bold mt-0.5">✔</span> Acompañamiento estratégico continuo</li>
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
