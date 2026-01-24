'use client';

/* =====================================================
   BLOG / KNOWLEDGE HUB — FINOPSLATAM
   Curaduría de contenido oficial (no editorial propio)
===================================================== */

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* =====================================================
         HERO
      ===================================================== */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Centro de conocimiento FinOps
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Curaduría de recursos oficiales, guías técnicas y mejores prácticas
            sobre FinOps, optimización de costos cloud y gobierno financiero.
          </p>
        </div>
      </section>

      {/* =====================================================
         CONTENIDO PRINCIPAL
      ===================================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">

          {/* INTRO */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Información confiable, actualizada y oficial
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              En FinOpsLatam priorizamos fuentes oficiales y documentación
              mantenida directamente por los proveedores y organizaciones líderes
              del ecosistema cloud.
            </p>
          </div>

          {/* =====================================================
             RECURSOS
          ===================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            <ResourceCard
              icon="☁️"
              title="AWS Cloud Financial Management"
              description="Guías oficiales de AWS para control, optimización y gobierno del gasto en la nube."
              href="https://aws.amazon.com/aws-cost-management/"
              source="Amazon Web Services"
            />

            <ResourceCard
              icon="🏛️"
              title="FinOps Foundation"
              description="Framework oficial FinOps, principios, prácticas y certificaciones."
              href="https://www.finops.org/"
              source="FinOps Foundation"
            />

            <ResourceCard
              icon="📐"
              title="Well-Architected – Cost Optimization"
              description="Pilar de optimización de costos del AWS Well-Architected Framework."
              href="https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/"
              source="AWS Documentation"
            />

            <ResourceCard
              icon="📰"
              title="AWS Blog – Cost Management"
              description="Artículos técnicos oficiales sobre ahorro, budgeting y optimización en AWS."
              href="https://aws.amazon.com/blogs/aws-cost-management/"
              source="AWS Blog"
            />

            <ResourceCard
              icon="📘"
              title="AWS Whitepapers & Guides"
              description="Documentación técnica avanzada y casos reales sobre gestión financiera cloud."
              href="https://aws.amazon.com/whitepapers/"
              source="AWS Whitepapers"
            />

            <ResourceCard
              icon="🛡️"
              title="Cloud Governance & Control"
              description="Buenas prácticas de gobierno financiero, control de costos y accountability."
              href="https://www.finops.org/framework/governance/"
              source="FinOps Foundation"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
         CTA HONESTO
      ===================================================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Evolucionando hacia Research & Insights
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Este espacio evolucionará progresivamente hacia reportes propios,
            análisis regionales y estudios FinOps aplicados a LATAM.
          </p>

          <a
            href="https://www.linkedin.com/company/finopslatam"
            target="_blank"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Seguir en LinkedIn
          </a>
        </div>
      </section>

      {/* =====================================================
         FOOTER
      ===================================================== */}
      <footer className="bg-gray-900 text-gray-400 pt-8 border-t border-gray-800">
        <div className="flex justify-center gap-6 pb-6">
          <a href="https://wa.me/56965090121" target="_blank" className="hover:text-blue-400 transition text-2xl">💬</a>
          <a href="mailto:contacto@finopslatam.com" className="hover:text-blue-400 transition text-2xl">📧</a>
          <a href="https://www.linkedin.com/company/finopslatam" target="_blank" className="hover:text-blue-400 transition text-2xl">💼</a>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <a href="/">
                <img src="/logo2.png" alt="FinOpsLatam Logo" className="h-12 w-auto mb-4" />
              </a>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Expertos en Optimización de Costos en la Nube,
                automatización FinOps y control financiero para AWS.
              </p>
            </div>

            <div>
              <h3 className="text-white text-sm font-semibold mb-4">Navegación</h3>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-blue-400">Inicio</a></li>
                <li><a href="/servicios" className="hover:text-blue-400">Servicios</a></li>
                <li><a href="/quienes-somos" className="hover:text-blue-400">Quiénes Somos</a></li>
                <li><a href="/blog" className="hover:text-blue-400">Blog</a></li>
                <li><a href="/contacto" className="hover:text-blue-400">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-sm font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2">
                <li>Email: <a href="mailto:contacto@finopslatam.com" className="hover:text-blue-400">contacto@finopslatam.com</a></li>
                <li>WhatsApp: <a href="https://wa.me/56965090121" className="hover:text-blue-400">+56 9 6509 0121</a></li>
                <li>LinkedIn: <a href="https://www.linkedin.com/company/finopslatam" className="hover:text-blue-400">FinOpsLatam</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 py-6 border-t border-gray-800">
          © {new Date().getFullYear()} FinOpsLatam — Todos los derechos reservados
        </div>
      </footer>

    </main>
  );
}

/* =====================================================
   COMPONENT: RESOURCE CARD
===================================================== */

function ResourceCard({
  icon,
  title,
  description,
  href,
  source,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  source: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      className="block bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <span className="text-xs text-gray-400">Fuente: {source}</span>
    </a>
  );
}
