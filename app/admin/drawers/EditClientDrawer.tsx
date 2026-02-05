'use client';

/* =====================================================
   EDIT CLIENT DRAWER — FINOPSLATAM
   UX enterprise para edición de clientes
===================================================== */

import { useEffect, useState } from 'react';
import { AdminClient, useAdminClients } from '@/app/dashboard/clients/hooks/useAdminClients';

interface Props {
  client: AdminClient;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditClientDrawer({
  client,
  onClose,
  onSaved,
}: Props) {
  const { updateClient } = useAdminClients();

  /* =====================================================
     FORM STATE
  ===================================================== */

  const [companyName, setCompanyName] = useState(client.company_name);
  const [email, setEmail] = useState(client.email);
  const [contactName, setContactName] = useState(client.contact_name ?? '');
  const [phone, setPhone] = useState(client.phone ?? '');
  const [isActive, setIsActive] = useState(client.is_active);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  /* =====================================================
     HELPERS
  ===================================================== */

  const hasChanges =
    companyName !== client.company_name ||
    email !== client.email ||
    contactName !== (client.contact_name ?? '') ||
    phone !== (client.phone ?? '') ||
    isActive !== client.is_active;

  const isValidEmail = email.includes('@');

  /* =====================================================
     SAVE HANDLER
  ===================================================== */

  const handleSave = async () => {
    if (!hasChanges || !isValidEmail) return;

    if (client.is_active && !isActive && !confirmDeactivate) {
      setConfirmDeactivate(true);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateClient(client.id, {
        company_name: companyName.trim(),
        email: email.trim(),
        contact_name: contactName || null,
        phone: phone || null,
        is_active: isActive,
      });

      setSuccess(true);

      setTimeout(() => {
        onSaved();
      }, 800);
    } catch (err) {
      console.error(err);
      setError('No se pudieron guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     RESET CONFIRMATION IF RE-ACTIVATED
  ===================================================== */

  useEffect(() => {
    if (isActive) {
      setConfirmDeactivate(false);
    }
  }, [isActive]);

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
      <div className="w-full max-w-xl h-full bg-white shadow-xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Editar cliente
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* INFO */}
        <p className="text-sm text-gray-500 mb-6">
          ID #{client.id} · Creado automáticamente (no editable)
        </p>

        <div className="space-y-4">
          {/* COMPANY NAME */}
          <div>
            <label className="block text-sm font-medium">
              Empresa
            </label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            {!isValidEmail && (
              <p className="text-xs text-red-600">
                Email inválido
              </p>
            )}
          </div>

          {/* CONTACT NAME */}
          <div>
            <label className="block text-sm font-medium">
              Contacto
            </label>
            <input
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
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
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* ACTIVE */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span>Cliente activo</span>
          </div>

          {/* CONFIRM DEACTIVATE */}
          {confirmDeactivate && (
            <div className="border border-yellow-300 bg-yellow-50 p-3 rounded text-sm">
              ⚠️ Estás por desactivar este cliente.  
              Esto afectará a **todos sus usuarios**.
              <div className="mt-2">
                <button
                  onClick={handleSave}
                  className="text-red-600 underline mr-4"
                >
                  Confirmar desactivación
                </button>
                <button
                  onClick={() => setIsActive(true)}
                  className="text-gray-600 underline"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

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
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || !isValidEmail || saving}
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
