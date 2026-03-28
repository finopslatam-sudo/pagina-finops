'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PublicFooter from '@/app/components/layout/PublicFooter';
import PlanComparisonTable from '@/app/components/PlanComparisonTable';
import { PLANS, type PlanSlug } from './constants';
import CheckoutForm from './components/CheckoutForm';

/* =====================================================
   PLAN SUMMARY — lado izquierdo
===================================================== */

function PlanSummary({ slug }: { slug: PlanSlug }) {
  const plan = PLANS[slug];
  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 lg:p-8 flex flex-col gap-6">
      <div>
        <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
          🎉 20% DCTO aplicado
        </span>
        {plan.badge && (
          <span className="ml-2 inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {plan.badge}
          </span>
        )}
        <h2 className={`text-2xl font-bold mt-2 ${plan.accentColor}`}>{plan.name}</h2>
        <p className="text-gray-500 mt-1 text-sm">{plan.description}</p>
      </div>

      <div className={`border-t border-b ${plan.borderColor} py-4`}>
        <p className="text-sm text-gray-500 mb-1">Total a pagar hoy</p>
        <div className="flex items-baseline gap-3 flex-wrap">
          <p className={`text-4xl font-extrabold ${plan.accentColor}`}>
            {plan.priceDiscount}
            {plan.period && (
              <span className="text-base font-normal text-gray-400 ml-1">{plan.period}</span>
            )}
          </p>
          <p className="text-lg text-gray-400 line-through">{plan.priceOriginal} {plan.period}</p>
        </div>
        {plan.period === 'USD/mes' && (
          <p className="text-xs text-gray-400 mt-1">
            Se renueva automáticamente cada mes. Cancela cuando quieras.
          </p>
        )}
      </div>

      <ul className="space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-green-600 mt-0.5 shrink-0">✔</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link href="/servicios" className="text-sm text-gray-400 hover:text-gray-600 transition underline text-center">
        ← Ver todos los planes
      </Link>
    </div>
  );
}

/* =====================================================
   INNER PAGE — usa useSearchParams
===================================================== */

function PagoContent() {
  const params  = useSearchParams();
  const router  = useRouter();
  const rawSlug = params.get('plan') ?? '';
  const slug    = rawSlug as PlanSlug;

  if (!PLANS[slug]) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-gray-500 text-lg">Plan no encontrado.</p>
        <button onClick={() => router.push('/servicios')}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition">
          Ver planes disponibles
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-white py-10 lg:py-16 px-4 lg:px-6">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
            <Link href="/servicios" className="hover:text-gray-600 transition">Planes</Link>
            <span>›</span>
            <span className="text-gray-700 font-medium">Contratar {PLANS[slug].name}</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <PlanSummary slug={slug} />
            <CheckoutForm slug={slug} />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-14 lg:py-20 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-10">
            Comparativa de planes
          </h2>
          <PlanComparisonTable />
        </div>
      </section>
    </>
  );
}

/* =====================================================
   PAGE EXPORT
===================================================== */

export default function PagoPage() {
  return (
    <>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-400">
          Cargando...
        </div>
      }>
        <PagoContent />
      </Suspense>
      <PublicFooter />
    </>
  );
}
