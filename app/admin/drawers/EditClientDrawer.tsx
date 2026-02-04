'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';

interface Client {
  id: number;
  company_name: string;
  email: string;
  contact_name: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

interface Props {
  client: Client;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditClientDrawer({
  client,
  onClose,
  onSaved,
}: Props) {
  const { token } = useAuth();

  /* ============================
     FORM STATE
  ============================ */

  const [companyName, setCompanyName] = useState(
    client.company_name
  );
  const [email, setEmail] = useState(client.email);
  const [contactName, setContactName] = useState(
    client.contact_name ?? ''
  );
  const [phone, setPhone] = useState(client.phone ?? '');
  const [isActive, setIsActive] = useState(
    client.is_active
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(
    null
  );
  const [success, setSuccess] = useState(false);

  /* ============================
     SAVE
  ============================ */

  const handleSave = async () => {
    if (!token) return;

    setSaving(true);
    setError(null);

    try {
      await apiFetch(
        `/api/admin/clients/${client.id}`,
        {
          method: 'PATCH',
          token,
          body: {
            company_name: companyName,
            email,
            contact_name: contactName || null,
            phone: phone || null,
            is_active: isActive,
          },
        }
      );

      setSuccess(true);

      setTimeout(() => {
        onSaved();
      }, 800);
    } catch (err) {
      setError(
        'No se pudieron guardar los cambios'
      );
    } finally {
      setSaving(false);
    }
  };

  /* ============================
     UI
  ============================ */

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* OVERLAY */}
      <div
        className="flex-1 bg-black/40"
        onClick={onClose}
      />

      {/* DRAWER */}
      <div className="w-full max-w-md bg-white shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold">
              Editar cliente
            </h2>
            <p className="text-sm text-gray-500">
              {client.company_name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          {/* EMPRESA */}
          <div>
            <label className="block text-sm font-medium">
              Nombre de la empresa
            </label>
            <input
              value={companyName}
              onChange={(e) =>
                setCompanyName(e.target.value)
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium">
              Email de contacto
            </label>
            <input
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* CONTACT NAME */}
          <div>
            <label className="block text-sm font-medium">
              Nombre de contacto
            </label>
            <input
              value={contactName}
              onChange={(e) =>
                setContactName(e.target.value)
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-medium">
              Teléfono
            </label>
            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* ACTIVE */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) =>
                setIsActive(e.target.checked)
              }
            />
            <span>Cliente activo</span>
          </div>

          {/* METADATA */}
          <div className="pt-3 border-t text-sm text-gray-500">
            Creado el:{' '}
            {new Date(
              client.created_at
            ).toLocaleString()}
          </div>

          {/* FEEDBACK */}
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-600">
              ✅ Cliente actualizado correctamente
            </p>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
