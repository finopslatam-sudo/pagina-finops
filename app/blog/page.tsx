'use client';

import PublicNavbar from '@/app/components/layout/PublicNavbar';

export default function Blog() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* ✅ NAVBAR GLOBAL CON LOGIN */}
      <PublicNavbar />

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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Artículos Destacados
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Contenido exclusivo sobre FinOps, optimización cloud y transformación digital
            </p>
          </div>

          {/* TODO: el resto de tu contenido queda EXACTAMENTE IGUAL */}
        </div>
      </section>

      {/* FOOTER (SIN CAMBIOS) */}
      <footer className="bg-gray-900 text-gray-400 pt-8 border-t border-gray-800">
        <div className="text-center text-xs sm:text-sm text-gray-600 py-4 sm:py-6 border-t border-gray-800">
          © {new Date().getFullYear()} FinOpsLatam — Todos los derechos reservados
        </div>
      </footer>

    </main>
  );
}