'use client';

import { useState } from 'react';
import Link from 'next/link';
import { API_URL } from '@/app/lib/api';
import { PLANS, type PlanSlug } from '../constants';

type PaymentMethod = 'paypal' | 'mercadopago' | 'webpay';

interface FormState {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  pais: string;
  rut: string;
}

const INITIAL_FORM: FormState = { nombre: '', empresa: '', email: '', telefono: '', pais: '', rut: '' };

/* ─── Selector de método de pago ─── */
function PaymentMethodSelector({
  selected,
  onChange,
}: {
  selected: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">Método de pago</p>
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => onChange('paypal')}
          className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-xl border-2 transition
            ${selected === 'paypal'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'}`}
        >
          <img src="/icons/paypal.png" alt="PayPal" className="h-10 w-auto" />
          <span className="text-xs text-gray-500">PayPal</span>
        </button>

        <button
          type="button"
          onClick={() => onChange('mercadopago')}
          className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-xl border-2 transition
            ${selected === 'mercadopago'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'}`}
        >
          <img src="/icons/mercadopago.png" alt="Mercado Pago" className="h-10 w-auto" />
          <span className="text-xs text-gray-500">Mercado Pago</span>
        </button>

        <button
          type="button"
          onClick={() => onChange('webpay')}
          className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-xl border-2 transition
            ${selected === 'webpay'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white hover:border-gray-300'}`}
        >
          <img src="/icons/webpay.png" alt="Webpay" className="h-10 w-auto" />
          <span className="text-xs text-gray-500">Webpay</span>
        </button>
      </div>

      {selected === 'paypal' && (
        <p className="mt-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
          No necesitas cuenta PayPal. Al continuar podrás pagar con tu tarjeta de crédito o débito como invitado.
        </p>
      )}
      {selected === 'webpay' && (
        <p className="mt-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          Paga con tarjeta de crédito o débito chilena. Serás redirigido a Webpay para autorizar el débito automático mensual.
        </p>
      )}
    </div>
  );
}

/* ─── Formulario principal ─── */
export default function CheckoutForm({ slug }: { slug: PlanSlug }) {
  const plan = PLANS[slug];
  const [method, setMethod]   = useState<PaymentMethod>('paypal');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [form, setForm]       = useState<FormState>(INITIAL_FORM);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let endpoint: string;
      if (method === 'mercadopago') {
        endpoint = `${API_URL}/api/payments/mercadopago/subscription`;
      } else if (method === 'webpay') {
        endpoint = `${API_URL}/api/patpass/create-inscription`;
      } else {
        endpoint = `${API_URL}/api/payments/create-subscription`;
      }

      const res  = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_code: slug, ...form }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al iniciar el pago.');
        setLoading(false);
        return;
      }

      // PayPal: checkout_url | MercadoPago: init_point | Webpay: redirect_url
      const redirectUrl = data.checkout_url || data.init_point || data.redirect_url;
      if (redirectUrl) {
        if (method === 'webpay' && data.buy_order) {
          localStorage.setItem('patpass_buy_order', data.buy_order);
        }
        window.location.href = redirectUrl;
      } else {
        setError('No se recibió URL de pago. Intenta nuevamente.');
        setLoading(false);
      }
    } catch {
      setError('No se pudo conectar con el servidor. Intenta nuevamente.');
      setLoading(false);
    }
  };

  const methodLabel = method === 'mercadopago' ? 'Mercado Pago' : method === 'webpay' ? 'Webpay' : 'PayPal';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Completa tus datos</h2>
        <p className="text-gray-500 text-sm mt-1">
          Ingresa tu información para continuar al pago.
        </p>
      </div>

      <PaymentMethodSelector selected={method} onChange={setMethod} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Nombre completo *</label>
          <input
            required name="nombre" value={form.nombre} onChange={handleChange}
            placeholder="Juan Pérez"
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Empresa *</label>
          <input
            required name="empresa" value={form.empresa} onChange={handleChange}
            placeholder="Acme Corp"
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Email corporativo *</label>
        <input
          required type="email" name="email" value={form.email} onChange={handleChange}
          placeholder="juan@empresa.com"
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Teléfono</label>
          <input
            name="telefono" value={form.telefono} onChange={handleChange}
            placeholder="+56 9 1234 5678"
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">País *</label>
          <select
            required name="pais" value={form.pais} onChange={handleChange}
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Selecciona tu país</option>
            <option>México</option><option>Chile</option><option>Colombia</option>
            <option>Argentina</option><option>Perú</option><option>Brasil</option>
            <option>Ecuador</option><option>Uruguay</option><option>Bolivia</option>
            <option>Paraguay</option><option>Venezuela</option><option>Otro</option>
          </select>
        </div>
      </div>

      {method === 'webpay' && (
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">RUT *</label>
          <input
            required={method === 'webpay'}
            name="rut"
            value={form.rut}
            onChange={handleChange}
            placeholder="12.345.678-9"
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-400">RUT del titular de la tarjeta (requerido por Transbank)</p>
        </div>
      )}

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
            Redirigiendo a {methodLabel}...
          </>
        ) : (
          <>Continuar al pago con {methodLabel} →</>
        )}
      </button>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-400 flex-wrap">
        <span>🔐 Pago 100% seguro</span>
        <span>•</span>
        <span>Powered by {methodLabel}</span>
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
