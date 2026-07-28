'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ClientUser, UserForm } from '../types';
import { UserFormModal as SharedUserFormModal, UserFormField } from '@/app/components/shared/UserManagement';

interface Props {
  editingUser: ClientUser | null;
  userForm: UserForm;
  savingUser: boolean;
  resetPasswordEnabled: boolean;
  onClose: () => void;
  onChangeForm: (form: UserForm) => void;
  onSetResetPasswordEnabled: (enabled: boolean) => void;
  onSubmit: () => void;
}

export default function UserFormModal({
  editingUser,
  userForm,
  savingUser,
  resetPasswordEnabled,
  onClose,
  onChangeForm,
  onSetResetPasswordEnabled,
  onSubmit,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fields: UserFormField[] = [
    {
      key: 'name',
      label: 'Nombre',
      type: 'text',
      value: userForm.name,
      onChange: (v) => onChangeForm({ ...userForm, name: String(v) }),
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      value: userForm.email,
      onChange: (v) => onChangeForm({ ...userForm, email: String(v) }),
    },
    {
      key: 'role',
      label: 'Rol',
      type: 'select',
      value: userForm.role,
      onChange: (v) => onChangeForm({ ...userForm, role: String(v) }),
      options: [
        { value: 'viewer', label: 'Viewer' },
        { value: 'finops_admin', label: 'FinOps Admin' },
        { value: 'owner', label: 'Owner' },
      ],
    },
  ];

  const passwordToggleFields = !editingUser && (
    <>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Contraseña"
          value={userForm.password}
          onChange={(e) => onChangeForm({ ...userForm, password: e.target.value })}
          className="w-full border rounded p-2 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-2.5 text-gray-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <div className="relative">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirmar contraseña"
          value={userForm.confirmPassword}
          onChange={(e) => onChangeForm({ ...userForm, confirmPassword: e.target.value })}
          className="w-full border rounded p-2 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-2.5 text-gray-500"
        >
          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </>
  );

  const resetPasswordToggle = editingUser && (
    <div className="border rounded-lg p-4 space-y-3">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={resetPasswordEnabled}
          onChange={(e) => onSetResetPasswordEnabled(e.target.checked)}
        />
        <span>Resetear contraseña del usuario</span>
      </label>

      {resetPasswordEnabled && (
        <p className="text-xs text-amber-600">
          ⚠ Se generará una contraseña temporal y el usuario deberá cambiarla al iniciar sesión.
        </p>
      )}
    </div>
  );

  return (
    <SharedUserFormModal
      title={editingUser ? 'Editar usuario' : 'Crear usuario'}
      fields={fields}
      extraContent={
        <>
          {resetPasswordToggle}
          {passwordToggleFields}
        </>
      }
      onClose={onClose}
      onSubmit={onSubmit}
      submitLabel={savingUser ? 'Guardando...' : editingUser ? 'Guardar cambios' : 'Crear usuario'}
      submitting={savingUser}
    />
  );
}
