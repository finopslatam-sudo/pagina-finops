'use client';

/* =====================================================
   FORCE CHANGE PASSWORD MODAL — FINOPSLATAM
   - UI pura
   - No conoce API_URL
   - No hace fetch directo
===================================================== */

/* =====================================================
   IMPORTS
===================================================== */

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';
import { PasswordFields } from './PasswordFields';

/* =====================================================
   COMPONENT
===================================================== */

export default function ForceChangePasswordModal() {
  const { user, token, logout } = useAuth();

  /**
   * Seguridad defensiva:
   * - Si no hay usuario o token, no renderiza
   */
  if (!user || !token) return null;

  /* =========================
     STATE
  ========================== */

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* =========================
     PASSWORD VALIDATION UI
  ========================== */

  const {
    allValid,
    component: passwordUI,
  } = PasswordFields({
    currentPassword,
    setCurrentPassword,
    password,
    setPassword,
    confirm,
    setConfirm,
  });

  /* =========================
     SUBMIT HANDLER
  ========================== */

  const submit = async () => {
    /* ---------- Validaciones frontend ---------- */

    if (!currentPassword || !password || !confirm) {
      setError('Completa todos los campos');
      return;
    }

    if (!allValid) {
      setError('La contraseña no cumple los requisitos');
      return;
    }

    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    /* ---------- Request ---------- */

    setLoading(true);
    setError('');

    try {
      await apiFetch('/api/auth/change-password', {
        method: 'POST',
        token,
        body: {
          current_password: currentPassword,
          password,
          confirm_password: confirm,
        },
      });

      /* ---------- Éxito ---------- */

      alert(
        'Contraseña cambiada con éxito. Debes iniciar sesión nuevamente.'
      );

      /**
       * 🔒 Logout forzado:
       * - Limpia token
       * - Limpia contexto
       * - Evita estado inconsistente
       */
      logout();
    } catch (err: any) {
      console.error('[CHANGE_PASSWORD_ERROR]', err);
      setError(
        err?.message ||
        'Error inesperado. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

        {/* HEADER */}
        <h2 className="text-xl font-bold mb-1">
          Cambio obligatorio de contraseña
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Por tu seguridad debes modificar tu clave antes de continuar.
        </p>

        {/* ERROR */}
        {error && (
          <div className="mb-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* PASSWORD FIELDS */}
        {passwordUI}

        {/* SUBMIT */}
        <button
          onClick={submit}
          disabled={loading || !allValid}
          className={`
            w-full py-2 rounded-lg text-white font-medium transition
            ${
              allValid
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }
          `}
        >
          {loading ? 'Guardando…' : 'Cambiar contraseña'}
        </button>
      </div>
    </div>
  );
}
