'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PlanCard from './components/PlanCard';
import ContractModal from './components/ContractModal';
import PlanComparisonTable from '@/app/components/PlanComparisonTable';
import PublicFooter from '@/app/components/layout/PublicFooter';
import { PLAN_SLUGS } from '@/app/pago/constants';

export default function Servicios() {
  const router = useRouter();
  const [showConsultoriaModal, setShowConsultoriaModal] = useState(false);

  const handleSelectPlan = (planTitle: string) => {
    if (planTitle === 'Consultoría FinOps Estratégica') {
      setShowConsultoriaModal(true);
      return;
    }
    const slug = PLAN_SLUGS[planTitle];
    if (slug) router.push(`/pago?plan=${slug}`);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-14 lg:py-20 text-center px-4 lg:px-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
          Planes FinOps para cada etapa de crecimiento
        </h1>
        <p className="text-base sm:text-xl text-blue-100 max-w-3xl mx-auto">
          Gobernanza financiera en la nube, optimización continua de recursos y decisiones estratégicas 
          basadas en análisis de costos.
        </p>
      </section>

      {/* PLANES */}
      <section className="px-4 lg:px-6 py-14 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        <PlanCard
          title="FinOps Foundation"
          description="Visibilidad y control financiero cloud."
          features={[
            "Integración con AWS (1 cuenta)",
            "Dashboard de costos, cuentas y servicios",
            "Hallazgos y recomendaciones de ahorro",
            "Inventario de recursos y análisis de riesgo",
            "Costos y financieros (visión general)",
            "Exportación de reportes (PDF, CSV, XLSX)",
            "Hasta 3 usuarios",
            "Soporte estándar",
          ]}
          bg="bg-gradient-to-br from-slate-200 via-slate-100 to-white"
          border="border border-slate-300"
          button="bg-slate-700"
          onClick={() => handleSelectPlan("FinOps Foundation")}
        />

        <PlanCard
          title="FinOps Professional"
          description="Optimización activa y decisiones basadas en datos."
          features={[
            "Todo Foundation",
            "Hasta 5 cuentas AWS",
            "Hasta 9 usuarios",
            "Optimización avanzada (Findings & Rightsizing)",
            "Análisis de Savings Plans y Reserved Instances",
            "Reportes detallados: Cost, Risk y Resource",
            "Proyección financiera (ROI & Savings)",
            "Forecast y control presupuestario",
            "Governance FinOps",
            "Planes de ahorro (RI & Savings Plans)",
            "Soporte prioritario",
          ]}
          bg="bg-gradient-to-br from-blue-50 to-blue-100"
          border="border-2 border-blue-600"
          button="bg-blue-600"
          highlight
          onClick={() => handleSelectPlan("FinOps Professional")}
        />

        <PlanCard
          title="FinOps Enterprise"
          description="Gobierno completo y automatización avanzada."
          features={[
            "Todo Professional",
            "Hasta 10 cuentas AWS",
            "Hasta 12 usuarios",
            "Policies y alertas automáticas",
            "Gobernanza avanzada multi-account",
            "Reportes ejecutivos automatizados",
            "Project Calculator (proyección de costos)",
            "Asistente FinOps integrado",
            "Modelo operativo FinOps",
            "Acompañamiento estratégico continuo",
          ]}
          bg="bg-gradient-to-br from-purple-50 to-purple-100"
          border="border border-purple-300"
          button="bg-purple-700"
          onClick={() => handleSelectPlan("FinOps Enterprise")}
        />

        <PlanCard
          title="Consultoría FinOps Estratégica"
          description="Diagnóstico, implementación y acompañamiento especializado en optimización en la nube."
          features={[
            "Assessment FinOps completo",
            "Identificación de desperdicio y quick wins",
            "Diseño de estrategia de ahorro",
            "Baseline de costos y definición de KPIs FinOps",
            "Implementación de políticas FinOps",
            "Definición de gobernanza cloud",
            "Presentación ejecutiva a dirección",
            "Introducción a la cultura FinOps en la organización",
          ]}
          bg="bg-gradient-to-br from-emerald-50 to-emerald-100"
          border="border border-emerald-300"
          button="bg-emerald-700"
          onClick={() => handleSelectPlan("Consultoría FinOps Estratégica")}
        />


        </div>

        {/* TABLA COMPARATIVA */}
        <div className="max-w-7xl mx-auto mt-16">
          <PlanComparisonTable />
        </div>
      </section>



      <PublicFooter />

      {showConsultoriaModal && (
        <ContractModal
          plan="Consultoría FinOps Estratégica"
          onClose={() => setShowConsultoriaModal(false)}
        />
      )}
    </main>
  );
}
