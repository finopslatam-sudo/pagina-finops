export default function DashboardPreview() {
  return (
    <section className="px-4 lg:px-6 py-10 lg:py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Columna izquierda */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">NOTICIAS DE NEGOCIOS</h3>
              <div className="space-y-4">
                {[
                  { letter: 'A', gradient: 'from-blue-500 to-indigo-600', label: 'Agente contable', value: '23', sub: 'Transacciones categorizadas' },
                  { letter: 'F', gradient: 'from-green-500 to-emerald-600', label: 'Agente financiero', value: '4,733', sub: 'Gastos controlados' },
                  { letter: 'C', gradient: 'from-purple-500 to-pink-600', label: 'Agente de atención al cliente', value: '3', sub: 'Nuevos leads para revisar' },
                ].map((item) => (
                  <div key={item.letter} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${item.gradient} rounded-lg flex items-center justify-center`}>
                        <span className="text-white text-sm font-bold">{item.letter}</span>
                      </div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                      <p className="text-sm text-gray-500">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">PERSPECTIVAS</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[['10', 'Otras propuestas'], ['7', 'Contratos activos'], ['3', 'Proyectos activos']].map(([v, l]) => (
                  <div key={l} className="text-center p-4 bg-white rounded-xl border border-gray-200">
                    <p className="text-2xl font-bold text-gray-900">{v}</p>
                    <p className="text-sm text-gray-500 mt-1">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">RESUMEN DE CUENTAS</h3>
              <div className="space-y-6">
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
                <div className="rounded-xl overflow-hidden">
                  <img src="/ima1.png" alt="Dashboard FinOps" className="w-full h-auto rounded-lg shadow-lg" />
                </div>
              </div>
            </div>

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
  );
}
