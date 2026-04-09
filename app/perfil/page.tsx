'use client';

export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react';
import PrivateRoute from '@/app/components/Auth/PrivateRoute';
import { useAuth } from '@/app/context/AuthContext';
import { PasswordFields } from '@/app/components/Auth/PasswordFields';
import { apiFetch } from '@/app/lib/api';
import { EditableField, ProfileInput } from './components/ProfileFields';

const PAISES = [
  'México', 'Chile', 'Colombia', 'Argentina', 'Perú', 'Brasil',
  'Ecuador', 'Uruguay', 'Bolivia', 'Paraguay', 'Venezuela', 'Otro',
];

type MfaPolicy =
  | 'disabled'
  | 'optional'
  | 'required'
  | 'required_for_admins';

interface MfaStatus {
  policy: MfaPolicy;
  enabled: boolean;
  required_now: boolean;
  can_disable: boolean;
  has_recovery_codes: boolean;
  confirmed_at?: string | null;
  last_used_at?: string | null;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

const POLICY_LABELS: Record<MfaPolicy, string> = {
  disabled: 'Desactivado',
  optional: 'Opcional por usuario',
  required: 'Obligatorio para todos',
  required_for_admins: 'Obligatorio para owners y admins',
};

export default function PerfilPage() {
  const { user, token, updateUser, logout } = useAuth();

  const [editContact, setEditContact] = useState(false);
  const [editPais, setEditPais] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [companyPais, setCompanyPais] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingMfa, setLoadingMfa] = useState(false);

  const [successProfile, setSuccessProfile] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '',
    contact_name: '',
    password: '',
    confirmPassword: '',
  });

  const [mfaStatus, setMfaStatus] = useState<MfaStatus | null>(null);
  const [mfaSetup, setMfaSetup] = useState<{ secret: string; otpauth_url: string } | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaCurrentPassword, setMfaCurrentPassword] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      ...prev,
      email: user.email || '',
      contact_name: user.contact_name || '',
    }));

    if (token) {
      apiFetch<{ mfa: MfaStatus }>('/api/me/security', { token })
        .then((res) => setMfaStatus(res.mfa))
        .catch(() => {});
    }

    if (user.client_id && token) {
      apiFetch<{ pais?: string | null }>('/api/client', { token })
        .then((res) => setCompanyPais(res.pais || ''))
        .catch(() => {});
    }
  }, [user, token]);

  const { allValid, component: passwordUI } = PasswordFields({
    currentPassword,
    setCurrentPassword,
    password: form.password,
    setPassword: (v: string) => setForm((p) => ({ ...p, password: v })),
    confirm: form.confirmPassword,
    setConfirm: (v: string) => setForm((p) => ({ ...p, confirmPassword: v })),
  });

  const refreshMfaStatus = async () => {
    if (!token) return;
    const res = await apiFetch<{ mfa: MfaStatus }>('/api/me/security', { token });
    setMfaStatus(res.mfa);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
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
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Error inesperado'));
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!allValid) {
      setError('La contraseña no cumple los requisitos');
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

      alert('Contraseña cambiada con éxito. Debes iniciar sesión nuevamente.');
      logout();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Error inesperado'));
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleStartMfaSetup = async () => {
    if (!token) return;
    setError('');
    setLoadingMfa(true);

    try {
      const res = await apiFetch<{ secret: string; otpauth_url: string }>('/api/me/mfa/setup', {
        method: 'POST',
        token,
      });
      setMfaSetup(res);
      setRecoveryCodes([]);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo iniciar la configuración MFA'));
    } finally {
      setLoadingMfa(false);
    }
  };

  const handleConfirmMfa = async () => {
    if (!token || !mfaCode.trim()) return;
    setError('');
    setLoadingMfa(true);

    try {
      const res = await apiFetch<{ mfa: MfaStatus; recovery_codes: string[] }>('/api/me/mfa/confirm', {
        method: 'POST',
        token,
        body: { code: mfaCode.trim() },
      });
      setMfaSetup(null);
      setMfaCode('');
      setRecoveryCodes(res.recovery_codes || []);
      setMfaStatus(res.mfa);
      updateUser({ mfa_enabled: true, mfa_required_now: res.mfa.required_now });
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo confirmar MFA'));
    } finally {
      setLoadingMfa(false);
    }
  };

  const handleDisableMfa = async () => {
    if (!token || !mfaCurrentPassword.trim()) return;
    setError('');
    setLoadingMfa(true);

    try {
      const res = await apiFetch<{ mfa: MfaStatus }>('/api/me/mfa/disable', {
        method: 'POST',
        token,
        body: { current_password: mfaCurrentPassword },
      });
      setMfaCurrentPassword('');
      setMfaSetup(null);
      setRecoveryCodes([]);
      setMfaStatus(res.mfa);
      updateUser({ mfa_enabled: false, mfa_required_now: res.mfa.required_now });
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo desactivar MFA'));
    } finally {
      setLoadingMfa(false);
    }
  };

  const handleRegenerateRecoveryCodes = async () => {
    if (!token) return;
    setError('');
    setLoadingMfa(true);

    try {
      const res = await apiFetch<{ recovery_codes: string[] }>('/api/me/mfa/recovery-codes', {
        method: 'POST',
        token,
      });
      setRecoveryCodes(res.recovery_codes || []);
      await refreshMfaStatus();
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudieron regenerar los recovery codes'));
    } finally {
      setLoadingMfa(false);
    }
  };

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="bg-white w-full max-w-5xl mx-auto rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-8">Mi Perfil</h2>

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
            <div className="space-y-10">
              <h3 className="text-lg font-semibold">Datos del perfil</h3>

              <ProfileInput label="Correo" value={form.email} />
              <ProfileInput
                label="Rol"
                value={user?.global_role || user?.client_role || '—'}
              />

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <EditableField
                  label="Nombre de contacto"
                  value={form.contact_name}
                  editable={editContact}
                  onEdit={() => setEditContact(!editContact)}
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
                        onChange={(e) => setCompanyPais(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg bg-white"
                      >
                        <option value="">Selecciona un país</option>
                        {PAISES.map((p) => <option key={p}>{p}</option>)}
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
                  {loadingProfile ? 'Guardando…' : 'Guardar perfil'}
                </button>
              </form>
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="text-lg font-semibold mb-4">Seguridad</h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  {passwordUI}

                  <button
                    type="submit"
                    disabled={loadingPassword || !allValid}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                  >
                    {loadingPassword ? 'Cambiando…' : 'Cambiar contraseña'}
                  </button>
                </form>
              </div>

              <div className="rounded-2xl border border-gray-200 p-6 space-y-5">
                <div>
                  <h4 className="text-base font-semibold text-gray-900">
                    Autenticación multifactor
                  </h4>
                  <p className="text-sm text-gray-600 mt-2">
                    Tu organización puede dejar MFA opcional u obligatorio. Si está permitido, puedes activarlo aquí.
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 px-4 py-4 text-sm text-blue-900 space-y-1">
                  <p><strong>Política:</strong> {mfaStatus ? POLICY_LABELS[mfaStatus.policy] : 'Cargando...'}</p>
                  <p><strong>Estado:</strong> {mfaStatus?.enabled ? 'Activado' : 'Desactivado'}</p>
                  {mfaStatus?.confirmed_at && (
                    <p><strong>Activado el:</strong> {new Date(mfaStatus.confirmed_at).toLocaleString()}</p>
                  )}
                  {mfaStatus?.last_used_at && (
                    <p><strong>Último uso:</strong> {new Date(mfaStatus.last_used_at).toLocaleString()}</p>
                  )}
                </div>

                {!mfaStatus?.enabled && (
                  <button
                    type="button"
                    onClick={handleStartMfaSetup}
                    disabled={loadingMfa}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg disabled:opacity-50"
                  >
                    {loadingMfa ? 'Preparando MFA…' : 'Activar multifactor'}
                  </button>
                )}

                {mfaSetup && (
                  <div className="space-y-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                    <p className="text-sm text-indigo-900">
                      Configura tu app autenticadora con este secreto y luego ingresa el código de 6 dígitos.
                    </p>
                    <div className="font-mono text-sm break-all text-indigo-950">
                      {mfaSetup.secret}
                    </div>
                    <a
                      href={mfaSetup.otpauth_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-700 underline"
                    >
                      Abrir configuración en la app autenticadora
                    </a>
                    <div className="flex gap-3">
                      <input
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value)}
                        placeholder="Código de 6 dígitos"
                        className="flex-1 px-4 py-2 border rounded-lg bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleConfirmMfa}
                        disabled={loadingMfa}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                )}

                {mfaStatus?.enabled && (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={handleRegenerateRecoveryCodes}
                      disabled={loadingMfa}
                      className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg disabled:opacity-50"
                    >
                      Regenerar recovery codes
                    </button>

                    {mfaStatus.can_disable && (
                      <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm text-amber-900">
                          Para desactivar MFA, confirma tu contraseña actual.
                        </p>
                        <input
                          type="password"
                          value={mfaCurrentPassword}
                          onChange={(e) => setMfaCurrentPassword(e.target.value)}
                          placeholder="Contraseña actual"
                          className="w-full px-4 py-2 border rounded-lg bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleDisableMfa}
                          disabled={loadingMfa}
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg disabled:opacity-50"
                        >
                          Desactivar multifactor
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {recoveryCodes.length > 0 && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-sm font-medium text-emerald-900 mb-3">
                      Guarda estos recovery codes en un lugar seguro.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {recoveryCodes.map((code) => (
                        <div
                          key={code}
                          className="font-mono text-sm bg-white border rounded-lg px-3 py-2"
                        >
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </PrivateRoute>
  );
}
