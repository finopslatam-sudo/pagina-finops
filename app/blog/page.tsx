'use client';

import { useState } from 'react';

export default function Blog() {
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
          <a href="/quienes-somos" className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors">Quiénes Somos</a>
          <a href="/blog" className="text-[#1E40AF] font-medium">Blog</a>
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
                className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors py-3 px-4 border-b border-gray-100 hover:bg-blue-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Quiénes Somos
              </a>
              <a 
                href="/blog" 
                className="text-[#1E40AF] font-medium transition-colors py-3 px-4 border-b border-gray-100 hover:bg-blue-50 rounded-lg"
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

      {/* Hero Section*/}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 sm:py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Blog FinOps</h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Descubre las últimas tendencias, mejores prácticas y estrategias avanzadas 
            para optimizar tus costos en la nube y maximizar tu ROI.
          </p>
        </div>
      </section>

      {/* Artículos Destacados */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Artículos Destacados</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Contenido exclusivo sobre FinOps, optimización cloud y transformación digital
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            
            {/* Artículo Principal */}
            <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="h-48 sm:h-64 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-4xl sm:text-6xl">📊</span>
              </div>
              <div className="p-4 sm:p-8">
                <div className="flex items-center mb-3 sm:mb-4">
                  <span className="bg-blue-100 text-blue-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">FinOps</span>
                  <span className="text-gray-500 text-xs sm:text-sm ml-3 sm:ml-4">15 Enero 2025</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  10 Estrategias Comprobadas para Reducir Tus Costos AWS en 2025
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Descubre las técnicas más efectivas que las empresas líderes están implementando 
                  para optimizar sus gastos en la nube sin comprometer el rendimiento.
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center text-sm sm:text-base">
                  Leer artículo completo
                  <span className="ml-2">→</span>
                </a>
              </div>
            </div>

            {/* Segundo Artículo Destacado */}
            <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="h-48 sm:h-64 bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                <span className="text-white text-4xl sm:text-6xl">🚀</span>
              </div>
              <div className="p-4 sm:p-8">
                <div className="flex items-center mb-3 sm:mb-4">
                  <span className="bg-green-100 text-green-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">Optimización</span>
                  <span className="text-gray-500 text-xs sm:text-sm ml-3 sm:ml-4">12 Enero 2025</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Cómo Implementar Framework FinOps en Tu Organización: Guía Paso a Paso
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Aprende a establecer una cultura FinOps sólida que permita a tu empresa 
                  tomar decisiones informadas sobre el gasto cloud.
                </p>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center text-sm sm:text-base">
                  Leer artículo completo
                  <span className="ml-2">→</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Todos los Artículos */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">Todos los Artículos</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            
            {/* Artículo 1 */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-white text-xl sm:text-2xl">🏷️</span>
              </div>
              <div className="flex items-center mb-2 sm:mb-3">
                <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-semibold">Tagging</span>
                <span className="text-gray-500 text-xs ml-2">10 Enero 2025</span>
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                La Importancia del Tagging Consistente en AWS
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                Cómo un sistema de etiquetado robusto puede mejorar tu visibilidad de costos en un 40%.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-semibold">
                Leer más →
              </a>
            </div>

            {/* Artículo 2 */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-white text-xl sm:text-2xl">💰</span>
              </div>
              <div className="flex items-center mb-2 sm:mb-3">
                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-semibold">Ahorro</span>
                <span className="text-gray-500 text-xs ml-2">8 Enero 2025</span>
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                5 Herramientas Gratuitas para Monitorear Costos AWS
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                Descubre herramientas que te ayudarán a mantener el control de tus gastos cloud sin costo adicional.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-semibold">
                Leer más →
              </a>
            </div>

            {/* Artículo 3 */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-white text-xl sm:text-2xl">📈</span>
              </div>
              <div className="flex items-center mb-2 sm:mb-3">
                <span className="bg-teal-100 text-teal-600 px-2 py-1 rounded text-xs font-semibold">Dashboard</span>
                <span className="text-gray-500 text-xs ml-2">5 Enero 2025</span>
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                Creando Dashboards Efectivos para Costos Cloud
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                Guía práctica para diseñar dashboards que realmente impulsen la toma de decisiones.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-semibold">
                Leer más →
              </a>
            </div>

            {/* Artículo 4 */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-white text-xl sm:text-2xl">🔧</span>
              </div>
              <div className="flex items-center mb-2 sm:mb-3">
                <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded text-xs font-semibold">Automatización</span>
                <span className="text-gray-500 text-xs ml-2">3 Enero 2025</span>
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                Automatización de Optimizaciones en AWS Lambda
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                Cómo configurar procesos automáticos para optimizar tus funciones Lambda y ahorrar hasta 60%.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-semibold">
                Leer más →
              </a>
            </div>

            {/* Artículo 5 */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-white text-xl sm:text-2xl">🏢</span>
              </div>
              <div className="flex items-center mb-2 sm:mb-3">
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-semibold">Cultura</span>
                <span className="text-gray-500 text-xs ml-2">1 Enero 2025</span>
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                Construyendo una Cultura FinOps en Tu Empresa
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                Estrategias para involucrar a todos los departamentos en la gestión eficiente de costos cloud.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-semibold">
                Leer más →
              </a>
            </div>

            {/* Artículo 6 */}
            <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-white text-xl sm:text-2xl">📊</span>
              </div>
              <div className="flex items-center mb-2 sm:mb-3">
                <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded text-xs font-semibold">Reportes</span>
                <span className="text-gray-500 text-xs ml-2">28 Dic 2024</span>
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                Mejores Prácticas para Reportes de Costos Ejecutivos
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                Cómo presentar datos de costos cloud a la alta dirección de manera efectiva.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-semibold">
                Leer más →
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Categorías del Blog */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Explora por Categorías</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Encuentra contenido específico según tus intereses y necesidades
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-100 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-white text-lg sm:text-xl">📊</span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">FinOps</h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">12 artículos</p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-green-50 rounded-lg sm:rounded-xl border border-green-100 hover:border-green-300 transition-colors cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-white text-lg sm:text-xl">🔧</span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Optimización</h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">8 artículos</p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-purple-50 rounded-lg sm:rounded-xl border border-purple-100 hover:border-purple-300 transition-colors cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-white text-lg sm:text-xl">🏷️</span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Tagging</h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">6 artículos</p>
            </div>

            <div className="text-center p-4 sm:p-6 bg-orange-50 rounded-lg sm:rounded-xl border border-orange-100 hover:border-orange-300 transition-colors cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <span className="text-white text-lg sm:text-xl">📈</span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Dashboards</h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">5 artículos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">No Te Pierdas Nuestros Próximos Artículos</h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Suscríbete a nuestro newsletter y recibe contenido exclusivo sobre FinOps y optimización cloud directamente en tu email.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Tu email corporativo"
              className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-gray-900 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors shadow-lg text-sm sm:text-base">
              Suscribirse
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER*/}
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