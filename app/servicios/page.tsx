'use client';

export default function Servicios() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

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
          <div className="flex justify-center space-x-8 overflow-x-auto">
            <a href="#assessment" className="text-gray-600 hover:text-[#1E40AF] font-medium transition-colors whitespace-nowrap">
              🔍 Cloud Assessment
            </a>
            <a href="#intelligence" className="text-gray-600 hover:text-[#1E40AF] font-medium transition-colors whitespace-nowrap">
              📊 Cloud Intelligence
            </a>
            <a href="#financial-ops" className="text-gray-600 hover:text-[#1E40AF] font-medium transition-colors whitespace-nowrap">
              💰 Cloud Financial Ops
            </a>
            <a href="#optimization" className="text-gray-600 hover:text-[#1E40AF] font-medium transition-colors whitespace-nowrap">
              ⚡ Cloud Optimization
            </a>
            <a href="#governance" className="text-gray-600 hover:text-[#1E40AF] font-medium transition-colors whitespace-nowrap">
              🏷️ Cloud Governance
            </a>
          </div>
        </div>
      </section>

      {/* SECCIÓN CLOUD ASSESSMENT */}
      <section id="assessment" className="px-6 py-20 bg-white scroll-mt-20">
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
                  Cloud Assessment
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Diagnóstico estratégico completo de tu infraestructura cloud para identificar oportunidades 
                  de optimización inmediata y establecer tu línea base FinOps.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">¿Qué incluye?</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Inventory completo de recursos AWS
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Detección de servicios no utilizados
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Reporte de costos por servicio/proyecto
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Identificación de quick wins (20-30% ahorro)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Dashboard básico de visibilidad
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Recomendaciones prioritarias de acción
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Resultados esperados</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Visibilidad 100% de tu entorno cloud
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Roadmap claro de optimización
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Identificación de 20-40% de ahorro potencial
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Línea base para medición continua
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CLOUD INTELLIGENCE */}
      <section id="intelligence" className="px-6 py-20 bg-gray-50 scroll-mt-20">
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
                  Cloud Intelligence
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Monitoreo proactivo y analytics avanzado con dashboards en tiempo real, 
                  alertas inteligentes y forecasting para toma de decisiones informada.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">¿Qué incluye?</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Dashboards en tiempo real personalizados
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Alertas de gasto anómalo y budgets
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Budget tracking y forecasting avanzado
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Cost allocation por tags y departamentos
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Anomaly detection automático
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Reportes automatizados ejecutivos
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Plataformas & Integraciones</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        AWS Cost Explorer avanzado
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Vistas personalizadas
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        AWS Anomaly Detection
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Alertas multi-nivel Email + Dashboard
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Exportación avanzada CSV, Excel, PDF
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CLOUD FINANCIAL OPERATIONS */}
      <section id="financial-ops" className="px-6 py-20 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">💰</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Cloud Financial Operations
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Gestión estratégica de compromisos financieros cloud con enfoque en maximizar ROI 
                  mediante Reserved Instances, Savings Plans y estrategias de compra optimizadas.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">¿Qué incluye?</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Análisis avanzado de Reserved Instances
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Optimización de Savings Plans
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Estrategia de compra y renovación
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        ROI analysis y garantía de ahorro
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Gestión de Spot Instances
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Ahorro garantizado: 20-60%
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Beneficios Financieros</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Reducción garantizada de costos
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Mejoramiento del ROI cloud
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Predictibilidad financiera
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Optimización continua de compromisos
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CLOUD OPTIMIZATION */}
      <section id="optimization" className="px-6 py-20 bg-gray-50 scroll-mt-20">
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
                  Cloud Optimization
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Optimización técnica automatizada de recursos cloud mediante right-sizing, 
                  auto-scaling inteligente y eficiencia operativa continua.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">¿Qué incluye?</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Right-sizing automatizado de instancias
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Configuraciones de auto-scaling inteligente
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Storage tier optimization
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Container resource optimization
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Automated cost-saving actions
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Reduction garantizada: 15-40%
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Resultados Técnicos</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Mejora performance y eficiencia
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Reducción automática de waste
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Operación 24/7 optimizada
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Cero intervención manual requerida
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CLOUD GOVERNANCE */}
      <section id="governance" className="px-6 py-20 bg-white scroll-mt-20">
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
                  Cloud Governance
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Framework completo de gobierno cloud con políticas, controles y cultura FinOps 
                  para transformación organizacional sostenible.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">¿Qué incluye?</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Tagging strategy implementation
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Budget controls y guardrails
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Policy as Code (Terraform)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        FinOps training team completo
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Cultura y procesos organizacionales
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Operating model completo FinOps
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Transformación Organizacional</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Cultura de responsabilidad cloud
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Procesos estandarizados
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Team capacitado y autónomo
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Governance escalable y sostenible
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
            ¿Listo para Transformar tu Gestión Cloud?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Agenda una consultoría gratuita de 30 minutos y recibe un análisis preliminar 
            con recomendaciones específicas para tu caso.
          </p>
          <a
            href="https://wa.me/56965090121?text=Hola,%20quiero%20una%20consultoría%20gratuita%20sobre%20servicios%20FinOps"
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