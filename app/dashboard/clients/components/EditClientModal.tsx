'use client';

/* =====================================================
   EDIT CLIENT MODAL — FINOPSLATAM
===================================================== */

import { useState } from 'react';
import type { AdminClient } from '../hooks/useAdminClients';
import { PLANS } from '@/app/lib/plans';

interface Props {
  client: AdminClient;
  onClose: () => void;
  onSave: (data: {
    company_name: string;
    email: string;
    contact_name?: string;
    phone?: string;
    is_active: boolean;
    plan_id: number;
  }) => Promise<void>;
}

export default function EditClientModal({
  client,
  onClose,
  onSave,
}: Props) {
  /* =========================
     STATE
  ========================== */

  const [companyName, setCompanyName] = useState(client.company_name);
  const [email, setEmail] = useState(client.email);
  const [contactName, setContactName] = useState(client.contact_name ?? '');
  const [phone, setPhone] = useState(client.phone ?? '');
  const [isActive, setIsActive] = useState(client.is_active);

  const [planId, setPlanId] = useState(
    PLANS.find(p => p.name === client.plan)?.id ?? PLANS[0].id
  );

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     SUBMIT
  ========================== */

  const submit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSave({
        company_name: companyName,
        email,
        contact_name: contactName || undefined,
        phone: phone || undefined,
        is_active: isActive,
        plan_id: planId,
      });

      setSuccess(true);
        
        setTimeout(() => {
            onClose();
        }, 1500); 

    } catch (err: any) {
      setError(
        err?.message ||
        err?.error ||
        'Error al guardar los cambios'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RENDER
  ========================== */

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl space-y-4">

        <h2 className="text-lg font-semibold">
          Editar cliente
        </h2>

        <div className="text-sm text-gray-500">
          Creado el{' '}
          {client.created_at
            ? new Date(client.created_at).toLocaleString()
            : '—'}
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-2">
            ✅ Cambios aplicados con éxito
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        <input
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Empresa"
        />

        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
        />

        <input
          value={contactName}
          onChange={e => setContactName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Contacto"
        />

        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Teléfono"
        />

        <select
          value={planId}
          onChange={e => setPlanId(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
        >
          {PLANS.map(plan => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={e => setIsActive(e.target.checked)}
          />
          Cliente activo
        </label>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="text-gray-600"
          >
            {success ? 'Cerrar' : 'Cancelar'}
          </button>

          {!success && (
            <button
              onClick={submit}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Guardando…' : 'Guardar'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
