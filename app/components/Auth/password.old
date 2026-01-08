'use client';

import { useMemo, useState } from 'react';

interface Props {
  currentPassword: string;
  setCurrentPassword: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirm: string;
  setConfirm: (v: string) => void;
}

export function PasswordFields({
  currentPassword,
  setCurrentPassword,
  password,
  setPassword,
  confirm,
  setConfirm,
}: Props) {
  // 👁️ Estados independientes
  const [showCurrent, setShowCurrent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const rules = useMemo(() => {
    const hasAll = currentPassword.length > 0 && password.length > 0;

    return {
      length: password.length >= 8 && password.length <= 12,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      notSame: hasAll && password !== currentPassword,
      match: password === confirm && confirm.length > 0,
    };
  }, [password, confirm, currentPassword]);

  const allValid =
    rules.length &&
    rules.upper &&
    rules.lower &&
    rules.number &&
    rules.special &&
    rules.notSame &&
    rules.match;

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

  return {
    allValid,
    component: (
      <>
        {/* 🔐 CLAVE ACTUAL */}
        <div className="relative mb-3">
          <input
            type={showCurrent ? 'text' : 'password'}
            placeholder="Clave actual"
            className="w-full border rounded-lg p-2 pr-10"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showCurrent ? '🙈' : '👁️'}
          </button>
        </div>

        {/* 🔐 NUEVA CONTRASEÑA */}
        <div className="relative mb-3">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Nueva contraseña"
            className="w-full border rounded-lg p-2 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {/* 🔐 CONFIRMAR CONTRASEÑA */}
        <div className="relative mb-3">
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirmar contraseña"
            className="w-full border rounded-lg p-2 pr-10"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirm ? '🙈' : '👁️'}
          </button>
        </div>

        {/* 📏 REGLAS */}
        <ul className="mb-4 space-y-1">
          <Rule ok={rules.length} text="Entre 8 y 12 caracteres" />
          <Rule ok={rules.upper} text="Al menos una letra mayúscula" />
          <Rule ok={rules.lower} text="Al menos una letra minúscula" />
          <Rule ok={rules.number} text="Al menos un número" />
          <Rule ok={rules.special} text="Al menos un carácter especial" />
          <Rule ok={rules.notSame} text="La nueva clave NO puede ser igual a la actual" />
          <Rule ok={rules.match} text="Las contraseñas coinciden" />
        </ul>
      </>
    ),
  };
}
