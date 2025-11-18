'use client';

export default function Servicios() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* NAVBAR */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
        <a href="/" className="flex items-center">
          <img 
            src="/logo2.png" 
            alt="FinOpsLatam Logo" 
            className="h-20 w-auto hover:opacity-80 transition-opacity"
          />
        </a>
        <nav className="space-x-8">
          <a href="/" className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors">Inicio</a>
          <a href="/servicios" className="text-[#1E40AF] font-medium">Servicios</a>
          <a href="/quienes-somos" className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors">Quiénes Somos</a>
          <a href="/blog" className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors">Blog</a>
          <a href="/contacto" className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors">Contacto</a>
        </nav>
      </header>

      {/* HERO SERVICIOS */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl font-bold mb-6">
          Nuestros Servicios FinOps
          </h1>
    <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Soluciones especializadas para optimizar cada aspecto de tus costos en la nube, 
            combinando expertise técnico y financiero para maximizar tu ROI.
          </p>
        </div>
      </section>

      {/* MENÚ DE NAVEGACIÓN INTERNA */}
      <section className="px-6 py-8 bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center space-x-8">
            <a href="#auditoria" className="text-gray-600 hover:text-[#1E40AF] font-medium transition-colors">
              🔍 Auditoría
            </a>
            <a href="#dashboards" className="text-gray-600 hover:text-[#1E40AF] font-medium transition-colors">
              📊 Dashboards
            </a>
            <a href="#gobernanza" className="text-gray-600 hover:text-[#1E40AF] font-medium transition-colors">
              🏷️ Gobernanza
            </a>
            <a href="#optimizacion" className="text-gray-600 hover:text-[#1E40AF] font-medium transition-colors">
              ⚡ Optimización
            </a>
          </div>
        </div>
      </section>

      {/* SECCIÓN AUDITORÍA */}
      <section id="auditoria" className="px-6 py-20 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">🔍</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Auditoría Integral de Costos
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Análisis profundo de tu infraestructura cloud para identificar fugas de costos, 
                  recursos subutilizados y oportunidades de optimización inmediata.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">¿Qué incluye?</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Análisis completo de CUR (Cost and Usage Report)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Identificación de Reserved Instances no utilizadas
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Recomendaciones de Spot Instances
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Resource Rightsizing específico
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Resultados esperados</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        20-40% de ahorro inmediato
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Reporte detallado de oportunidades
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Plan de implementación paso a paso
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DASHBOARDS */}
      <section id="dashboards" className="px-6 py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">📊</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Dashboards & Reportes en Tiempo Real
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Visualización avanzada de costos con integraciones nativas a AWS Cost Explorer, 
                  QuickSight, Grafana y Power BI para toma de decisiones informada.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Plataformas</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        AWS Cost Explorer personalizado
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Dashboards en Grafana
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Reportes en Power BI
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Amazon QuickSight
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Características</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Alertas automáticas de costos
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Forecast de gastos
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Reportes por departamento
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN GOBIERNAZA */}
      <section id="gobernanza" className="px-6 py-20 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">🏷️</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Gobernanza & Políticas de Tagging
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Implementación de frameworks de etiquetado estándar y políticas de compliance 
                  para asignación precisa de costos y control financiero.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Implementación</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        AWS Tagging Policies
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Cost Allocation Tags
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Automated Tag Enforcement
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Beneficios</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        95% precisión en asignación
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Cumplimiento automático
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Reportes por centro de costo
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN OPTIMIZACIÓN */}
      <section id="optimizacion" className="px-6 py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">⚡</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Optimización Automatizada
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Automatización de procesos FinOps mediante scripts, AWS Lambda y herramientas 
                  especializadas para ahorro continuo sin intervención manual.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Automatizaciones</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Auto-scaling inteligente
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Resource Scheduling
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Cost Anomaly Detection
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Resultados</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Ahorro continuo 24/7
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Zero intervención manual
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Alertas proactivas
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Necesitas Ayuda con Algún Servicio Específico?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Agenda una consultoría gratuita de 30 minutos y recibe un análisis preliminar de tus costos AWS.
          </p>
          <a
            href="https://wa.me/56947788781?text=Hola,%20quiero%20una%20consultoría%20gratuita%20sobre%20servicios%20FinOps"
            target="_blank"
            className="inline-block bg-[#2CA01C] hover:bg-[#238015] text-white font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Agendar Consultoría Gratuita
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 pt-8 border-t border-gray-800">
        <div className="flex justify-center gap-6 pb-6">
          <a 
            href="https://wa.me/56947788781" 
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
                <li>WhatsApp: <a href="https://wa.me/56947788781" className="hover:text-blue-400 transition-colors">+56 9 47788781</a></li>
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