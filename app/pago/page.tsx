'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PublicFooter from '@/app/components/layout/PublicFooter';
import PlanComparisonTable from '@/app/components/PlanComparisonTable';
import { PLANS, type PlanSlug } from './constants';
import { API_URL } from '@/app/lib/api';

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

      {/* Precio con tachado */}
      <div className={`border-t border-b ${plan.borderColor} py-4`}>
        <p className="text-sm text-gray-500 mb-1">Total a pagar hoy</p>
        <div className="flex items-baseline gap-3 flex-wrap">
          <p className={`text-4xl font-extrabold ${plan.accentColor}`}>
            {plan.priceDiscount}
            {plan.period && (
              <span className="text-base font-normal text-gray-400 ml-1">{plan.period}</span>
            )}
          </p>
          <p className="text-lg text-gray-400 line-through">
            {plan.priceOriginal} {plan.period}
          </p>
        </div>
        {plan.period === 'USD/mes' && (
          <p className="text-xs text-gray-400 mt-1">
            Se renueva automáticamente cada mes. Cancela cuando quieras.
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-green-600 mt-0.5 shrink-0">✔</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/servicios"
        className="text-sm text-gray-400 hover:text-gray-600 transition underline text-center"
      >
        ← Ver todos los planes
      </Link>
    </div>
  );
}

/* =====================================================
   CHECKOUT FORM — lado derecho
===================================================== */

function CheckoutForm({ slug }: { slug: PlanSlug }) {
  const plan = PLANS[slug];
  const [form, setForm] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    pais: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_code: slug,
          email: form.email,
          nombre: form.nombre,
          empresa: form.empresa,
          pais: form.pais,
          telefono: form.telefono,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al iniciar el pago. Intenta nuevamente.');
        setLoading(false);
        return;
      }

      // Redirigir a PayPal para aprobar la suscripción
      window.location.href = data.checkout_url;
    } catch {
      setError('No se pudo conectar con el servidor. Intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Completa tus datos</h2>
        <p className="text-gray-500 text-sm mt-1">
          Serás redirigido a PayPal para completar el pago de forma segura.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Nombre completo *</label>
          <input
            required
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Juan Pérez"
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Empresa *</label>
          <input
            required
            name="empresa"
            value={form.empresa}
            onChange={handleChange}
            placeholder="Acme Corp"
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Email corporativo *</label>
        <input
          required
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="juan@empresa.com"
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Teléfono</label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="+56 9 1234 5678"
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">País *</label>
          <select
            required
            name="pais"
            value={form.pais}
            onChange={handleChange}
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Selecciona tu país</option>
            <option>México</option>
            <option>Chile</option>
            <option>Colombia</option>
            <option>Argentina</option>
            <option>Perú</option>
            <option>Brasil</option>
            <option>Ecuador</option>
            <option>Uruguay</option>
            <option>Bolivia</option>
            <option>Paraguay</option>
            <option>Venezuela</option>
            <option>Otro</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full ${plan.badgeBg} hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition text-base mt-2 flex items-center justify-center gap-2`}
      >
        {loading ? (
          <>
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Redirigiendo a pago seguro...
          </>
        ) : (
          <>
            🔒 Pagar con PayPal — {plan.priceDiscount} {plan.period}
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
        <span>🔐 Pago 100% seguro</span>
        <span>•</span>
        <span>Powered by PayPal</span>
        <span>•</span>
        <span>Cancela cuando quieras</span>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Al continuar aceptas nuestros{' '}
        <Link href="/terminos" className="underline hover:text-gray-600">términos de servicio</Link>
        {' '}y{' '}
        <Link href="/privacidad" className="underline hover:text-gray-600">política de privacidad</Link>.
      </p>
    </form>
  );
}

/* =====================================================
   INNER PAGE — usa useSearchParams
===================================================== */

function PagoContent() {
  const params = useSearchParams();
  const router = useRouter();
  const rawSlug = params.get('plan') ?? '';
  const slug = rawSlug as PlanSlug;

  if (!PLANS[slug]) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-gray-500 text-lg">Plan no encontrado.</p>
        <button
          onClick={() => router.push('/servicios')}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Ver planes disponibles
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-white py-10 lg:py-16 px-4 lg:px-6">
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
            <Link href="/servicios" className="hover:text-gray-600 transition">Planes</Link>
            <span>›</span>
            <span className="text-gray-700 font-medium">Contratar {PLANS[slug].name}</span>
          </nav>

          {/* Layout dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <PlanSummary slug={slug} />
            <CheckoutForm slug={slug} />
          </div>

        </div>
      </section>

      {/* Tabla comparativa de planes */}
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
