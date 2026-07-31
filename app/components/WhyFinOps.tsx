'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const WASTE_DATA = [
  { name: 'Gasto desperdiciado', value: 29 },
  { name: 'Gasto con visibilidad y control', value: 71 },
];
const WASTE_COLORS = ['#f87171', '#34d399'];

const STATS = [
  {
    value: '29%',
    label: 'del gasto en la nube se desperdicia hoy, según la industria',
    source: 'Flexera, State of the Cloud Report 2026',
  },
  {
    value: 'US$83.000M+',
    label: 'en gasto cloud analizado en la última encuesta a equipos FinOps',
    source: 'FinOps Foundation, State of FinOps 2026 (1.192 organizaciones)',
  },
  {
    value: '98%',
    label: 'de los equipos FinOps ya gestionan también el costo de IA (era 31% hace 2 años)',
    source: 'FinOps Foundation, State of FinOps 2026',
  },
];

const REASONS = [
  {
    icon: '📊',
    title: 'Visibilidad completa, en español',
    text: 'Dashboards de costos, hallazgos y reportes ejecutivos pensados para que cualquier área de tu empresa entienda en qué se gasta cada dólar, no solo el equipo cloud.',
  },
  {
    icon: '⚙️',
    title: 'Optimización continua',
    text: 'Recomendaciones de rightsizing, cobertura de Reserved Instances y Savings Plans, y alertas automáticas que detectan desviaciones antes de que impacten tu factura.',
  },
  {
    icon: '🛡️',
    title: 'Riesgo y cumplimiento bajo control',
    text: 'Snapshots históricos de riesgo, compliance gauge y gobernanza multi-cuenta para que la optimización nunca comprometa la seguridad.',
  },
  {
    icon: '🌎',
    title: 'Soporte real en tu huso horario',
    text: 'Mesa de tickets y acompañamiento en español, pensado para equipos de LatAm — sin esperar respuestas en otro idioma ni otro horario.',
  },
  {
    icon: '✅',
    title: 'Un solo plan, todo incluido',
    text: 'FinOps Enterprise completo desde el día uno: sin letra chica ni funcionalidades bloqueadas detrás de un upgrade.',
  },
  {
    icon: '👩‍💻',
    title: 'Talento TI para ejecutar',
    text: 'Cuando la plataforma detecta algo que requiere desarrollo, tienes equipo Backend, Frontend, Fullstack y QA disponible para ejecutarlo contigo.',
  },
];

export default function WhyFinOps() {
  return (
    <section className="px-4 lg:px-6 py-14 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* HEADLINE */}
        <div className="text-center mb-12 lg:mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl lg:text-4xl font-bold mb-4 text-gray-900">
            Reducir costos ya no alcanza: hay que saber en qué se gasta cada dólar
          </h2>
          <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
            Las empresas que operan con prácticas FinOps maduras no solo gastan menos: toman mejores
            decisiones más rápido, porque cada dólar de su gasto cloud es visible, explicable y accionable.
          </p>
        </div>

        {/* STATS REALES */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14 lg:mb-20">
          {STATS.map((s) => (
            <div key={s.label} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
              <p className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {s.value}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed mb-2">{s.label}</p>
              <p className="text-gray-400 text-xs">{s.source}</p>
            </div>
          ))}
        </div>

        {/* DESGLOSE REAL + GRÁFICO DE DESPERDICIO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-14 lg:mb-20">
          <div>
            <img
              src="/ima3.png"
              alt="Desglose de gasto cloud por servicio, cuenta y región en FinOps Latam"
              className="w-full h-auto rounded-2xl shadow-lg border border-gray-200"
            />
            <p className="text-xs text-gray-400 mt-3 text-center">
              Ejemplo de desglose de gasto por servicio, cuenta y región dentro de la plataforma FinOps Latam.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              El desperdicio cloud es la norma, no la excepción
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Sin visibilidad real, casi un tercio del gasto en la nube se pierde en recursos
              sobre-aprovisionados, instancias que nadie apagó y compromisos de ahorro (Reserved
              Instances / Savings Plans) mal gestionados. FinOps Latam te muestra ese desperdicio
              antes de que llegue a la factura.
            </p>

            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={WASTE_DATA} dataKey="value" nameKey="name"
                    innerRadius={55} outerRadius={85}
                    label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {WASTE_DATA.map((_, i) => (
                      <Cell key={i} fill={WASTE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Gasto cloud desperdiciado a nivel de industria — Flexera, State of the Cloud Report 2026.
            </p>
          </div>
        </div>

        {/* POR QUÉ ELEGIRNOS */}
        <div>
          <h3 className="text-xl lg:text-2xl font-bold text-center text-gray-900 mb-10">
            ¿Por qué elegir FinOps Latam?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {REASONS.map((r) => (
              <div key={r.title} className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                <div className="text-3xl mb-3">{r.icon}</div>
                <h4 className="font-bold text-gray-900 mb-2">{r.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FUENTES */}
        <p className="text-center text-gray-400 text-xs mt-12">
          Fuentes:{' '}
          <a
            href="https://www.flexera.com/blog/finops/flexera-2026-state-of-the-cloud-report-the-convergence-of-cloud-and-value/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            Flexera, State of the Cloud Report 2026
          </a>
          {' '}·{' '}
          <a
            href="https://data.finops.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            FinOps Foundation, State of FinOps 2026
          </a>
        </p>
      </div>
    </section>
  );
}
