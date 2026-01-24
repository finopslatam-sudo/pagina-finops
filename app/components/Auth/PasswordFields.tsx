'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useEffect, useMemo, useState } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

/* =====================================================
   TYPES
===================================================== */

interface Props {
  currentPassword: string;
  setCurrentPassword: (v: string) => void;

  password: string;
  setPassword: (v: string) => void;

  confirm: string;
  setConfirm: (v: string) => void;
}

/* =====================================================
   COMPONENT
===================================================== */

/**
 * PasswordFields
 *
 * Componente reutilizable para:
 * - Cambio forzado de contraseña
 * - Cambio voluntario
 * - Reset por administrador
 *
 * ⚠️ Define la política OFICIAL de contraseñas del sistema.
 */
export function PasswordFields({
  currentPassword,
  setCurrentPassword,
  password,
  setPassword,
  confirm,
  setConfirm,
}: Props) {
  /* =========================
     👁️ VISIBILIDAD
  ========================== */

  const [showCurrent, setShowCurrent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* =========================
     🔒 AUTO OCULTAR AL MONTAR
     (defensa UX + shoulder surfing)
  ========================== */

  useEffect(() => {
    setShowCurrent(false);
    setShowPassword(false);
    setShowConfirm(false);
  }, []);

  /* =========================
     📏 VALIDACIONES
     (single source of truth)
  ========================== */

  const rules = useMemo(() => {
    const hasAll =
      currentPassword.length > 0 &&
      password.length > 0;

    return {
      length:
        password.length >= 8 &&
        password.length <= 12,

      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),

      notSame:
        hasAll && password !== currentPassword,

      match:
        password === confirm && confirm.length > 0,
    };
  }, [password, confirm, currentPassword]);

  /**
   * Contraseña válida SOLO si todas las reglas pasan
   */
  const allValid =
    rules.length &&
    rules.upper &&
    rules.lower &&
    rules.number &&
    rules.special &&
    rules.notSame &&
    rules.match;

  /* =========================
     📊 PASSWORD STRENGTH
     (informativo, no decisivo)
  ========================== */

  const strengthScore =
    Object.values(rules).filter(Boolean).length;

  const strengthColor =
    strengthScore <= 3
      ? 'bg-red-500'
      : strengthScore <= 5
      ? 'bg-yellow-500'
      : 'bg-green-500';

  /* =========================
     UI HELPERS
  ========================== */

  const Rule = ({
    ok,
    text,
  }: {
    ok: boolean;
    text: string;
  }) => (
    <li className="flex items-center gap-2 text-sm">
      <span className={ok ? 'text-green-600' : 'text-red-600'}>
        {ok ? '✔️' : '❌'}
      </span>
      <span className={ok ? 'text-green-700' : 'text-red-600'}>
        {text}
      </span>
    </li>
  );

  const EyeButton = ({
    open,
    onClick,
  }: {
    open: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      aria-label={open ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    >
      {open ? (
        <EyeSlashIcon className="w-5 h-5" />
      ) : (
        <EyeIcon className="w-5 h-5" />
      )}
    </button>
  );

  /* =====================================================
     RETURN API
     (pattern funcional intencional)
  ===================================================== */

  return {
    allValid,

    component: (
      <>
        {/* =========================
           CLAVE ACTUAL
        ========================== */}
        <div className="relative mb-3">
          <input
            type={showCurrent ? 'text' : 'password'}
            placeholder="Clave actual"
            className="w-full border rounded-lg p-2 pr-10"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            autoComplete="current-password"
          />
          <EyeButton
            open={showCurrent}
            onClick={() =>
              setShowCurrent(!showCurrent)
            }
          />
        </div>

        {/* =========================
           NUEVA CONTRASEÑA
        ========================== */}
        <div className="relative mb-1">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Nueva contraseña"
            className="w-full border rounded-lg p-2 pr-10"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            autoComplete="new-password"
          />
          <EyeButton
            open={showPassword}
            onClick={() =>
              setShowPassword(!showPassword)
            }
          />
        </div>

        {/* =========================
           STRENGTH BAR
        ========================== */}
        <div className="mb-3 h-2 w-full rounded bg-gray-200 overflow-hidden">
          <div
            className={`h-full transition-all ${strengthColor}`}
            style={{
              width: `${(strengthScore / 7) * 100}%`,
            }}
          />
        </div>

        {/* =========================
           CONFIRMAR CONTRASEÑA
        ========================== */}
        <div className="relative mb-3">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            className="w-full border rounded-lg p-2 pr-10"
            value={confirm}
            onChange={(e) =>
              setConfirm(e.target.value)
            }
            autoComplete="new-password"
          />
          <EyeButton
            open={showConfirm}
            onClick={() =>
              setShowConfirm(!showConfirm)
            }
          />
        </div>

        {/* =========================
           REGLAS DE CONTRASEÑA
        ========================== */}
        <ul className="mb-4 space-y-1">
          <Rule ok={rules.length} text="Entre 8 y 12 caracteres" />
          <Rule ok={rules.upper} text="Al menos una letra mayúscula" />
          <Rule ok={rules.lower} text="Al menos una letra minúscula" />
          <Rule ok={rules.number} text="Al menos un número" />
          <Rule ok={rules.special} text="Al menos un carácter especial" />
          <Rule
            ok={rules.notSame}
            text="La nueva clave NO puede ser igual a la actual"
          />
          <Rule
            ok={rules.match}
            text="Las contraseñas coinciden"
          />
        </ul>
      </>
    ),
  };
}
