'use client';

import { useState } from 'react';
import { useAdminClients } from '../hooks/useAdminClients';
import { useAdminUsers } from '@/app/dashboard/admin/hooks/useAdminUsers';
import { PLANS } from '@/app/lib/plans';

interface Props {
  onClose: () => void;
}

export default function CreateClientModal({ onClose }: Props) {
  const { createClient } = useAdminClients();
  const { createUser } = useAdminUsers();

  /* ======================
     CLIENT STATE
  ====================== */
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [planId, setPlanId] = useState<number>(PLANS[0].id);
  const [isActive, setIsActive] = useState(true);

  /* ======================
     USER STATE
  ====================== */
  const [addUser, setAddUser] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] =
    useState<'owner' | 'finops_admin' | 'viewer'>('owner');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ======================
     SUBMIT
  ====================== */
  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      const client = await createClient({
        company_name: companyName,
        email,
        contact_name: contactName || undefined,
        phone: phone || undefined,
        is_active: isActive,
        plan_id: planId,
      });

      if (addUser) {
        await createUser({
          email: userEmail,
          client_id: client.id,
          client_role: userRole,
        });
      }

      onClose();
    } catch (err: any) {
      setError(
        err?.message ||
          'Error al crear cliente'
      );
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     RENDER
  ====================== */
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4">

        <h2 className="text-lg font-semibold">
          Crear cliente
        </h2>

        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}

        {/* CLIENT FORM */}
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Empresa"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email empresa"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Contacto"
          value={contactName}
          onChange={e => setContactName(e.target.value)}
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Teléfono"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <select
          className="w-full border rounded px-3 py-2"
          value={planId}
          onChange={e => setPlanId(Number(e.target.value))}
        >
          {PLANS.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
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

        {/* USER SECTION */}
        <hr />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={addUser}
            onChange={e => setAddUser(e.target.checked)}
          />
          Agregar usuario a este cliente
        </label>

        {addUser && (
          <>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Email usuario"
              value={userEmail}
              onChange={e => setUserEmail(e.target.value)}
            />

            <select
              className="w-full border rounded px-3 py-2"
              value={userRole}
              onChange={e =>
                setUserRole(
                  e.target.value as any
                )
              }
            >
              <option value="owner">Owner</option>
              <option value="finops_admin">
                FinOps Admin
              </option>
              <option value="viewer">Viewer</option>
            </select>
          </>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="text-gray-600"
          >
            Cancelar
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Creando…' : 'Crear'}
          </button>
        </div>

      </div>
    </div>
  );
}
