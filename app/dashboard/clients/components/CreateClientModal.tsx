'use client';

import { useState } from 'react';
import { useAdminClients } from '../hooks/useAdminClients';
import { apiFetch } from '@/app/lib/api';
import { PLANS } from '@/app/lib/plans';

interface Props {
  onClose: () => void;
}

export default function CreateClientModal({ onClose }: Props) {
  const { createClient } = useAdminClients();

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
  const [userRole] =
    useState<'owner' | 'finops_admin' | 'viewer'>('owner');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  /* ======================
     UI STATE
  ====================== */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ======================
     SUBMIT
  ====================== */
  const submit = async () => {
    setLoading(true);
    setError(null);

    try {
      /* -------- VALIDACIÓN CLIENTE -------- */
      if (!companyName || !email || !planId) {
        throw new Error('Empresa, email y plan son obligatorios');
      }

      /* -------- VALIDACIÓN USUARIO -------- */
      if (addUser) {
        if (!userEmail) {
          throw new Error('Email de usuario es obligatorio');
        }

        if (!password || password.length < 8) {
          throw new Error('La contraseña debe tener al menos 8 caracteres');
        }

        if (password !== passwordConfirm) {
          throw new Error('Las contraseñas no coinciden');
        }
      }

      /* -------- CREAR CLIENTE -------- */
      const client = await createClient({
        company_name: companyName,
        email,
        contact_name: contactName || undefined,
        phone: phone || undefined,
        is_active: isActive,
        plan_id: planId,
      });

      /* -------- CREAR USUARIO CON PASSWORD -------- */
      if (addUser) {
        await apiFetch('/api/admin/users/with-password', {
          method: 'POST',
          body: {
            email: userEmail,
            client_id: client.id,
            client_role: userRole,
            password,
            password_confirm: passwordConfirm,
            force_password_change: true,
          },
        });
      }

      onClose();
    } catch (err: any) {
      setError(err?.message || 'Error al crear cliente');
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

        <h2 className="text-lg font-semibold">Crear cliente</h2>

        {error && (
          <div className="text-sm text-red-600">{error}</div>
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

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full border rounded px-3 py-2 pr-10"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 text-sm"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="relative">
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                className="w-full border rounded px-3 py-2 pr-10"
                placeholder="Confirmar contraseña"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswordConfirm(!showPasswordConfirm)
                }
                className="absolute right-2 top-2 text-sm"
              >
                {showPasswordConfirm ? '🙈' : '👁️'}
              </button>
            </div>
          </>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="text-gray-600">
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
