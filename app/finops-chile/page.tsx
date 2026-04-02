import type { Metadata } from 'next';
import Link from 'next/link';
import PublicFooter from '@/app/components/layout/PublicFooter';

export const metadata: Metadata = {
  title: 'FinOps Chile: Optimización de Costos AWS para Empresas',
  description:
    'Servicios de FinOps en Chile para reducir costos AWS, mejorar gobierno cloud y acelerar decisiones financieras con datos confiables.',
  keywords: [
    'FinOps Chile',
    'optimización de costos AWS Chile',
    'consultoría FinOps Chile',
    'gobierno cloud Chile',
    'Cloud Financial Management Chile',
  ],
  alternates: {
    canonical: '/finops-chile',
  },
  openGraph: {
    title: 'FinOps Chile: Optimización de Costos AWS para Empresas',
    description:
      'Implementa FinOps en Chile para controlar gasto cloud, aumentar eficiencia y mejorar el ROI de tu operación AWS.',
    url: '/finops-chile',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinOps Chile: Optimización de Costos AWS para Empresas',
    description:
      'Implementa FinOps en Chile para controlar gasto cloud, aumentar eficiencia y mejorar el ROI de tu operación AWS.',
  },
};

export default function FinopsChilePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-blue-200 text-sm sm:text-base mb-3">FinOpsLatam · Especialistas regionales</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
            FinOps en Chile para optimizar costos AWS con enfoque de negocio
          </h1>
          <p className="text-blue-100 text-base sm:text-xl max-w-3xl">
            Ayudamos a empresas en Chile a implementar prácticas FinOps para reducir desperdicio cloud,
            ordenar la gobernanza financiera y tomar mejores decisiones sobre gasto en AWS.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/contacto"
              className="inline-block bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Solicitar diagnóstico FinOps
            </Link>
            <Link
              href="/servicios"
              className="inline-block border border-white/70 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition"
            >
              Ver planes y servicios
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Qué hacemos para empresas en Chile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <article className="rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-lg mb-2">Visibilidad de costos por cuenta, servicio y equipo</h3>
              <p className="text-gray-600">
                Estructuramos el gasto cloud para que finanzas y tecnología hablen el mismo idioma.
              </p>
            </article>
            <article className="rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-lg mb-2">Optimización continua y acciones de ahorro</h3>
              <p className="text-gray-600">
                Detectamos oportunidades en rightsizing, instancias reservadas y planes de ahorro.
              </p>
            </article>
            <article className="rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-lg mb-2">Gobernanza y control presupuestario</h3>
              <p className="text-gray-600">
                Definimos prácticas de accountability, alertas y políticas para controlar desviaciones.
              </p>
            </article>
            <article className="rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-lg mb-2">Reportes ejecutivos para toma de decisiones</h3>
              <p className="text-gray-600">
                Entregamos métricas claras de eficiencia, riesgo y ahorro para dirección y stakeholders.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Preguntas frecuentes sobre FinOps Chile</h2>
          <div className="space-y-4">
            <article className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold mb-2">¿FinOps es solo para empresas grandes?</h3>
              <p className="text-gray-600">
                No. Empresas en crecimiento también obtienen resultados al ordenar costos y evitar desperdicio cloud.
              </p>
            </article>
            <article className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold mb-2">¿Cuándo se empiezan a ver resultados?</h3>
              <p className="text-gray-600">
                Normalmente se detectan quick wins durante las primeras semanas y mejoras sostenidas en los meses siguientes.
              </p>
            </article>
            <article className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold mb-2">¿Trabajan solo con Chile?</h3>
              <p className="text-gray-600">
                También acompañamos empresas de la región. Puedes revisar nuestra página de
                {' '}
                <Link href="/finops-latinoamerica" className="text-blue-600 hover:underline">
                  FinOps Latinoamérica
                </Link>
                .
              </p>
            </article>
          </div>
          <div className="mt-8">
            <Link href="/blog" className="text-blue-600 hover:underline font-medium">
              Ver recursos y guías FinOps para Chile y LATAM
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
