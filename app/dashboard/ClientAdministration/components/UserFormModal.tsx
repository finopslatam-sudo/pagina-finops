'use client';

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { ClientUser, UserForm } from "../types";

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

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[480px] p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {editingUser ? "Editar usuario" : "Crear usuario"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Nombre */}
        <input
          type="text"
          placeholder="Nombre"
          value={userForm.name}
          onChange={(e) => onChangeForm({ ...userForm, name: e.target.value })}
          className="w-full border rounded p-2"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={userForm.email}
          onChange={(e) => onChangeForm({ ...userForm, email: e.target.value })}
          className="w-full border rounded p-2"
        />

        {/* Role */}
        <select
          value={userForm.role}
          onChange={(e) => onChangeForm({ ...userForm, role: e.target.value })}
          className="w-full border rounded p-2"
        >
          <option value="viewer">Viewer</option>
          <option value="finops_admin">FinOps Admin</option>
          <option value="owner">Owner</option>
        </select>

        {/* Reset password toggle — edit mode only */}
        {editingUser && (
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
                ⚠ Se generará una contraseña temporal y el usuario deberá cambiarla al iniciar
                sesión.
              </p>
            )}
          </div>
        )}

        {/* Password fields — create mode only */}
        {!editingUser && (
          <>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
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
                type={showConfirmPassword ? "text" : "password"}
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
        )}

        {/* Submit button */}
        <button
          onClick={onSubmit}
          disabled={savingUser}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {savingUser ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Guardando...
            </>
          ) : editingUser ? (
            "Guardar cambios"
          ) : (
            "Crear usuario"
          )}
        </button>
      </div>
    </div>
  );
}
