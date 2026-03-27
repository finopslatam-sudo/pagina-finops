'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PublicFooter from '@/app/components/layout/PublicFooter';
import { PLANS, type PlanSlug } from './constants';
import { API_URL } from '@/app/lib/api';

/* =====================================================
   PLAN SUMMARY — lado izquierdo
===================================================== */

function PlanSummary({ slug }: { slug: PlanSlug }) {
  const plan = PLANS[slug];
  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 lg:p-8 flex flex-col gap-6">

      {/* Header plan */}
      <div>
        <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
          🎉 20% DCTO aplicado
        </span>
        <h2 className={`text-2xl font-bold ${plan.accentColor}`}>{plan.name}</h2>
        <p className="text-gray-500 mt-1 text-sm">{plan.description}</p>
      </div>

      {/* Precio */}
      <div className={`border-t border-b ${plan.borderColor} py-4`}>
        <p className="text-sm text-gray-500 mb-1">Total a pagar hoy</p>
        <p className={`text-4xl font-extrabold ${plan.accentColor}`}>
          {plan.price}
          {plan.period && (
            <span className="text-base font-normal text-gray-400 ml-1">{plan.period}</span>
          )}
        </p>
        {plan.period && (
          <p className="text-xs text-gray-400 mt-1">Se renueva automáticamente cada mes. Cancela cuando quieras.</p>
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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          empresa: form.empresa,
          email: form.email,
          telefono: form.telefono,
          pais: form.pais,
          servicio: plan.name,
          mensaje: `Solicitud de contratación: ${plan.name}`,
        }),
      });

      if (!res.ok) throw new Error('Error al enviar');
      setSuccess(true);
    } catch {
      setError('Hubo un problema al enviar la solicitud. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 gap-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">
          ✅
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud enviada!</h3>
          <p className="text-gray-500 max-w-sm">
            Recibimos tu solicitud para contratar <strong>{plan.name}</strong>.
            Un especialista FinOps se pondrá en contacto en las próximas 24 horas hábiles.
          </p>
        </div>
        <Link
          href="/"
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Completa tus datos</h2>
        <p className="text-gray-500 text-sm mt-1">
          Un especialista FinOps confirmará tu suscripción en menos de 24 horas hábiles.
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
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full ${plan.badgeBg} hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition text-base mt-2`}
      >
        {loading ? 'Enviando solicitud...' : `Contratar ${plan.name}`}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Al enviar, aceptas nuestros{' '}
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
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
  );
}

/* =====================================================
   PAGE EXPORT — envuelve en Suspense (requerido por Next.js)
===================================================== */

export default function PagoPage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Cargando...</div>}>
        <PagoContent />
      </Suspense>
      <PublicFooter />
    </>
  );
}
