'use client';

export const dynamic = "force-dynamic";

/* =====================================================
   PERFIL — FINOPSLATAM
   Gestión de datos personales y seguridad
===================================================== */

/* =====================================================
   IMPORTS
===================================================== */

import { useEffect, useState } from 'react';
import PrivateRoute from '@/app/components/Auth/PrivateRoute';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';
import { PasswordFields } from '@/app/components/Auth/PasswordFields';
import { ProfileInput, EditableField } from './components/ProfileFields';

const PAISES = [
  'México','Chile','Colombia','Argentina','Perú','Brasil',
  'Ecuador','Uruguay','Bolivia','Paraguay','Venezuela','Otro',
];

/* =====================================================
   COMPONENT
===================================================== */

/**
 * PerfilPage
 *
 * Página protegida de perfil del usuario.
 *
 * Responsabilidades:
 * - Mostrar datos del usuario autenticado
 * - Permitir actualización de contacto
 * - Permitir cambio de contraseña
 *
 * Seguridad:
 * - Protegida por <PrivateRoute />
 * - JWT requerido
 * - force_password_change respetado
 *
 * Importante:
 * - No gestiona autenticación
 * - No gestiona permisos
 * - Backend valida todo
 */
export default function PerfilPage() {
  const { user, token, updateUser, logout } = useAuth();
  /* ================================
     STATE
  ================================= */

  const [editContact, setEditContact] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');

  const [form, setForm] = useState({
    email: '',
    contact_name: '',
    password: '',
    confirmPassword: '',
  });

  // ── Company info (solo usuarios comerciales) ──
  const [companyPais, setCompanyPais] = useState('');
  const [editPais, setEditPais]       = useState(false);

  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,
      email: user.email || '',
      contact_name: user.contact_name || '',
    }));

    // Cargar pais de empresa para usuarios comerciales
    if (user.client_id && token) {
      apiFetch<{ pais?: string | null }>('/api/client', { token })
        .then(res => setCompanyPais(res.pais || ''))
        .catch(() => {});
    }
  }, [user, token]);
  

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [successProfile, setSuccessProfile] = useState('');
  const [error, setError] = useState('');
  
  /* ================================
     PASSWORD VALIDATION UI
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
     UPDATE PROFILE
  ================================= */

  const handleProfileSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setError('');
    setSuccessProfile('');
    setLoadingProfile(true);

    try {
      await apiFetch('/api/me', {
        method: 'PUT',
        token,
        body: {
          email: form.email,
          contact_name: form.contact_name,
        },
      });

      updateUser({
        email: form.email,
        contact_name: form.contact_name,
      });

      if (user?.client_id) {
        await apiFetch('/api/client/info', {
          method: 'PATCH',
          token,
          body: { pais: companyPais },
        });
      }

      setSuccessProfile('Perfil actualizado correctamente');
      setEditContact(false);
      setEditPais(false);
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoadingProfile(false);
    }
  };

  /* ================================
     CHANGE PASSWORD
  ================================= */

  const handlePasswordSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setError('');

    if (!allValid) {
      setError(
        'La contraseña no cumple los requisitos'
      );
      return;
    }

    setLoadingPassword(true);

    try {
      await apiFetch('/api/me/change-password', {
        method: 'POST',
        token,
        body: {
          current_password: currentPassword,
          new_password: form.password,
          
        },
      });

      alert(
        'Contraseña cambiada con éxito. Debes iniciar sesión nuevamente.'
      );

      // 🔒 Logout forzado por seguridad
      logout();
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoadingPassword(false);
    }
  };

  /* ================================
     RENDER
  ================================= */

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="bg-white w-full max-w-5xl mx-auto rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-semibold mb-8">
            Mi Perfil
          </h2>

          {/* MESSAGES */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
              {error}
            </div>
          )}

          {successProfile && (
            <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded">
              {successProfile}
            </div>
          )}


          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* ================= DATOS ================= */}
            <div className="space-y-10">
              <h3 className="text-lg font-semibold">
                Datos del perfil
              </h3>

              <ProfileInput
                label="Correo"
                value={form.email}
              />

              <ProfileInput
                label="Rol"
                value={user?.global_role || user?.client_role || '—'}
              />

              {/* EDITABLE */}
              <form
                onSubmit={handleProfileSubmit}
                className="space-y-6"
              >
                <EditableField
                  label="Nombre de contacto"
                  value={form.contact_name}
                  editable={editContact}
                  onEdit={() =>
                    setEditContact(!editContact)
                  }
                  onChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      contact_name: v,
                    }))
                  }
                />

                {user?.client_id && (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">País</label>
                    {editPais ? (
                      <select
                        value={companyPais}
                        onChange={e => setCompanyPais(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg bg-white"
                      >
                        <option value="">Selecciona un país</option>
                        {PAISES.map(p => <option key={p}>{p}</option>)}
                      </select>
                    ) : (
                      <input
                        value={companyPais || '—'}
                        disabled
                        className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                      />
                    )}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setEditPais(!editPais)}
                        className="text-blue-600 text-sm font-medium"
                      >
                        {editPais ? 'Cancelar' : 'Editar'}
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loadingProfile}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                >
                  {loadingProfile
                    ? 'Guardando…'
                    : 'Guardar perfil'}
                </button>
              </form>
            </div>

            {/* ================= SEGURIDAD ================= */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Seguridad
              </h3>

              <form
                onSubmit={handlePasswordSubmit}
                className="space-y-4"
              >
                {passwordUI}

                <button
                  type="submit"
                  disabled={
                    loadingPassword || !allValid
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  {loadingPassword
                    ? 'Cambiando…'
                    : 'Cambiar contraseña'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </main>
    </PrivateRoute>
  );
}

