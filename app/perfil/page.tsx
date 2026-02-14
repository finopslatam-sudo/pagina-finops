'use client';

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
  const { user, token, updateUser, planState, logout } = useAuth();

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

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const [successProfile, setSuccessProfile] = useState('');
  const [error, setError] = useState('');

  /* ================================
     INIT FORM
  ================================= */

  useEffect(() => {
    if (!user) return;

    setForm({
      email: user.email || '',
      contact_name: user.contact_name || '',
      password: '',
      confirmPassword: '',
    });
  }, [user]);

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

      setSuccessProfile(
        'Perfil actualizado correctamente'
      );
      setEditContact(false);
      setEditPhone(false);
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

              {/* INFO NO EDITABLE */}
              <div className="space-y-5">
                <Input label="Empresa" value={user?.company_name} />
                <Input label="Correo" value={user?.email} />
                <Input
                  label="Plan"
                  value={
                    planState.status === 'assigned' && planState.plan
                      ? planState.plan.name
                      : '—'
                  }
                />
              </div>

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

/* =====================================================
   UI HELPERS (LOCAL)
===================================================== */

function Input({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">
        {label}
      </label>
      <input
        value={value || ''}
        disabled
        className="w-full px-4 py-2 border rounded-lg bg-gray-100"
      />
    </div>
  );
}

function EditableField({
  label,
  value,
  editable,
  onEdit,
  onChange,
}: {
  label: string;
  value: string;
  editable: boolean;
  onEdit: () => void;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={!editable}
        className={`w-full px-4 py-3 border rounded-xl ${
          editable
            ? 'bg-white'
            : 'bg-gray-100 cursor-not-allowed'
        }`}
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onEdit}
          className="text-blue-600 text-sm font-medium"
        >
          {editable ? 'Cancelar' : 'Editar'}
        </button>
      </div>
    </div>
  );
}
