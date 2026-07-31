import { Globe, Flag, Briefcase } from 'lucide-react';

const PORTFOLIO_ITEMS = [
  'Envisioning Workshop',
  'IT Asset Management (ITAM)',
  'FinOps',
  'Technology to Business Value (T2Bv)',
  'Otras prácticas complementarias (ITIL, TBM, ITFM)',
];

export default function AlliancesSection() {
  return (
    <section id="alianzas" className="px-4 lg:px-6 py-14 lg:py-20 bg-white">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-4">
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            Alianza estratégica
          </span>
          <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">
            FinOps Latam + SmartioCorp
          </h2>
          <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto mb-12 lg:mb-16">
            Sumamos fuerzas con{' '}
            <a
              href="https://smartiocorp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline"
            >
              SmartioCorp
            </a>{' '}
            para llevar la optimización financiera de TI más allá del gasto cloud: desde la
            gobernanza de activos hasta la conexión de cada inversión tecnológica con resultados
            de negocio medibles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* TEXTO */}
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
              IT Financial Optimization
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              La práctica de IT Financial Optimization de SmartioCorp ayuda a las organizaciones a
              mejorar la transparencia, gobernanza y eficiencia financiera de la tecnología,
              conectando las inversiones en TI con resultados de negocio medibles.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Nuestro enfoque integra múltiples disciplinas especializadas que permiten evolucionar
              desde un estado de baja visibilidad financiera de TI hacia un modelo de gestión
              estratégica del valor de la tecnología.
            </p>

            <p className="font-semibold text-gray-900 mb-3">Las áreas principales de nuestro portafolio son:</p>
            <ul className="space-y-2">
              {PORTFOLIO_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-gray-700">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DIAGRAMA DE VENN */}
          <div className="flex justify-center">
            <svg viewBox="0 0 400 380" className="w-full max-w-md" role="img" aria-label="Disciplinas FinOps, T2Bv e ITAM integradas en IT Financial Optimization">
              <g style={{ mixBlendMode: 'multiply' }}>
                <circle cx="200" cy="150" r="120" fill="#38bdf8" />
                <circle cx="140" cy="260" r="120" fill="#2dd4bf" />
                <circle cx="260" cy="260" r="120" fill="#22c55e" />
              </g>

              <text x="200" y="105" textAnchor="middle" fill="white" fontSize="22" fontWeight="700">FinOps</text>
              <text x="105" y="300" textAnchor="middle" fill="#0f172a" fontSize="20" fontWeight="700">T2Bv</text>
              <text x="295" y="300" textAnchor="middle" fill="white" fontSize="20" fontWeight="700">ITAM</text>

              <foreignObject x="150" y="185" width="36" height="36">
                <Globe className="w-9 h-9 text-white" strokeWidth={1.75} />
              </foreignObject>
              <foreignObject x="214" y="185" width="36" height="36">
                <Flag className="w-9 h-9 text-white" strokeWidth={1.75} />
              </foreignObject>
              <foreignObject x="182" y="248" width="36" height="36">
                <Briefcase className="w-9 h-9 text-white" strokeWidth={1.75} />
              </foreignObject>
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
}
