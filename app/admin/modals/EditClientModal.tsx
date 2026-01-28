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
  is_active: boolean | null;
  created_at?: string | null;
  plan?: string | null;
}

interface Props {
  client: Client;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditClientModal({
  client,
  onClose,
  onSaved,
}: Props) {
  const { token } = useAuth();

  const [form, setForm] = useState({
    company_name: client.company_name,
    email: client.email,
    contact_name: client.contact_name ?? '',
    phone: client.phone ?? '',
    is_active: client.is_active ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!token) return;

    setSaving(true);
    setError('');

    try {
      await apiFetch(`/api/admin/clients/${client.id}`, {
        method: 'PATCH', // ✅ CORRECTO
        token,
        body: {
          company_name: form.company_name,
          email: form.email,
          contact_name: form.contact_name || null,
          phone: form.phone || null,
          is_active: form.is_active,
        },
      });

      onSaved();
    } catch (err) {
      console.error('EDIT CLIENT ERROR:', err);
      setError('No se pudo guardar la empresa');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-6">

        {/* HEADER */}
        <div>
          <h2 className="text-lg font-semibold">
            Editar empresa
          </h2>
          <p className="text-sm text-gray-500">
            ID #{client.id}
          </p>
        </div>

        {/* INFO NO EDITABLE */}
        <div className="text-sm text-gray-600 space-y-1">
          {client.plan && (
            <p><strong>Plan:</strong> {client.plan}</p>
          )}
          {client.created_at && (
            <p>
              <strong>Creado:</strong>{' '}
              {new Date(client.created_at).toLocaleString()}
            </p>
          )}
        </div>

        {/* FORM */}
        <div className="space-y-4">

          <input
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Nombre de la empresa"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Email"
          />

          <input
            name="contact_name"
            value={form.contact_name}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Nombre de contacto"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            placeholder="Teléfono"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Empresa activa
          </label>

        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 text-sm border rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white"
          >
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
