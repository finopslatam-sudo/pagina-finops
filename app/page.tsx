'use client';

import { useEffect, useState } from 'react';

// Componente de contador animado
function AnimatedCounter({
  target,
  suffix = '',
  duration = 2000,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return (
    <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
      {suffix}
      {count}
      {suffix ? '' : '%'}
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-48 h-32 bg-white rounded-lg transform rotate-6"></div>
          <div className="absolute top-1/3 right-1/4 w-56 h-40 bg-white rounded-lg transform -rotate-3"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-36 bg-white rounded-lg transform rotate-12"></div>
          <div className="absolute bottom-1/3 right-1/3 w-52 h-28 bg-white rounded-lg transform -rotate-6"></div>
          
          {/* Líneas de gráficos */}
          <div className="absolute top-40 left-20 w-64 h-1 bg-white transform rotate-12"></div>
          <div className="absolute top-44 left-24 w-56 h-1 bg-white transform rotate-12"></div>
          <div className="absolute top-52 left-28 w-48 h-1 bg-white transform rotate-12"></div>
          
          {/* Barras de gráfico */}
          <div className="absolute bottom-40 right-20 w-6 h-24 bg-white rounded-t"></div>
          <div className="absolute bottom-40 right-32 w-6 h-32 bg-white rounded-t"></div>
          <div className="absolute bottom-40 right-44 w-6 h-28 bg-white rounded-t"></div>
          <div className="absolute bottom-40 right-56 w-6 h-36 bg-white rounded-t"></div>
        </div>

        <div className="relative text-center max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-6">
            Optimización de Costos en la Nube
          </h1>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Ayudamos a empresas a controlar, visualizar y reducir sus costos en AWS 
            aplicando mejores prácticas FinOps y automatización.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="https://wa.me/56965090121?text=Hola,%20quiero%20información%20sobre%20FinOpsLatam"
              target="_blank"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Hablemos por WhatsApp
            </a>
            <a
              href="/servicios"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors text-sm sm:text-base"
            >
              Conocer Servicios
            </a>
          </div>
        </div>
      </section>

      {/* DASHBOARD SECTION - Métricas y gráficos */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Columna izquierda - Métricas */}
            <div className="space-y-8">
              
              {/* NOTICIAS DE NEGOCIOS */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">NOTICIAS DE NEGOCIOS</h3>
                
                <div className="space-y-4">
                  {/* Accounting Agent */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">A</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Agente contable</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">23</p>
                      <p className="text-sm text-gray-500">Transacciones categorizadas</p>
                    </div>
                  </div>

                  {/* Finance Agent */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">F</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Agente financiero</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">4,733</p>
                      <p className="text-sm text-gray-500">Gastos controlados</p>
                    </div>
                  </div>

                  {/* Customer Agent */}
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">C</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Agente de atención al cliente</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">3</p>
                      <p className="text-sm text-gray-500">Nuevos leads para revisar</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* INSIGHTS */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">PERSPECTIVAS</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                    <p className="text-2xl font-bold text-gray-900">10</p>
                    <p className="text-sm text-gray-500 mt-1">Otras propuestas</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                    <p className="text-2xl font-bold text-gray-900">7</p>
                    <p className="text-sm text-gray-500 mt-1">Contratos activos</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
                    <p className="text-2xl font-bold text-gray-900">3</p>
                    <p className="text-sm text-gray-500 mt-1">Proyectos activos</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Columna derecha - Gráfico y métricas financieras */}
            <div className="space-y-8">
              
              {/* BANK ACCOUNTS & CASH FLOW */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">RESUMEN DE CUENTAS</h3>
                
                <div className="space-y-6">
                  {/* Cash Flow */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-4">FLUJO DE CAJA</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">$19,340</p>
                        <p className="text-sm text-gray-500">Cuenta de cierre</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">$12,313</p>
                        <p className="text-sm text-gray-500">Balance actual</p>
                      </div>
                    </div>
                  </div>

                  {/* Gráfico - Imagen real */}
                  <div className="rounded-xl overflow-hidden">
                    <img 
                      src="/ima1.png" 
                      alt="Dashboard FinOps - Visualización de costos en la nube" 
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Métricas adicionales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-xl">
                  <p className="text-2xl font-bold">$4,340</p>
                  <p className="text-blue-100 text-sm">Ahorro mensual</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl">
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-green-100 text-sm">Tasa de eficiencia</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
         SERVICIOS FINOPS
         - Sección de servicios actuales
      ===================================================== */}
      <section
        id="servicios"
        className="px-6 py-24 bg-gray-50"
      >
        <div className="max-w-6xl mx-auto">

          {/* TÍTULO */}
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold mb-4 text-gray-900">
              Servicios FinOps
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Modelos de servicio diseñados para acompañar la madurez FinOps
              de tu organización
            </p>
          </div>

          {/* GRID DE PLANES */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ===================== FOUNDATION ===================== */}
            <a
              href="/servicios"
              className="group block rounded-3xl border bg-gradient-to-b from-blue-50 to-white p-8 shadow-sm hover:shadow-xl transition"
            >
              {/* Badge */}
              <div className="flex justify-center mb-6">
                <span className="bg-green-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  🎉 20% DCTO
                </span>
              </div>

              <h4 className="text-2xl font-bold mb-3 text-gray-900">
                FinOps Foundation
              </h4>
              <p className="text-gray-600 mb-6">
                Visibilidad y control financiero cloud.
              </p>

              <ul className="space-y-3 text-gray-700 mb-10">
                <li>✔ Cloud Assessment inicial</li>
                <li>✔ Inventario completo de recursos</li>
                <li>✔ Costos por servicio y proyecto</li>
                <li>✔ Dashboards básicos</li>
                <li>✔ Alertas simples</li>
                <li>✔ Línea base FinOps</li>
              </ul>

              <div className="mt-auto">
                <div className="bg-gray-800 text-white text-center font-semibold py-3 rounded-xl group-hover:bg-gray-900 transition">
                  Contratar Plan
                </div>
              </div>
            </a>

            {/* ===================== PROFESSIONAL (DESTACADO) ===================== */}
            <a
              href="/servicios"
              className="group block rounded-3xl border-2 border-blue-600 bg-gradient-to-b from-blue-50 to-white p-8 shadow-lg hover:shadow-2xl transition relative"
            >
              {/* Badges */}
              <div className="flex justify-center gap-2 mb-6">
                <span className="bg-green-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  🎉 20% DCTO
                </span>
                <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                  Más elegido
                </span>
              </div>

              <h4 className="text-2xl font-bold mb-3 text-gray-900">
                FinOps Professional
              </h4>
              <p className="text-gray-600 mb-6">
                Optimización activa y decisiones basadas en datos.
              </p>

              <ul className="space-y-3 text-gray-700 mb-10">
                <li>✔ Todo Foundation</li>
                <li>✔ Forecasting y budget tracking</li>
                <li>✔ Cost allocation por tags</li>
                <li>✔ Savings Plans & RI analysis</li>
                <li>✔ Optimización técnica recomendada</li>
                <li>✔ IA FinOps asistida</li>
              </ul>

              <div className="mt-auto">
                <div className="bg-blue-600 text-white text-center font-semibold py-3 rounded-xl group-hover:bg-blue-700 transition">
                  Contratar Plan
                </div>
              </div>
            </a>

            {/* ===================== ENTERPRISE ===================== */}
            <a
              href="/servicios"
              className="group block rounded-3xl border bg-gradient-to-b from-purple-50 to-white p-8 shadow-sm hover:shadow-xl transition"
            >
              {/* Badge */}
              <div className="flex justify-center mb-6">
                <span className="bg-green-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  🎉 20% DCTO
                </span>
              </div>

              <h4 className="text-2xl font-bold mb-3 text-gray-900">
                FinOps Enterprise
              </h4>
              <p className="text-gray-600 mb-6">
                Gobierno completo y automatización avanzada.
              </p>

              <ul className="space-y-3 text-gray-700 mb-10">
                <li>✔ Todo Professional</li>
                <li>✔ Optimización automatizada</li>
                <li>✔ Anomaly Detection avanzado</li>
                <li>✔ IA FinOps predictiva</li>
                <li>✔ Operating Model FinOps</li>
                <li>✔ Compliance y gobierno cloud</li>
              </ul>

              <div className="mt-auto">
                <div className="bg-purple-600 text-white text-center font-semibold py-3 rounded-xl group-hover:bg-purple-700 transition">
                  Contratar Plan
                </div>
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* SOBRE MI */}
      <section id="sobre-mi" className="px-6 py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold mb-8 text-gray-900 text-center">Quiénes somos</h3>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <p className="text-gray-600 leading-relaxed text-lg">
              En <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent font-semibold">FinOpsLatam</span> combinamos experiencia en FinOps, DevOps y DataOps para ayudarte a controlar tus gastos en la nube. Nuestra misión es reducir costos de manera sostenible, sin comprometer la eficiencia de tus servicios.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <AnimatedCounter target={40} suffix="+" duration={5000} />
                <div className="text-gray-600">Ahorro en costos</div>
              </div>
              <div className="p-4">
                <AnimatedCounter target={99} duration={5000} />
                <div className="text-gray-600">Clientes satisfechos</div>
              </div>
              <div className="p-4">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">24/7</span>
                <div className="text-gray-600">Monitoreo continuo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="px-6 py-20 text-center bg-white">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-4xl font-bold mb-6 text-gray-900">Contacto</h3>
          <p className="text-gray-600 mb-8 text-lg">
            ¿Listo para optimizar tus costos en la nube? Contáctanos hoy mismo.
          </p>
          
          <div className="mb-8">
            <p className="text-gray-700 mb-2">
              <strong>Correo:</strong> contacto@finopslatam.com
            </p>
            <p className="text-gray-700">
              <strong>WhatsApp:</strong> +56 9 65090121
            </p>
          </div>

          <a
            href="https://wa.me/56965090121"
            target="_blank"
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Hablemos por WhatsApp
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
              <a href="/">
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
