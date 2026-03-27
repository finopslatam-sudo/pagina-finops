'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import PublicFooter from '@/app/components/layout/PublicFooter';
import { PLANS, type PlanSlug } from '../constants';

function CancelContent() {
  const params = useSearchParams();
  const slug = (params.get('plan') ?? '') as PlanSlug;
  const plan = PLANS[slug];

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center space-y-6">

        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-4xl mx-auto">
          ↩️
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Pago cancelado
          </h1>
          <p className="text-gray-500 leading-relaxed">
            No se realizó ningún cobro. Puedes retomar el proceso cuando quieras.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {plan ? (
            <Link
              href={`/pago?plan=${slug}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
            >
              Volver a contratar {plan.name}
            </Link>
          ) : (
            <Link
              href="/servicios"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
            >
              Ver planes
            </Link>
          )}
          <Link
            href="/contacto"
            className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-3 rounded-xl transition text-sm"
          >
            Tengo preguntas
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function PagoCancelPage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen" />}>
        <CancelContent />
      </Suspense>
      <PublicFooter />
    </>
  );
}
