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

      {/* cambiar desde aqui */}
      {/* ❌ NAVBAR y LOGIN ELIMINADOS (ahora viven en layout.tsx) */}
      {/* hasta aqui */}

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>

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
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              Conocer Servicios
            </a>
          </div>
        </div>
      </section>

      {/* DASHBOARD SECTION */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <AnimatedCounter target={40} suffix="+" />
              <p className="text-gray-600 mt-2">Ahorro en costos</p>
            </div>
            <div>
              <AnimatedCounter target={99} />
              <p className="text-gray-600 mt-2">Clientes satisfechos</p>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                24/7
              </span>
              <p className="text-gray-600 mt-2">Monitoreo continuo</p>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold mb-4 text-gray-900">
            Servicios FinOps
          </h3>
          <p className="text-xl text-gray-600">
            Soluciones completas para la optimización de costos cloud
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 pt-8 border-t border-gray-800">
        <div className="text-center text-sm text-gray-600 py-6">
          © {new Date().getFullYear()} FinOpsLatam — Todos los derechos reservados
        </div>
      </footer>
    </main>
  );
}
