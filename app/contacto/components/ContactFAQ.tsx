const FAQS = [
  {
    q: '¿Cuánto tiempo toma ver resultados después de implementar FinOps?',
    a: 'La mayoría de nuestros clientes ven reducciones significativas en sus costos cloud durante los primeros 30-60 días. Las optimizaciones iniciales suelen generar ahorros inmediatos, mientras que las estrategias a largo plazo se implementan en los primeros 3 meses.',
  },
  {
    q: '¿Qué información necesitan para realizar la auditoría inicial?',
    a: 'Solo necesitamos acceso de solo lectura a tus reportes de costos de AWS (CUR) y métricas básicas de uso. No requerimos acceso a tu infraestructura ni datos sensibles. Todo el proceso se realiza bajo estrictos protocolos de seguridad y confidencialidad.',
  },
  {
    q: '¿Con que tipo de empresas Trabajan?',
    a: 'Trabajamos desde startups y pymes. Nuestras soluciones son escalables y nos adaptamos a las necesidades específicas de cada cliente.',
  },
];

export default function ContactFAQ() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Preguntas Frecuentes</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Resolvemos tus dudas más comunes sobre nuestros servicios
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {FAQS.map(faq => (
            <div key={faq.q} className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-200">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{faq.q}</h4>
              <p className="text-gray-600 text-sm sm:text-base">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
