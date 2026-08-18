'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PlanCard from './components/PlanCard';
import ContractModal from './components/ContractModal';
import PlanComparisonTable from '@/app/components/PlanComparisonTable';
import CloudCoverageTable from '@/app/components/CloudCoverageTable';
import PublicFooter from '@/app/components/layout/PublicFooter';
import { PLAN_SLUGS } from '@/app/pago/constants';

export default function Servicios() {
  const router = useRouter();
  const [contactService, setContactService] = useState<string | null>(null);

  const CONTACT_ONLY_SERVICES = ["Talento TI", "Consultoría FinOps Estratégica"];

  const handleSelectPlan = (planTitle: string) => {
    if (CONTACT_ONLY_SERVICES.includes(planTitle)) {
      setContactService(planTitle);
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
          Un plan FinOps completo, y el equipo para llevarlo a la práctica
        </h1>
        <p className="text-base sm:text-xl text-blue-100 max-w-3xl mx-auto">
          Gobernanza financiera en la nube con FinOps Enterprise, acompañamiento estratégico
          y talento TI especializado para tus proyectos de desarrollo, QA y fullstack.
        </p>
      </section>

      {/* SERVICIOS */}
      <section className="px-4 lg:px-6 py-14 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

        <PlanCard
          title="FinOps Enterprise"
          description="Gobierno completo y automatización avanzada de tus costos multi-cloud: AWS, Azure y GCP."
          badge="🎉 20% DCTO"
          features={[
            "Integración multi-cloud: AWS, Azure y GCP (hasta 10 cuentas por proveedor)",
            "Dashboard de costos, hallazgos y optimización",
            "Inventario de recursos y análisis de riesgo",
            "Policies y alertas automáticas",
            "Gobernanza avanzada multi-cuenta",
            "Reportes ejecutivos automatizados",
            "Project Calculator (proyección de costos)",
            "Asistente FinOps.ia integrado",
            "Hasta 12 usuarios",
          ]}
          bg="bg-gradient-to-br from-purple-50 to-purple-100"
          border="border-2 border-purple-600"
          button="bg-purple-700"
          highlight
          onClick={() => handleSelectPlan("FinOps Enterprise")}
        />

        <PlanCard
          title="Talento TI"
          description="Profesionales especializados para acompañar los procesos de desarrollo de tu equipo."
          badge={null}
          buttonLabel="Solicitar Talento TI"
          features={[
            "Desarrolladores Backend y Frontend",
            "Ingenieros Fullstack",
            "QA / Testing (manual y automatizado)",
            "Integración directa con tu equipo y metodología",
            "Modalidad staff augmentation o por proyecto",
            "Perfiles seniors validados técnicamente",
            "Onboarding y seguimiento continuo",
          ]}
          bg="bg-gradient-to-br from-blue-50 to-blue-100"
          border="border border-blue-300"
          button="bg-blue-700"
          onClick={() => handleSelectPlan("Talento TI")}
        />

        <PlanCard
          title="Consultoría FinOps Estratégica"
          description="Diagnóstico, implementación y acompañamiento especializado en optimización en la nube."
          badge={null}
          buttonLabel="Solicitar Propuesta"
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

        {/* COBERTURA MULTI-CLOUD */}
        <div className="max-w-7xl mx-auto mt-16">
          <CloudCoverageTable />
        </div>
      </section>



      <PublicFooter />

      {contactService && (
        <ContractModal
          plan={contactService}
          onClose={() => setContactService(null)}
        />
      )}
    </main>
  );
}
