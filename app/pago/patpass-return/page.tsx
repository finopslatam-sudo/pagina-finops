'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { API_URL } from '@/app/lib/api';

type Status = 'loading' | 'success' | 'rejected' | 'error';

export default function PatpassReturnPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const [status, setStatus]     = useState<Status>('loading');
  const [planName, setPlanName] = useState('');

  useEffect(() => {
    const token_ws  = searchParams.get('token_ws');
    const buy_order = searchParams.get('buy_order') ?? localStorage.getItem('patpass_buy_order');

    if (!token_ws || !buy_order) {
      setStatus('error');
      return;
    }

    fetch(`${API_URL}/api/patpass/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token_ws, buy_order }),
    })
      .then(r => r.json())
      .then(data => {
        localStorage.removeItem('patpass_buy_order');
        if (data.status === 'active') {
          setPlanName(data.plan_name ?? '');
          setStatus('success');
        } else {
          setStatus('rejected');
        }
      })
      .catch(() => setStatus('error'));
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-600">Confirmando tu suscripción con Transbank...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4">
          <div className="text-5xl">✅</div>
          <h1 className="text-2xl font-bold text-gray-900">¡Suscripción activada!</h1>
          <p className="text-gray-600">
            Tu suscripción a <strong>{planName}</strong> fue registrada correctamente.
            Nuestro equipo revisará tu solicitud y activará tu cuenta a la brevedad.
          </p>
          <p className="text-sm text-gray-500">
            Recibirás un correo de confirmación con los próximos pasos.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4">
          <div className="text-5xl">❌</div>
          <h1 className="text-2xl font-bold text-gray-900">Suscripción rechazada</h1>
          <p className="text-gray-600">
            Transbank rechazó la autorización. Posibles causas:
          </p>
          <ul className="text-sm text-gray-500 text-left list-disc list-inside space-y-1">
            <li>Error en los datos de tu tarjeta</li>
            <li>Saldo insuficiente</li>
            <li>Tarjeta no habilitada para débitos automáticos</li>
          </ul>
          <button
            onClick={() => router.push('/servicios')}
            className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition"
          >
            Volver a intentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-4">
        <div className="text-5xl">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900">Error inesperado</h1>
        <p className="text-gray-600">No pudimos procesar la respuesta de Transbank.</p>
        <button
          onClick={() => router.push('/servicios')}
          className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition"
        >
          Volver a los planes
        </button>
      </div>
    </div>
  );
}
