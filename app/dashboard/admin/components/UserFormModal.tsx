'use client';

import { AdminUser } from '../hooks/useAdminUsers';
import { useUserForm } from '../hooks/useUserForm';
import Modal from '@/app/components/UI/Modal';
import ResetPasswordSection from './ResetPasswordSection';

interface Props {
  user: AdminUser;
  onClose: () => void;
  onSaved: () => void;
}

export default function UserFormModal({ user, onClose, onSaved }: Props) {
  const form = useUserForm(user, onSaved);
  const isGlobalUser = user.type === 'global';

  return (
    <Modal isOpen onClose={onClose}>
      <h2 className="text-xl font-semibold mb-2">Editar usuario</h2>
      <p className="text-sm text-gray-500 mb-4">{user.company_name ?? 'Usuario del sistema'}</p>
      {!form.canEdit && <p className="text-sm text-gray-500 mb-4">Este usuario no puede ser modificado por tu rol.</p>}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nombre de contacto</label>
          <input disabled={!form.canEdit} value={form.contactName} onChange={e => form.setContactName(e.target.value)} className="w-full border rounded px-3 py-2 disabled:bg-gray-100" />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input disabled={!form.canEdit} value={form.email} onChange={e => form.setEmail(e.target.value)} className="w-full border rounded px-3 py-2 disabled:bg-gray-100" />
        </div>

        {isGlobalUser && (
          <div>
            <label className="block text-sm font-medium">Rol del sistema</label>
            <select
              disabled={!form.canEdit || form.isSelf || (form.isSupport && user.global_role !== null) || (form.isAdmin && user.global_role === 'root')}
              value={form.globalRole}
              onChange={e => form.setGlobalRole(e.target.value)}
              className="w-full border rounded px-3 py-2 disabled:bg-gray-100"
            >
              {form.isRoot && <option value="root">Root</option>}
              {(form.isRoot || form.isAdmin) && <option value="admin">Admin</option>}
              {(form.isRoot || form.isAdmin) && <option value="support">Support</option>}
            </select>
          </div>
        )}

        {!isGlobalUser && (
          <div>
            <label className="block text-sm font-medium">Rol del cliente</label>
            <select disabled={!form.canEdit} value={form.clientRole} onChange={e => form.setClientRole(e.target.value)} className="w-full border rounded px-3 py-2 disabled:bg-gray-100">
              <option value="owner">Owner</option>
              <option value="finops_admin">FinOps Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input type="checkbox" disabled={!form.canEdit} checked={form.isActive} onChange={e => form.setIsActive(e.target.checked)} />
          <span>Usuario activo</span>
        </div>

        {form.canEdit && (
          <ResetPasswordSection
            newPassword={form.newPassword}
            confirmPassword={form.confirmPassword}
            showPassword={form.showPassword}
            showConfirmPassword={form.showConfirmPassword}
            resetLoading={form.resetLoading}
            resetSuccess={form.resetSuccess}
            resetError={form.resetError}
            setNewPassword={form.setNewPassword}
            setConfirmPassword={form.setConfirmPassword}
            setShowPassword={form.setShowPassword}
            setShowConfirmPassword={form.setShowConfirmPassword}
            onReset={form.handleResetPassword}
          />
        )}

        {form.error   && <p className="text-sm text-red-600">{form.error}</p>}
        {form.success && <p className="text-sm text-green-600">✅ Usuario actualizado correctamente</p>}

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          <button onClick={form.handleSave} disabled={form.saving || !form.canEdit} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  );
}
