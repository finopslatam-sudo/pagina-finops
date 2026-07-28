'use client';

import { AdminUser } from '../hooks/useAdminUsers';
import { useUserForm } from '../hooks/useUserForm';
import { UserFormModal as SharedUserFormModal, UserFormField } from '@/app/components/shared/UserManagement';
import ResetPasswordSection from './ResetPasswordSection';

interface Props {
  user: AdminUser;
  onClose: () => void;
  onSaved: () => void;
}

export default function UserFormModal({ user, onClose, onSaved }: Props) {
  const form = useUserForm(user, onSaved);
  const isGlobalUser = user.type === 'global';

  const fields: UserFormField[] = [
    {
      key: 'contact_name',
      label: 'Nombre de contacto',
      type: 'text',
      value: form.contactName,
      onChange: (v) => form.setContactName(String(v)),
      disabled: !form.canEdit,
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      value: form.email,
      onChange: (v) => form.setEmail(String(v)),
      disabled: !form.canEdit,
    },
    {
      key: 'global_role',
      label: 'Rol del sistema',
      type: 'select',
      visible: isGlobalUser,
      value: form.globalRole,
      onChange: (v) => form.setGlobalRole(String(v)),
      disabled:
        !form.canEdit ||
        form.isSelf ||
        (form.isSupport && user.global_role !== null) ||
        (form.isAdmin && user.global_role === 'root'),
      options: [
        ...(form.isRoot ? [{ value: 'root', label: 'Root' }] : []),
        ...(form.isRoot || form.isAdmin ? [{ value: 'admin', label: 'Admin' }] : []),
        ...(form.isRoot || form.isAdmin ? [{ value: 'support', label: 'Support' }] : []),
      ],
    },
    {
      key: 'client_role',
      label: 'Rol del cliente',
      type: 'select',
      visible: !isGlobalUser,
      value: form.clientRole,
      onChange: (v) => form.setClientRole(String(v)),
      disabled: !form.canEdit,
      options: [
        { value: 'owner', label: 'Owner' },
        { value: 'finops_admin', label: 'FinOps Admin' },
        { value: 'viewer', label: 'Viewer' },
      ],
    },
    {
      key: 'is_active',
      label: 'Usuario activo',
      type: 'checkbox',
      value: form.isActive,
      onChange: (v) => form.setIsActive(Boolean(v)),
      disabled: !form.canEdit,
    },
  ];

  return (
    <SharedUserFormModal
      title="Editar usuario"
      subtitle={
        !form.canEdit
          ? 'Este usuario no puede ser modificado por tu rol.'
          : user.company_name ?? 'Usuario del sistema'
      }
      fields={fields}
      extraContent={
        form.canEdit ? (
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
        ) : null
      }
      errorMessage={form.error ?? undefined}
      successMessage={form.success ? '✅ Usuario actualizado correctamente' : undefined}
      onClose={onClose}
      onSubmit={form.handleSave}
      submitLabel="Guardar"
      submitting={form.saving}
      submitDisabled={!form.canEdit}
    />
  );
}
