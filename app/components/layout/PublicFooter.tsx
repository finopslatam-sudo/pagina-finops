import Link from 'next/link';

export default function PublicFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-8 border-t border-gray-800">
      <div className="flex justify-center gap-6 pb-6">
        <a href="https://wa.me/56965090121" target="_blank" className="hover:text-blue-400 transition text-2xl">💬</a>
        <a href="mailto:contacto@finopslatam.com" className="hover:text-blue-400 transition text-2xl">📧</a>
        <a href="https://www.linkedin.com/company/finopslatam" target="_blank" className="hover:text-blue-400 transition text-2xl">💼</a>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/">
              <img src="/logo2.png" alt="FinOpsLatam Logo" className="h-12 w-auto mb-4" />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Expertos en Optimización de Costos en la Nube,
              automatización FinOps y control financiero para AWS.
            </p>
          </div>

          <div>
            <h3 className="text-white text-sm font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Inicio</Link></li>
              <li><Link href="/servicios" className="hover:text-blue-400 transition-colors">Servicios</Link></li>
              <li><Link href="/finops-chile" className="hover:text-blue-400 transition-colors">FinOps Chile</Link></li>
              <li><Link href="/finops-latinoamerica" className="hover:text-blue-400 transition-colors">FinOps LATAM</Link></li>
              <li><Link href="/quienes-somos" className="hover:text-blue-400 transition-colors">Quiénes Somos</Link></li>
              <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              <li><Link href="/contacto" className="hover:text-blue-400 transition-colors">Contacto</Link></li>
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
  );
}
