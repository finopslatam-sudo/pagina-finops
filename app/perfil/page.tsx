'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';
import { PasswordFields } from '@/app/components/Auth/PasswordFields';

export default function PerfilPage() {
  const { user, token, updateUser, planState } = useAuth();

  /* ================================
     STATES
  ================================= */
  const [editContact, setEditContact] = useState(false);
  const [editPhone, setEditPhone] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');

  const [form, setForm] = useState({
    contact_name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [successProfile, setSuccessProfile] = useState('');
  const [successPassword, setSuccessPassword] = useState('');
  const [error, setError] = useState('');

  /* ================================
     EFECTOS
  ================================= */
  useEffect(() => {
    if (!user) return;

    setForm({
      contact_name: user.contact_name || '',
      phone: user.phone || '',
      password: '',
      confirmPassword: '',
    });
  }, [user]);

  /* ================================
     PASSWORD REUTILIZABLE
  ================================= */
  const { allValid, component: passwordUI } = PasswordFields({
    currentPassword,
    setCurrentPassword,
    password: form.password,
    setPassword: (v: string) =>
      setForm((p) => ({ ...p, password: v })),
    confirm: form.confirmPassword,
    setConfirm: (v: string) =>
      setForm((p) => ({ ...p, confirmPassword: v })),
  });

  /* ================================
     GUARD
  ================================= */
  if (!user || !token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Debes iniciar sesión</p>
      </main>
    );
  }

  /* ================================
     SUBMIT PERFIL
  ================================= */
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessProfile('');
    setLoadingProfile(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            contact_name: editContact ? form.contact_name : undefined,
            phone: editPhone ? form.phone : undefined,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar perfil');
      }

      updateUser({
        ...user,
        contact_name: form.contact_name,
        phone: form.phone,
      });

      setSuccessProfile('Perfil actualizado correctamente');
      setEditContact(false);
      setEditPhone(false);
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoadingProfile(false);
    }
  };

  /* ================================
     SUBMIT PASSWORD
  ================================= */
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessPassword('');

    if (!allValid) {
      setError('La contraseña no cumple los requisitos');
      return;
    }

    setLoadingPassword(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            current_password: currentPassword,
            password: form.password,
            confirm_password: form.confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al cambiar contraseña');
      }

      setSuccessPassword('Contraseña actualizada correctamente');
      setCurrentPassword('');
      setForm((p) => ({
        ...p,
        password: '',
        confirmPassword: '',
      }));
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoadingPassword(false);
    }
  };

  /* ================================
     JSX
  ================================= */
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="bg-white w-full max-w-5xl mx-auto rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-semibold mb-8">Mi Perfil</h2>

        {/* MENSAJES */}
        {error && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
        {successProfile && <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded">{successProfile}</div>}
        {successPassword && <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded">{successPassword}</div>}

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* ================= DATOS PERFIL ================= */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Datos del perfil</h3>

            {/* ===== NO EDITABLES ===== */}
            <div className="space-y-5 mb-8">

              {/* Empresa */}
              <div className="space-y-1">
                <label className="text-sm text-gray-600">
                  Nombre de la empresa
                </label>
                <input
                  value={user.company_name}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700"
                />
              </div>

              {/* Correo */}
              <div className="space-y-1">
                <label className="text-sm text-gray-600">
                  Correo
                </label>
                <input
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700"
                />
              </div>

              {/* Plan */}
              <div className="space-y-1">
                <label className="text-sm text-gray-600">
                  Plan / Suscripción
                </label>
                <input
                  value={planState.status === "assigned" ? planState.plan.name : ""}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700"
                />
              </div>

              {/* Estado */}
              <div className="space-y-1">
                <label className="text-sm text-gray-600">
                  Estado de la cuenta
                </label>
                <div className="flex items-center justify-between px-4 py-2 border rounded-lg bg-gray-100">
                  <span className="text-gray-700">
                    {user.is_active ? "Activa" : "Inactiva"}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      user.is_active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ●
                  </span>
                </div>
              </div>
            </div>

            {/* ===== EDITABLES ===== */}
            <form onSubmit={handleProfileSubmit} className="space-y-6">

              {/* Nombre contacto */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-600">
                    Nombre de contacto
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (editContact) {
                        setForm((p) => ({
                          ...p,
                          contact_name: user.contact_name,
                        }));
                      }
                      setEditContact(!editContact);
                    }}
                    className="text-blue-600 text-sm font-medium"
                  >
                    {editContact ? "Cancelar" : "Editar"}
                  </button>
                </div>

                <input
                  value={form.contact_name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, contact_name: e.target.value }))
                  }
                  disabled={!editContact}
                  className={`w-full px-4 py-3 border rounded-xl ${
                    !editContact
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-white"
                  }`}
                />
              </div>

              {/* Teléfono */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-gray-600">
                    Teléfono de contacto
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (editPhone) {
                        setForm((p) => ({
                          ...p,
                          phone: user.phone,
                        }));
                      }
                      setEditPhone(!editPhone);
                    }}
                    className="text-blue-600 text-sm font-medium"
                  >
                    {editPhone ? "Cancelar" : "Editar"}
                  </button>
                </div>

                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  disabled={!editPhone}
                  className={`w-full px-4 py-3 border rounded-xl ${
                    !editPhone
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-white"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={loadingProfile}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
              >
                {loadingProfile ? "Guardando..." : "Guardar perfil"}
              </button>
            </form>
          </div>



          {/* ================= SEGURIDAD ================= */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Seguridad</h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {passwordUI}

              <button
                type="submit"
                disabled={loadingPassword || !allValid}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                {loadingPassword ? 'Cambiando...' : 'Cambiar contraseña'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
