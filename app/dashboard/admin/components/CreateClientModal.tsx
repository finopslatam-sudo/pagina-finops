'use client';

/* =====================================================
   CREATE CLIENT MODAL — FINOPSLATAM
===================================================== */

import { useState } from 'react';
import { PLANS } from '@/app/lib/plans';

export type CreateClientPayload = {
  company_name: string;
  email: string;
  contact_name?: string;
  phone?: string;
  is_active: boolean;
  plan_id: number; // 👈 OBLIGATORIO
};

interface Props {
  onClose: () => void;
  onCreate: (payload: CreateClientPayload) => Promise<void>;
}

export default function CreateClientModal({
  onClose,
  onCreate,
}: Props) {
  /* =========================
     STATE
  ========================== */

  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [planId, setPlanId] = useState<number>(
    PLANS[0].id
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* =========================
     SUBMIT
  ========================== */

  const submit = async () => {
    if (!companyName) {
      setError('El nombre de la empresa es obligatorio');
      return;
    }

    if (!email) {
      setError('El email es obligatorio');
      return;
    }

    if (!planId) {
      setError('Debes seleccionar un plan');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onCreate({
        company_name: companyName,
        email,
        contact_name: contactName || undefined,
        phone: phone || undefined,
        is_active: isActive,
        plan_id: planId,
      });
      // ⛔ NO cerrar aquí → el padre decide
    } catch (err: any) {
      setError(
        err?.error ||
        err?.message ||
        'Error al crear cliente'
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
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">

        <h2 className="text-lg font-semibold mb-4">
          Crear cliente
        </h2>

        {error && (
          <p className="text-sm text-red-600 mb-3">
            {error}
          </p>
        )}

        {/* COMPANY NAME */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Empresa *
          </label>
          <input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="FinOps Latam"
          />
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="contacto@empresa.cl"
          />
        </div>

        {/* PLAN */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Plan *
          </label>
          <select
            value={planId}
            onChange={(e) =>
              setPlanId(Number(e.target.value))
            }
            className="w-full px-4 py-2 border rounded-lg"
          >
            {PLANS.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>

        {/* CONTACT NAME */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Nombre de contacto
          </label>
          <input
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Juan Pérez"
          />
        </div>

        {/* PHONE */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Teléfono
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="+56 9 1234 5678"
          />
        </div>

        {/* ACTIVE */}
        <div className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) =>
              setIsActive(e.target.checked)
            }
          />
          <span className="text-sm">
            Cliente activo
          </span>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:underline"
          >
            Cancelar
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Creando…' : 'Crear cliente'}
          </button>
        </div>

      </div>
    </div>
  );
}
