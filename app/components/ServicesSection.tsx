'use client';

import PlanComparisonTable from '@/app/components/PlanComparisonTable';

export default function ServicesSection() {
  return (
    <section id="servicios" className="px-4 lg:px-6 py-16 lg:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* TÍTULO */}
        <div className="text-center mb-10 lg:mb-16">
          <h3 className="text-2xl lg:text-4xl font-bold mb-4 text-gray-900">FinOps Enterprise</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Un solo plan, sin letra chica: gobierno financiero cloud completo desde el primer día
          </p>
        </div>

        {/* TABLA COMPARATIVA */}
        <PlanComparisonTable />

      </div>
    </section>
  );
}
