import type { Metadata } from 'next';
import Link from 'next/link';
import PublicFooter from '@/app/components/layout/PublicFooter';

export const metadata: Metadata = {
  title: 'FinOps Latinoamérica: Optimización Cloud para Empresas',
  description:
    'Implementación de FinOps en Latinoamérica para optimizar costos AWS, mejorar gobierno financiero cloud y escalar con eficiencia.',
  keywords: [
    'FinOps Latinoamérica',
    'FinOps LATAM',
    'optimización costos AWS LATAM',
    'consultoría FinOps regional',
    'gobierno cloud latinoamerica',
  ],
  alternates: {
    canonical: '/finops-latinoamerica',
  },
  openGraph: {
    title: 'FinOps Latinoamérica: Optimización Cloud para Empresas',
    description:
      'Acompañamos organizaciones de LATAM para reducir costos cloud, fortalecer gobernanza y escalar AWS con control financiero.',
    url: '/finops-latinoamerica',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinOps Latinoamérica: Optimización Cloud para Empresas',
    description:
      'Acompañamos organizaciones de LATAM para reducir costos cloud, fortalecer gobernanza y escalar AWS con control financiero.',
  },
};

const regiones = [
  'Chile',
  'México',
  'Colombia',
  'Perú',
  'Argentina',
  'Uruguay',
  'Ecuador',
  'Brasil',
];

export default function FinopsLatamPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-blue-200 text-sm sm:text-base mb-3">FinOpsLatam · Cobertura regional</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
            FinOps para Latinoamérica: menos gasto cloud, más eficiencia operativa
          </h1>
          <p className="text-blue-100 text-base sm:text-xl max-w-3xl">
            Diseñamos e implementamos prácticas FinOps para empresas de LATAM que necesitan
            visibilidad de costos, gobernanza financiera y crecimiento sostenible en AWS.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/contacto"
              className="inline-block bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              Agendar reunión regional
            </Link>
            <Link
              href="/finops-chile"
              className="inline-block border border-white/70 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition"
            >
              Ver enfoque para Chile
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Acompañamiento FinOps en mercados LATAM</h2>
          <p className="text-gray-600 mb-6">
            Adaptamos el modelo operativo FinOps a la realidad regional de cada organización,
            alineando tecnología, finanzas y liderazgo ejecutivo.
          </p>
          <div className="flex flex-wrap gap-2">
            {regiones.map((pais) => (
              <span
                key={pais}
                className="inline-block rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-gray-700"
              >
                {pais}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Resultados esperados con FinOps en LATAM</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <article className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-lg mb-2">Control financiero cloud</h3>
              <p className="text-gray-600">
                Costos transparentes y trazables por unidad de negocio, producto o equipo.
              </p>
            </article>
            <article className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-lg mb-2">Eficiencia de infraestructura</h3>
              <p className="text-gray-600">
                Menor desperdicio en recursos y mayor aprovechamiento de inversión en AWS.
              </p>
            </article>
            <article className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-lg mb-2">Decisiones ejecutivas con datos</h3>
              <p className="text-gray-600">
                Reportes comparables y accionables para dirección financiera y tecnológica.
              </p>
            </article>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/servicios" className="text-blue-600 hover:underline font-medium">
              Explorar planes FinOps
            </Link>
            <Link href="/blog" className="text-blue-600 hover:underline font-medium">
              Revisar contenido técnico FinOps
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
