'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Link from 'next/link';

interface Props {
  planName: string;
  priceDiscount: string;
  period: string;
  badgeBg: string;
  returnUrl: string;
  onBack: () => void;
}

export default function StripeCardForm({
  planName,
  priceDiscount,
  period,
  badgeBg,
  returnUrl,
  onBack,
}: Props) {
  const stripe   = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError('');

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });

    // Solo llega aquí si hubo error (si el pago fue OK, Stripe redirige)
    if (stripeError) {
      setError(stripeError.message || 'Error al procesar el pago. Intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-gray-600 transition mb-2"
        >
          ← Editar datos
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Ingresa tu tarjeta</h2>
        <p className="text-gray-500 text-sm mt-1">
          Pago seguro. Tu tarjeta será cobrada mensualmente de forma automática.
        </p>
      </div>

      <PaymentElement options={{ layout: 'tabs' }} />

      {error && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full ${badgeBg} hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition text-base flex items-center justify-center gap-2`}
      >
        {loading ? (
          <>
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Procesando pago...
          </>
        ) : (
          <>🔒 Confirmar pago — {priceDiscount} {period}</>
        )}
      </button>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
        <span>🔐 Pago 100% seguro</span>
        <span>•</span>
        <span>Powered by Stripe</span>
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
