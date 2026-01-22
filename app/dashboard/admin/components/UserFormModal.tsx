'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

interface Props {
  onClose: () => void;
}

type Mode = 'client' | 'user';

export default function UserFormModal({ onClose }: Props) {
  const { user, token } = useAuth(); // ✅ CORRECTO (dentro del componente)

  const [mode, setMode] = useState<Mode>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // CLIENT
  const [companyName, setCompanyName] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  // USER
  const [userEmail, setUserEmail] = useState('');
  const [globalRole, setGlobalRole] =
    useState<'support' | ''>('');

  const submit = async () => {
    setError('');

    if (mode === 'client' && (!companyName || !clientEmail)) {
      setError('Completa todos los campos');
      return;
    }

    if (mode === 'user' && (!userEmail || !globalRole)) {
      setError('Completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      // ⛔ ENDPOINTS A CONFIRMAR (BACKEND)
      const endpoint =
        mode === 'client'
          ? '/api/admin/clients'
          : '/api/admin/users';

      const body =
        mode === 'client'
          ? {
              company_name: companyName,
              email: clientEmail,
            }
          : {
              email: userEmail,
              global_role: globalRole,
            };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear');
      }

      alert('Creado correctamente');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-lg font-semibold mb-4">
          Crear {mode === 'client' ? 'Cliente' : 'Usuario'}
        </h2>

        {user?.global_role === 'root' && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('client')}
              className={`px-3 py-1 rounded ${
                mode === 'client'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Cliente
            </button>
            <button
              onClick={() => setMode('user')}
              className={`px-3 py-1 rounded ${
                mode === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              Usuario
            </button>
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600 mb-3">{error}</p>
        )}

        {mode === 'client' && (
          <>
            <input
              placeholder="Nombre empresa"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-3"
            />
            <input
              placeholder="Email empresa"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-3"
            />
          </>
        )}

        {mode === 'user' && (
          <>
            <input
              placeholder="Email usuario"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-3"
            />
            <select
              value={globalRole}
              onChange={(e) =>
                setGlobalRole(e.target.value as any)
              }
              className="w-full px-4 py-2 border rounded mb-3"
            >
              <option value="">Selecciona rol</option>
              <option value="support">Support</option>
            </select>
          </>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:underline"
          >
            Cancelar
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Guardando…' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}
