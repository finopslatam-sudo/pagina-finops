'use client';

import { useState } from 'react';

export default function QuienesSomos() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-gray-900">
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
          <a href="/quienes-somos" className="text-[#1E40AF] font-medium">Quiénes Somos</a>
          <a href="/blog" className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors">Blog</a>
          <a href="/contacto" className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors">Contacto</a>
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
                className="text-[#1E40AF] font-medium transition-colors py-3 px-4 border-b border-gray-100 hover:bg-blue-50 rounded-lg"
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
                className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors py-3 px-4 hover:bg-blue-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 sm:py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Quiénes Somos</h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Líderes en transformación financiera digital, combinando expertise en FinOps, 
            Cloud y Data Analytics para revolucionar la gestión de costos en la nube.
          </p>
        </div>
      </section>

      {/* Misión, Visión y Valores */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Misión */}
            <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-white text-xl sm:text-2xl">🎯</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Nuestra Misión</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Empoderar a las empresas con soluciones inteligentes de gestión de costos en la nube, 
                permitiéndoles maximizar su inversión tecnológica mientras mantienen el control financiero total.
              </p>
            </div>

            {/* Visión */}
            <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-white text-xl sm:text-2xl">🚀</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Nuestra Visión</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Ser el partner estratégico líder en Latinoamérica para la optimización de costos en la nube, 
                transformando la manera en que las empresas gestionan sus recursos digitales.
              </p>
            </div>

            {/* Valores */}
            <div className="text-center p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <span className="text-white text-xl sm:text-2xl">💎</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Nuestros Valores</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Transparencia absoluta, innovación continua, excelencia operativa y compromiso 
                con el éxito de nuestros clientes. Tu crecimiento es nuestro éxito.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Nuestro Equipo */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Nuestro Equipo de Expertos</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Combinamos décadas de experiencia en cloud, finanzas y tecnología para ofrecerte las mejores soluciones.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Experto 1 */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-white text-xl sm:text-2xl">👨‍💼</span>
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Expertos en FinOps</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Certificaciones implementación práctica del Framework FinOps.
              </p>
            </div>

            {/* Experto 2 */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-white text-xl sm:text-2xl">📊</span>
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Analistas de Datos</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Especialistas en Business Intelligence y visualización de datos.
              </p>
            </div>

            {/* Experto 3 */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-white text-xl sm:text-2xl">⚙️</span>
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Ingenieros Cloud</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Profesionales de soluciones escalables y optimizadas en la nube.
              </p>
            </div>

            {/* Experto 4 */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-white text-xl sm:text-2xl">🎯</span>
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Consultores Estratégicos</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Expertos en transformación digital y estrategias de optimización.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">¿Por Qué Elegir FinOpsLatam?</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Más de 10 razones por las que somos tu mejor opción para la gestión de costos en la nube
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Columna izquierda */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-lg sm:text-xl">✓</span>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Expertise Comprobado</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    +10 proyectos exitosos en optimización de costos cloud across industrias.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 text-lg sm:text-xl">📈</span>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Resultados Medibles</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Promedio de 20-40% de reducción en costos cloud durante los primeros 6 meses.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 text-lg sm:text-xl">🔒</span>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Seguridad Garantizada</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Cumplimiento con estándares internacionales de seguridad y privacidad de datos.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 text-lg sm:text-xl">🌎</span>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Cobertura Regional</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Servicios en toda Latinoamérica con entendimiento local de cada mercado.
                  </p>
                </div>
              </div>

            </div>

            {/* Columna derecha */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 text-lg sm:text-xl">⚡</span>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Implementación Rápida</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Primeros resultados visibles en menos de 30 días desde el inicio del proyecto.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-pink-600 text-lg sm:text-xl">🔄</span>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Soporte Continuo</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Monitoreo 24/7 y optimización continua de tus recursos en la nube.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-teal-600 text-lg sm:text-xl">🎓</span>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Certificaciones</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Equipo certificado en AWS y prácticas FinOps.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-lg sm:text-xl">💼</span>
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Enfoque Empresarial</h4>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Soluciones escalables desde startups hasta grandes corporaciones.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Métricas de Impacto */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 sm:mb-16">Nuestro Impacto en Números</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">+10</div>
              <div className="text-blue-200 text-sm sm:text-base">Proyectos Exitosos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">20-40%</div>
              <div className="text-blue-200 text-sm sm:text-base">Ahorro Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">99,9%</div>
              <div className="text-blue-200 text-sm sm:text-base">Clientes Satisfechos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">24/7</div>
              <div className="text-blue-200 text-sm sm:text-base">Soporte Continuo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Llamado a la acción */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
            ¿Listo para Transformar la Gestión de Tus Costos en la Nube?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Únete a las empresas que ya están optimizando sus recursos cloud y maximizando su ROI con nuestras soluciones.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="https://wa.me/56965090121?text=Hola,%20quiero%20más%20información%20sobre%20FinOpsLatam"
              target="_blank"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Agenda una Consultoría Gratuita
            </a>
            <a
              href="/contacto"
              className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors text-sm sm:text-base"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 pt-8 border-t border-gray-800">
        <div className="flex justify-center gap-4 sm:gap-6 pb-6">
          <a 
            href="https://wa.me/56965090121"
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
                <li className="text-sm">WhatsApp: <a href="https://wa.me/56965090121" className="hover:text-blue-400 transition-colors">+56 9 65090121</a></li>
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