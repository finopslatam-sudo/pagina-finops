'use client';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* NAVBAR */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
	<img 
	  src="/logo2.png" 
	  alt="FinOpsLatam Logo" 
	  className="h-24 w-auto"
	/>
        <nav className="space-x-6">
          <a href="#servicios" className="hover:text-emerald-400">Servicios</a>
          <a href="#sobre-mi" className="hover:text-emerald-400">Quiénes somos</a>
          <a href="#contacto" className="hover:text-emerald-400">Contacto</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="text-center py-28 px-6">
        <h2 className="text-4xl font-bold mb-4">
          Optimización de Costos en la Nube
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Ayudo a empresas a controlar, visualizar y reducir sus costos en AWS 
          aplicando mejores prácticas FinOps y automatización.
        </p>

        <a
          href="https://wa.me/56947788781?text=Hola,%20quiero%20información%20sobre%20FinOpsLatam"
          target="_blank"
          className="inline-block mt-8 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-3 rounded-xl"
        >
          Hablar por WhatsApp
        </a>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="px-6 py-20 max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold mb-10">Servicios FinOps</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h4 className="text-xl font-semibold mb-2">Auditoría de Costos</h4>
            <p className="text-gray-400">
              Revisión completa de tu infraestructura para detectar fugas de costos y oportunidades de ahorro.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h4 className="text-xl font-semibold mb-2">Dashboards y Reportes</h4>
            <p className="text-gray-400">
              Integraciones con AWS, CUR, Grafana y Power BI para visibilidad en tiempo real.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h4 className="text-xl font-semibold mb-2">Gobernanza & Tagging</h4>
            <p className="text-gray-400">
              Implementación de políticas de etiquetado y mejores prácticas para control financiero.
            </p>
          </div>
        </div>
      </section>

      {/* SOBRE MI */}
      <section id="sobre-mi" className="px-6 py-20 max-w-4xl mx-auto">
        <h3 className="text-3xl font-bold mb-6">Quiénes somos</h3>
        <p className="text-gray-300 leading-relaxed">
        En FinOpsLatam combinamos experiencia en FinOps, DevOps y DataOps para ayudarte a controlar tus gastos en la nube. Nuestra misión es reducir costos de manera sostenible, sin comprometer la eficiencia de tus servicios.
        </p>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="px-6 py-20 text-center">
        <h3 className="text-3xl font-bold mb-6">Contacto</h3>
        <p className="text-gray-400 mb-4">Correo: contacto@finopslatam.com</p>

        <a
          href="https://wa.me/56947788781"
          target="_blank"
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-6 py-3 rounded-xl"
        >
          Escribir por WhatsApp
        </a>
      </section>

	<footer className="bg-black text-gray-400 pt-6 border-t border-gray-800">

  {/* 🔷 BARRA SUPERIOR DE ICONOS */}
  <div className="flex justify-center gap-6 pb-4">
    {/* WhatsApp */}
    <a 
      href="https://wa.me/569XXXXXXXX" 
      target="_blank" 
      className="hover:text-emerald-400 transition"
    >
      <span className="text-xl">💬</span>
    </a>

    {/* Email */}
    <a 
      href="mailto:contacto@finopslatam.com" 
      className="hover:text-emerald-400 transition"
    >
      <span className="text-xl">📧</span>
    </a>

    {/* LinkedIn */}
    <a 
      href="https://www.linkedin.com/company/finopslatam" 
      target="_blank" 
      className="hover:text-emerald-400 transition"
    >
      <span className="text-xl">��</span>
    </a>
  </div>

  {/* 🔷 CONTENIDO PRINCIPAL */}
  <div className="max-w-6xl mx-auto px-6 py-8">

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

      {/* LOGO + DESCRIPCION */}
      <div className="flex flex-col items-center md:items-start">
        <img 
          src="/logo2.png" 
          alt="FinOpsLatam Logo" 
          className="h-12 w-auto mb-3"
        />
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
          Expertos en Optimización de Costos en la Nube, 
          automatización FinOps y control financiero para AWS.
        </p>
      </div>

      {/* LINKS DE NAVEGACIÓN */}
      <div>
        <h3 className="text-white text-sm font-semibold mb-3">Navegación</h3>
        <ul className="space-y-2">
          <li><a href="#servicios" className="hover:text-emerald-400">Servicios</a></li>
          <li><a href="#sobre-mi" className="hover:text-emerald-400">Quiénes somos</a></li>
          <li><a href="#contacto" className="hover:text-emerald-400">Contacto</a></li>
        </ul>
      </div>

      {/* CONTACTO DIRECTO */}
      <div>
        <h3 className="text-white text-sm font-semibold mb-3">Contacto</h3>
        <ul className="space-y-2">
          <li>Email: <a href="mailto:contacto@finopslatam.com" className="hover:text-emerald-400">contacto@finopslatam.com</a></li>
          <li>WhatsApp: <a href="https://wa.me/569XXXXXXXX" className="hover:text-emerald-400">+56 9 47788781</a></li>
          <li>LinkedIn: <a href="https://www.linkedin.com/company/finopslatam" className="hover:text-emerald-400">FinOpsLatam</a></li>
        </ul>
      </div>

    </div>
  </div>

  {/* COPYRIGHT */}
  <div className="text-center text-xs text-gray-600 py-5 border-t border-gray-800">
    © {new Date().getFullYear()} FinOpsLatam — Todos los derechos reservados
  </div>

</footer>

    </main>
  );

}

