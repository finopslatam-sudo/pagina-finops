'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { PasswordFields } from '@/app/components/Auth/PasswordFields';

export default function PerfilPage() {
  const { user, token, updateUser, planState } = useAuth();

  if (!user || !token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Debes iniciar sesión</p>
      </main>
    );
  }

  /* ✏️ Estados de edición individuales */
  const [editContact, setEditContact] = useState(false);
  const [editPhone, setEditPhone] = useState(false);

  const [form, setForm] = useState({
    contact_name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setForm({
      contact_name: user.contact_name || '',
      phone: user.phone || '',
      password: '',
      confirmPassword: '',
    });
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  /* 🔐 Password reutilizable */
  const {
    allValid,
    component: passwordUI,
  } = PasswordFields({
    password: form.password,
    setPassword: (v: string) =>
      setForm((p) => ({ ...p, password: v })),
    confirm: form.confirmPassword,
    setConfirm: (v: string) =>
      setForm((p) => ({ ...p, confirmPassword: v })),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password.length > 0 && !allValid) {
      setError('La contraseña no cumple los requisitos');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            contact_name: editContact ? form.contact_name : undefined,
            phone: editPhone ? form.phone || undefined : undefined,
            password: form.password || undefined,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al guardar cambios');

      updateUser(data.user);
      setSuccess('Perfil actualizado correctamente');

      setEditContact(false);
      setEditPhone(false);

      setForm((p) => ({
        ...p,
        password: '',
        confirmPassword: '',
      }));
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center py-12 px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6">

        <h2 className="text-2xl font-semibold mb-6">Mi Perfil</h2>

        {/* 🔒 INFO SOLO LECTURA */}
        <div className="space-y-3 mb-6">
          <input
            value={user.company_name || ''}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
            placeholder="Empresa"
          />

          <input
            value={user.email}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
            placeholder="Email"
          />

          <input
            value={
              planState.status === 'assigned'
                ? planState.plan.name
                : 'Sin plan'
            }
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
            placeholder="Plan actual"
          />

          <input
            value="Activa"
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-green-700 font-medium"
            placeholder="Estado"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* 👤 NOMBRE CONTACTO */}
          <div className="flex items-center gap-2">
            <input
              value={form.contact_name || '—'}
              disabled={!editContact}
              onChange={(e) =>
                setForm((p) => ({ ...p, contact_name: e.target.value }))
              }
              className={`w-full px-4 py-2 border rounded-lg ${
                editContact
                  ? 'bg-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            />
            <button
              type="button"
              onClick={() => setEditContact((v) => !v)}
              className="text-blue-600 text-sm whitespace-nowrap"
            >
              {editContact ? 'Cancelar' : 'Editar'}
            </button>
          </div>

          {/* 📞 TELÉFONO */}
          <div className="flex items-center gap-2">
            <input
              value={form.phone || '—'}
              disabled={!editPhone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              className={`w-full px-4 py-2 border rounded-lg ${
                editPhone
                  ? 'bg-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            />
            <button
              type="button"
              onClick={() => setEditPhone((v) => !v)}
              className="text-blue-600 text-sm whitespace-nowrap"
            >
              {editPhone ? 'Cancelar' : 'Editar'}
            </button>
          </div>

          {/* 🔐 PASSWORD (solo aparece si escribe) */}
          {form.password.length > 0 && passwordUI}

          <button
            type="submit"
            disabled={loading || (form.password.length > 0 && !allValid)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </main>
  );
}
