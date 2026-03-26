'use client';

import { useEffect, useState } from 'react';
import ServicesSection from './components/ServicesSection';
import DashboardPreview from './components/DashboardPreview';

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

        <div className="relative text-center max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Optimización de Costos en la Nube
          </h1>
          <p className="text-base sm:text-xl text-blue-100 mb-8 leading-relaxed">
            Ayudamos a empresas a controlar, visualizar y optimizar sus costos en AWS
            aplicando mejores prácticas FinOps y análisis estratégico basado en datos.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
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

      <DashboardPreview />

      <ServicesSection />

      {/* SOBRE MI */}
      <section id="sobre-mi" className="px-4 lg:px-6 py-14 lg:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl lg:text-4xl font-bold mb-8 text-gray-900 text-center">Quiénes somos</h3>
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
      <section id="contacto" className="px-4 lg:px-6 py-14 lg:py-20 text-center bg-white">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl lg:text-4xl font-bold mb-6 text-gray-900">Contacto</h3>
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
