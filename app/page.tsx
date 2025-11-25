'use client';

import { useEffect, useState } from 'react';
import LoginModal from './components/Auth/LoginModal';

// Componente de contador animado
function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
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
      {suffix}{count}{suffix ? '' : '%'}
    </span>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* NAVBAR MEJORADO - SEPARACIÓN CLARA EN MÓVIL */}
      <header className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {/* Contenedor principal del navbar */}
          <div className="flex items-center justify-between relative">
            
            {/* 🔐 BOTÓN LOGIN - IZQUIERDA (SOLO MÓVIL) */}
            <div className="md:hidden flex-shrink-0 z-20">
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow-md text-sm"
              >
                Login
              </button>
            </div>

            {/* 🎯 LOGO - CENTRO ABSOLUTO */}
            <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
              <a href="/">
                <img 
                  src="/logo2.png" 
                  alt="FinOpsLatam Logo" 
                  className="h-16 md:h-24 w-auto cursor-pointer"
                />
              </a>
            </div>

            {/* 🍔 BOTÓN HAMBURGUESA - DERECHA (SOLO MÓVIL) */}
            <div className="md:hidden flex-shrink-0 z-20">
              <button 
                className="p-3 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="w-6 h-0.5 bg-gray-700 mb-1.5 transition-transform"></div>
                <div className="w-6 h-0.5 bg-gray-700 mb-1.5 transition-transform"></div>
                <div className="w-6 h-0.5 bg-gray-700 transition-transform"></div>
              </button>
            </div>

            {/* 💻 ESCRITORIO: LOGO + NAV + LOGIN DROPDOWN */}
            <div className="hidden md:flex md:items-center md:justify-between md:w-full">
              
              {/* Logo para desktop */}
              <a href="/" className="flex-shrink-0">
                <img 
                  src="/logo2.png" 
                  alt="FinOpsLatam Logo" 
                  className="h-24 w-auto"
                />
              </a>

              {/* Navegación Desktop */}
              <nav className="flex items-center space-x-8 mx-8">
                <a href="/" className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors">Inicio</a>
                <a href="/servicios" className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors">Servicios</a>
                <a href="/quienes-somos" className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors">Quiénes Somos</a>
                <a href="/blog" className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors">Blog</a>
                <a href="/contacto" className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors">Contacto</a>
              </nav>

              {/* Login Dropdown Desktop */}
              <div className="relative flex-shrink-0">
                <button 
                  onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                  className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-semibold px-6 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md flex items-center space-x-2"
                >
                  <span>Login</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isLoginDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isLoginDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <button 
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsLoginDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors rounded-t-lg"
                    >
                      Portal de Socios
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Menú Móvil Desplegable */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 md:hidden z-50 shadow-lg">
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
                  className="text-gray-700 hover:text-[#1E40AF] font-medium transition-colors py-3 px-4 border-b border-gray-100 hover:bg-blue-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contacto
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* LOGIN MODAL */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

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
                      src="/dash.png" 
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

      {/* SERVICIOS */}
      <section id="servicios" className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 text-gray-900">Servicios FinOps</h3>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Soluciones completas para la gestión y optimización de costos en la nube
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-white text-xl">📊</span>
            </div>
            <h4 className="text-xl font-semibold mb-4 text-gray-900">Auditoría de Costos</h4>
            <p className="text-gray-600 leading-relaxed">
              Revisión completa de tu infraestructura para detectar fugas de costos y oportunidades de ahorro.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-white text-xl">📈</span>
            </div>
            <h4 className="text-xl font-semibold mb-4 text-gray-900">Dashboards y Reportes</h4>
            <p className="text-gray-600 leading-relaxed">
              Integraciones con AWS, CUR, Grafana y Power BI para visibilidad en tiempo real.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-white text-xl">🏷️</span>
            </div>
            <h4 className="text-xl font-semibold mb-4 text-gray-900">Gobernanza & Tagging</h4>
            <p className="text-gray-600 leading-relaxed">
              Implementación de políticas de etiquetado y mejores prácticas para control financiero.
            </p>
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