'use client';

import { useState } from 'react';

export default function Contacto() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* NAVBAR*/}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
        <a href="/" className="flex items-center">
          <img 
            src="/logo2.png" 
            alt="FinOpsLatam Logo" 
            className="h-16 md:h-20 w-auto hover:opacity-80 transition-opacity"
          />
        </a>
        
        {/* Botón Hamburguesa para móvil*/}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-6 h-0.5 bg-gray-700 mb-1.5"></div>
          <div className="w-6 h-0.5 bg-gray-700 mb-1.5"></div>
          <div className="w-6 h-0.5 bg-gray-700"></div>
        </button>

        {/* Navegación Desktop */}
        <nav className="hidden md:flex space-x-8">
          <a href="/" className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors">Inicio</a>
          <a href="/servicios" className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors">Servicios</a>
          <a href="/quienes-somos" className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors">Quiénes Somos</a>
          <a href="/blog" className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors">Blog</a>
          <a href="/contacto" className="text-[#1E40AF] font-medium">Contacto</a>
        </nav>

        {/* Menú Móvil*/}
        {isMenuOpen && (
          <div className="absolute top-20 left-0 right-0 bg-white border-b border-gray-200 md:hidden z-50 shadow-lg">
            <div className="flex flex-col space-y-0 p-4">
              <a 
                href="/" 
                className="flex items-center text-gray-700 hover:text-[#1E40AF] font-medium transition-colors py-3 px-4 border-b border-gray-100 hover:bg-blue-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-xl mr-3">🏠</span>
                Inicio
              </a>
              <a 
                href="/servicios" 
                className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors py-3 px-4 border-b border-gray-100 hover:bg-blue-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Servicios
              </a>
              <a 
                href="/quienes-somos" 
                className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors py-3 px-4 border-b border-gray-100 hover:bg-blue-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Quiénes Somos
              </a>
              <a 
                href="/blog" 
                className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors py-3 px-4 border-b border-gray-100 hover:bg-blue-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </a>
              <a 
                href="/contacto" 
                className="text-[#1E40AF] font-medium transition-colors py-3 px-4 hover:bg-blue-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section*/}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 sm:py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Contáctanos</h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            ¿Listo para optimizar tus costos en la nube? Hablemos sobre cómo podemos 
            ayudarte a transformar la gestión financiera de tu infraestructura cloud.
          </p>
        </div>
      </section>

      {/* Información de Contacto y Formulario */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            
            {/* Información de Contacto */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Hablemos de Tu Proyecto</h2>
              <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Estamos aquí para ayudarte a optimizar tus costos en la nube. 
                Agenda una consultoría gratuita y descubre cómo podemos reducir 
                tus gastos cloud mientras mejoramos el rendimiento.
              </p>

              <div className="space-y-4 sm:space-y-6">
                {/* WhatsApp */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-lg sm:text-xl">💬</span>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">WhatsApp</h4>
                    <p className="text-gray-600 mb-1 sm:mb-2 text-sm sm:text-base">Respuesta inmediata</p>
                    <a 
                      href="https://wa.me/56947788781" 
                      target="_blank"
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base"
                    >
                      +56 9 47788781
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-lg sm:text-xl">📧</span>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600 mb-1 sm:mb-2 text-sm sm:text-base">Respuesta en 24 horas</p>
                    <a 
                      href="mailto:contacto@finopslatam.com"
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base"
                    >
                      contacto@finopslatam.com
                    </a>
                  </div>
                </div>

                {/* LinkedIn */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-lg sm:text-xl">💼</span>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">LinkedIn</h4>
                    <p className="text-gray-600 mb-1 sm:mb-2 text-sm sm:text-base">Conecta con nosotros</p>
                    <a 
                      href="https://www.linkedin.com/company/finopslatam" 
                      target="_blank"
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base"
                    >
                      FinOpsLatam
                    </a>
                  </div>
                </div>

                {/* Horario */}
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-lg sm:text-xl">🕒</span>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Horario de Atención</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Lunes a Viernes: 9:00 - 18:00 hrs</p>
                  </div>
                </div>
              </div>

              {/* Llamadas a acción rápidas */}
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-100">
                <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">¿Necesitas una respuesta inmediata?</h4>
                <a
                  href="https://wa.me/56947788781?text=Hola,%20quiero%20información%20sobre%20FinOpsLatam"
                  target="_blank"
                  className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                >
                  <span className="mr-2">💬</span>
                  Chatear por WhatsApp
                </a>
              </div>
            </div>

            {/* Formulario de Contacto */}
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Solicita tu Consultoría Gratuita</h3>
              
              <form className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Empresa *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Servicio de Interés *
                  </label>
                  <select
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Selecciona un servicio</option>
                    <option value="auditoria">Auditoría de Costos</option>
                    <option value="dashboards">Dashboards y Reportes</option>
                    <option value="gobernanza">Gobernanza & Tagging</option>
                    <option value="optimizacion">Optimización Continua</option>
                    <option value="multiple">Múltiples Servicios</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="Cuéntanos sobre tu proyecto y necesidades específicas..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 sm:py-4 rounded-lg transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Enviar Solicitud
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Proceso de Contacto */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Nuestro Proceso de Contacto</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Así es como trabajamos contigo desde el primer contacto hasta la implementación
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Paso 1 */}
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white text-xl sm:text-2xl">1</span>
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Consulta Inicial</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Analizamos tus necesidades y objetivos específicos en una reunión de 30 minutos.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white text-xl sm:text-2xl">2</span>
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Análisis Preliminar</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Realizamos un diagnóstico gratuito de tus costos cloud actuales.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white text-xl sm:text-2xl">3</span>
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Propuesta Personalizada</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Creamos un plan de acción específico con estimación de ahorros.
              </p>
            </div>

            {/* Paso 4 */}
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white text-xl sm:text-2xl">4</span>
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Implementación</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Ejecutamos las optimizaciones y establecemos monitoreo continuo.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Preguntas Frecuentes</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Resolvemos tus dudas más comunes sobre nuestros servicios
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                ¿Cuánto tiempo toma ver resultados después de implementar FinOps?
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                La mayoría de nuestros clientes ven reducciones significativas en sus costos cloud 
                durante los primeros 30-60 días. Las optimizaciones iniciales suelen generar ahorros 
                inmediatos, mientras que las estrategias a largo plazo se implementan en los primeros 3 meses.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                ¿Qué información necesitan para realizar la auditoría inicial?
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Solo necesitamos acceso de solo lectura a tus reportes de costos de AWS (CUR) 
                y métricas básicas de uso. No requerimos acceso a tu infraestructura ni datos sensibles. 
                Todo el proceso se realiza bajo estrictos protocolos de seguridad y confidencialidad.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                ¿Trabajan con empresas de todos los tamaños?
              </h4>
              <p className="text-gray-600 text-sm sm:text-base">
                Sí, trabajamos desde startups y pymes. Nuestras soluciones 
                son escalables y nos adaptamos a las necesidades específicas de cada cliente. 
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Llamado Final a la Acción */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">¿Listo para Comenzar?</h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Agenda tu consultoría gratuita hoy mismo y descubre cómo podemos ayudarte 
            a reducir tus costos cloud mientras mejoramos el rendimiento.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="https://wa.me/56947788781?text=Hola,%20quiero%20agendar%20una%20consultoría%20gratuita%20de%20FinOps"
              target="_blank"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Agenda por WhatsApp
            </a>
            <a
              href="mailto:contacto@finopslatam.com?subject=Consultoría FinOps Gratuita"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors text-sm sm:text-base"
            >
              Enviar Email
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 pt-8 border-t border-gray-800">
        <div className="flex justify-center gap-4 sm:gap-6 pb-6">
          <a 
            href="https://wa.me/56947788781" 
            target="_blank" 
            className="hover:text-blue-400 transition text-xl sm:text-2xl"
          >
            💬
          </a>
          <a 
            href="mailto:contacto@finopslatam.com" 
            className="hover:text-blue-400 transition text-xl sm:text-2xl"
          >
            📧
          </a>
          <a 
            href="https://www.linkedin.com/company/finopslatam" 
            target="_blank" 
            className="hover:text-blue-400 transition text-xl sm:text-2xl"
          >
            💼
          </a>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <a href="/">
                <img 
                  src="/logo2.png" 
                  alt="FinOpsLatam Logo" 
                  className="h-10 sm:h-12 w-auto mb-3 sm:mb-4"
                />
              </a>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-xs">
                Expertos en Optimización de Costos en la Nube, 
                automatización FinOps y control financiero para AWS.
              </p>
            </div>

            <div>
              <h3 className="text-white text-sm font-semibold mb-3 sm:mb-4">Navegación</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li><a href="/" className="hover:text-blue-400 transition-colors text-sm">Inicio</a></li>
                <li><a href="/servicios" className="hover:text-blue-400 transition-colors text-sm">Servicios</a></li>
                <li><a href="/quienes-somos" className="hover:text-blue-400 transition-colors text-sm">Quiénes somos</a></li>
                <li><a href="/blog" className="hover:text-blue-400 transition-colors text-sm">Blog</a></li>
                <li><a href="/contacto" className="hover:text-blue-400 transition-colors text-sm">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white text-sm font-semibold mb-3 sm:mb-4">Contacto</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li className="text-sm">Email: <a href="mailto:contacto@finopslatam.com" className="hover:text-blue-400 transition-colors">contacto@finopslatam.com</a></li>
                <li className="text-sm">WhatsApp: <a href="https://wa.me/56947788781" className="hover:text-blue-400 transition-colors">+56 9 47788781</a></li>
                <li className="text-sm">LinkedIn: <a href="https://www.linkedin.com/company/finopslatam" className="hover:text-blue-400 transition-colors">FinOpsLatam</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center text-xs sm:text-sm text-gray-600 py-4 sm:py-6 border-t border-gray-800">
          © {new Date().getFullYear()} FinOpsLatam — Todos los derechos reservados
        </div>
      </footer>
    </main>
  );
}