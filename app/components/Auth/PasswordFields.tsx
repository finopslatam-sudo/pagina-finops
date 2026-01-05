'use client';

import { useMemo, useState } from 'react';

interface Props {
  currentPassword?: string;
  setCurrentPassword?: (v: string) => void;
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
  const [show, setShow] = useState(false);

  const rules = useMemo(() => ({
    length: password.length >= 8 && password.length <= 12,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
    notSame: currentPassword ? password !== currentPassword : true,
  }), [password, currentPassword]);

  const allValid = Object.values(rules).every(Boolean);

  const Rule = ({ ok, text }: { ok: boolean; text: string }) => (
    <li className="flex items-center gap-2 text-sm">
      <span className={ok ? 'text-green-600' : 'text-gray-400'}>
        {ok ? '✔️' : '○'}
      </span>
      <span className={ok ? 'text-green-700' : 'text-gray-600'}>
        {text}
      </span>
    </li>
  );

  return {
    allValid,
    component: (
      <>
        {setCurrentPassword && (
          <input
            type={show ? 'text' : 'password'}
            placeholder="Clave actual"
            className="w-full border rounded-lg p-2 mb-3"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        )}

        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            placeholder="Nueva contraseña"
            className="w-full border rounded-lg p-2 pr-12 mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-2.5 text-gray-500"
          >
            👁
          </button>
        </div>

        <input
          type={show ? 'text' : 'password'}
          placeholder="Confirmar contraseña"
          className="w-full border rounded-lg p-2 mb-3"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <ul className="mb-4 space-y-1">
          <Rule ok={rules.length} text="Entre 8 y 12 caracteres" />
          <Rule ok={rules.upper} text="Al menos una letra mayúscula" />
          <Rule ok={rules.lower} text="Al menos una letra minúscula" />
          <Rule ok={rules.number} text="Al menos un número" />
          <Rule ok={rules.special} text="Al menos un carácter especial" />
          {currentPassword && (
            <Rule ok={rules.notSame} text="No puede ser igual a la actual" />
          )}
        </ul>
      </>
    ),
  };
}
