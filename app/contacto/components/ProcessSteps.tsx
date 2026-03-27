const STEPS = [
  { num: 1, title: 'Consulta Inicial', desc: 'Analizamos tus necesidades y objetivos específicos en una reunión de 30 minutos.', gradient: 'from-blue-500 to-indigo-600' },
  { num: 2, title: 'Análisis Preliminar', desc: 'Realizamos un diagnóstico gratuito de tus costos cloud actuales.', gradient: 'from-indigo-500 to-purple-600' },
  { num: 3, title: 'Propuesta Personalizada', desc: 'Creamos un plan de acción específico con estimación de ahorros.', gradient: 'from-purple-500 to-pink-600' },
  { num: 4, title: 'Implementación', desc: 'Ejecutamos las optimizaciones y establecemos monitoreo continuo.', gradient: 'from-green-500 to-emerald-600' },
];

export default function ProcessSteps() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Nuestro Proceso de Contacto
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Así es como trabajamos contigo desde el primer contacto hasta la implementación
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STEPS.map(s => (
            <div key={s.num} className="text-center">
              <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${s.gradient} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                <span className="text-white text-xl sm:text-2xl">{s.num}</span>
              </div>
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">{s.title}</h4>
              <p className="text-gray-600 text-xs sm:text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
