export default function ContactInfo() {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Hablemos de Tu Proyecto</h2>
      <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
        Estamos aquí para ayudarte a optimizar tus costos en la nube.
        Agenda una consultoría gratuita y descubre cómo podemos reducir
        tus gastos cloud mientras mejoramos el rendimiento.
      </p>

      <div className="space-y-4 sm:space-y-6">
        {[
          { icon: '💬', bg: 'bg-green-100', color: 'text-green-600', title: 'WhatsApp', sub: 'Respuesta inmediata',
            href: 'https://wa.me/56965090121', label: '+56 9 65090121', external: true },
          { icon: '📧', bg: 'bg-blue-100', color: 'text-blue-600', title: 'Email', sub: 'Respuesta en 24 horas',
            href: 'mailto:contacto@finopslatam.com', label: 'contacto@finopslatam.com', external: false },
          { icon: '💼', bg: 'bg-blue-100', color: 'text-blue-600', title: 'LinkedIn', sub: 'Conecta con nosotros',
            href: 'https://www.linkedin.com/company/finopslatam', label: 'FinOpsLatam', external: true },
          { icon: '🕒', bg: 'bg-purple-100', color: 'text-purple-600', title: 'Horario de Atención',
            sub: 'Lunes a Viernes: 9:00 - 18:00 hrs', href: null, label: null, external: false },
        ].map((item) => (
          <div key={item.title} className="flex items-start space-x-3 sm:space-x-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <span className={`${item.color} text-lg sm:text-xl`}>{item.icon}</span>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-gray-600 mb-1 sm:mb-2 text-sm sm:text-base">{item.sub}</p>
              {item.href && item.label && (
                <a
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base"
                >
                  {item.label}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-100">
        <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">¿Necesitas una respuesta inmediata?</h4>
        <a
          href="https://wa.me/56965090121?text=Hola,%20quiero%20información%20sobre%20FinOpsLatam"
          target="_blank"
          className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
        >
          <span className="mr-2">💬</span>
          Chatear por WhatsApp
        </a>
      </div>
    </div>
  );
}
