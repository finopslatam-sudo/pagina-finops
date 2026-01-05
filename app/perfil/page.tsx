'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { PasswordFields } from '@/app/components/Auth/PasswordFields';

export default function PerfilPage() {
  const { user, token, updateUser, planState } = useAuth();

  const [editContact, setEditContact] = useState(false);
  const [editPhone, setEditPhone] = useState(false);

  if (!user || !token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Debes iniciar sesión</p>
      </main>
    );
  }

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
  const { allValid, component: passwordUI } = PasswordFields({
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
            phone: editPhone ? form.phone : undefined,
            password: form.password || undefined,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar cambios');
      }

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

        {/* 🔒 DATOS DE CUENTA */}
        <div className="space-y-3 mb-6">
          <input
            value={user.company_name || ''}
            disabled
            placeholder="Empresa"
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
          />

          <input
            value={user.email}
            disabled
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
          />

          <input
            value={
              planState.status === 'assigned'
                ? planState.plan.name
                : ''
            }
            disabled
            placeholder="Plan actual"
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
          />

          <input
            value="Activa"
            disabled
            placeholder="Estado"
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-green-700 font-medium"
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

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 👤 NOMBRE DE CONTACTO */}
          <div className="flex items-center gap-2">
            {!editContact ? (
              <>
                <input
                  value={user.contact_name || ''}
                  disabled
                  placeholder="Nombre de contacto"
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setEditContact(true)}
                  className="text-blue-600 text-sm"
                >
                  Editar
                </button>
              </>
            ) : (
              <>
                <input
                  value={form.contact_name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contact_name: e.target.value }))
                  }
                  placeholder="Nombre de contacto"
                  className="w-full px-4 py-2 border rounded-lg"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setEditContact(false);
                    setForm((p) => ({
                      ...p,
                      contact_name: user.contact_name || '',
                    }));
                  }}
                  className="text-gray-600 text-sm"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>

          {/* 📞 TELÉFONO */}
          <div className="flex items-center gap-2">
            {!editPhone ? (
              <>
                <input
                  value={user.phone || ''}
                  disabled
                  placeholder="Teléfono de contacto"
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setEditPhone(true)}
                  className="text-blue-600 text-sm"
                >
                  Editar
                </button>
              </>
            ) : (
              <>
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="Teléfono de contacto"
                  className="w-full px-4 py-2 border rounded-lg"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setEditPhone(false);
                    setForm((p) => ({
                      ...p,
                      phone: user.phone || '',
                    }));
                  }}
                  className="text-gray-600 text-sm"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>

          {/* 🔐 PASSWORD — inputs siempre visibles */}
          {passwordUI}

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