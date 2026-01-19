'use client';

export default function Servicios() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-5xl mx-auto text-center px-6">
          <h1 className="text-5xl font-bold mb-6">
            Planes FinOps para cada nivel de madurez Cloud
          </h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            Modelos claros, escalables y alineados a estándares enterprise para controlar,
            optimizar y gobernar tus costos en la nube.
          </p>
        </div>
      </section>

      {/* PLANES */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* FOUNDATION */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">FinOps Foundation</h3>
            <p className="text-gray-600 mb-6">
              Visibilidad, control y orden financiero para entornos cloud en etapa inicial.
            </p>

            <ul className="space-y-3 text-gray-700 mb-8">
              <li>✔ Cloud Assessment inicial</li>
              <li>✔ Inventario completo de recursos</li>
              <li>✔ Costos por servicio y proyecto</li>
              <li>✔ Dashboards básicos de visibilidad</li>
              <li>✔ Alertas simples de gasto</li>
              <li>✔ Linea base FinOps</li>
            </ul>

            <div className="mt-auto text-sm text-gray-500">
              Ideal para startups y pymes
            </div>
          </div>

          {/* PROFESSIONAL */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-600 p-8 flex flex-col relative">
            <span className="absolute -top-4 right-6 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Más elegido
            </span>

            <h3 className="text-2xl font-bold mb-2">FinOps Professional</h3>
            <p className="text-gray-600 mb-6">
              Optimización activa y toma de decisiones financieras basada en datos.
            </p>

            <ul className="space-y-3 text-gray-700 mb-8">
              <li>✔ Todo Foundation</li>
              <li>✔ Forecasting y budget tracking</li>
              <li>✔ Cost allocation por tags</li>
              <li>✔ Savings Plans & RI analysis</li>
              <li>✔ Optimización técnica recomendada</li>
              <li>✔ IA FinOps asistida (insights)</li>
            </ul>

            <div className="mt-auto text-sm text-gray-500">
              Para equipos técnicos y financieros en crecimiento
            </div>
          </div>

          {/* ENTERPRISE */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">FinOps Enterprise</h3>
            <p className="text-gray-600 mb-6">
              Gobierno completo, automatización y decisiones financieras asistidas por IA.
            </p>

            <ul className="space-y-3 text-gray-700 mb-8">
              <li>✔ Todo Professional</li>
              <li>✔ Optimización automatizada controlada</li>
              <li>✔ Anomaly Detection avanzado</li>
              <li>✔ IA FinOps predictiva y explicable</li>
              <li>✔ Operating Model FinOps</li>
              <li>✔ Gobierno y compliance cloud</li>
            </ul>

            <div className="mt-auto text-sm text-gray-500">
              Diseñado para organizaciones enterprise
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿No sabes qué plan es el adecuado?
          </h2>
          <p className="text-gray-300 mb-8">
            Agenda una consultoría gratuita y definamos juntos el roadmap FinOps
            según tu nivel de madurez cloud.
          </p>
          <a
            href="https://wa.me/56965090121"
            target="_blank"
            className="inline-block bg-[#2CA01C] hover:bg-[#238015] text-white font-semibold px-8 py-4 rounded-lg"
          >
            Agendar Consultoría
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 pt-8 border-t border-gray-800">
        <div className="flex justify-center gap-6 pb-6">
          <a 
            href="https://wa.me/56965090121"
            target="_blank" 
            className="hover:text-blue-400 transition text-2xl"
          >
            💬
          </a>
          <a 
            href="mailto:contacto@finopslatam.com" 
            className="hover:text-blue-400 transition text-2xl"
          >
            📧
          </a>
          <a 
            href="https://www.linkedin.com/company/finopslatam" 
            target="_blank" 
            className="hover:text-blue-400 transition text-2xl"
          >
            💼
          </a>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <a href="/" className="flex items-center">
                <img 
                  src="/logo2.png" 
                  alt="FinOpsLatam Logo" 
                  className="h-12 w-auto mb-4"
                />
              </a>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Expertos en Optimización de Costos en la Nube, 
                automatización FinOps y control financiero para AWS.
              </p>
            </div>

            <div>
              <h3 className="text-white text-sm font-semibold mb-4">Navegación</h3>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-blue-400 transition-colors">Inicio</a></li>
                <li><a href="/servicios" className="hover:text-blue-400 transition-colors">Servicios</a></li>
                <li><a href="/quienes-somos" className="hover:text-blue-400 transition-colors">Quiénes Somos</a></li>
                <li><a href="/blog" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="/contacto" className="hover:text-blue-400 transition-colors">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-sm font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2">
                <li>Email: <a href="mailto:contacto@finopslatam.com" className="hover:text-blue-400 transition-colors">contacto@finopslatam.com</a></li>
                <li>WhatsApp: <a href="https://wa.me/56965090121" className="hover:text-blue-400 transition-colors">+56 9 65090121</a></li>
                <li>LinkedIn: <a href="https://www.linkedin.com/company/finopslatam" className="hover:text-blue-400 transition-colors">FinOpsLatam</a></li>
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