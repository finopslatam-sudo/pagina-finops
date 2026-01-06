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
     SUBMIT PERFIL (NOMBRE / TELÉFONO)
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
     SUBMIT PASSWORD (VOLUNTARIO)
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
    <main className="min-h-screen bg-gray-50 flex justify-center py-12 px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6">

        <h2 className="text-2xl font-semibold mb-6">Mi Perfil</h2>

        {/* 🔒 DATOS DE CUENTA */}
        <div className="space-y-3 mb-6">
          <input value={user.company_name || ''} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
          <input value={user.email} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
          <input
            value={planState.status === 'assigned' ? planState.plan.name : ''}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
          />
        </div>

        {error && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
        {successProfile && <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded">{successProfile}</div>}
        {successPassword && <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded">{successPassword}</div>}

        {/* 👤 PERFIL */}
        <form onSubmit={handleProfileSubmit} className="space-y-4 mb-8">
          <input
            value={form.contact_name}
            onChange={(e) => setForm((p) => ({ ...p, contact_name: e.target.value }))}
            disabled={!editContact}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button type="button" onClick={() => setEditContact(!editContact)} className="text-sm text-blue-600">
            {editContact ? 'Cancelar' : 'Editar nombre'}
          </button>

          <input
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            disabled={!editPhone}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <button type="button" onClick={() => setEditPhone(!editPhone)} className="text-sm text-blue-600">
            {editPhone ? 'Cancelar' : 'Editar teléfono'}
          </button>

          <button
            type="submit"
            disabled={loadingProfile}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            {loadingProfile ? 'Guardando...' : 'Guardar perfil'}
          </button>
        </form>

        {/* 🔐 PASSWORD */}
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
    </main>
  );
}
