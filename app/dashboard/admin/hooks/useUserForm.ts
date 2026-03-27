import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';
import { AdminUser } from './useAdminUsers';

export function useUserForm(user: AdminUser, onSaved: () => void) {
  const { token, user: currentUser } = useAuth();
  const isRoot    = currentUser?.global_role === 'root';
  const isAdmin   = currentUser?.global_role === 'admin';
  const isSupport = currentUser?.global_role === 'support';
  const isSelf    = currentUser?.id === user.id;
  const canEdit   = user.can_edit === true;

  /* edit fields */
  const [email, setEmail]           = useState(user.email);
  const [contactName, setContactName] = useState(user.contact_name || '');
  const [globalRole, setGlobalRole] = useState(user.global_role ?? '');
  const [clientRole, setClientRole] = useState(user.client_role ?? '');
  const [isActive, setIsActive]     = useState(user.is_active);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [success, setSuccess]       = useState(false);

  /* reset password fields */
  const [newPassword, setNewPassword]             = useState('');
  const [confirmPassword, setConfirmPassword]     = useState('');
  const [showPassword, setShowPassword]           = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetLoading, setResetLoading]           = useState(false);
  const [resetSuccess, setResetSuccess]           = useState(false);
  const [resetError, setResetError]               = useState<string | null>(null);

  const handleSave = async () => {
    if (!token || !canEdit) return;
    setSaving(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { email, contact_name: contactName, is_active: isActive };
      if (user.type === 'global') body.global_role = globalRole;
      else body.client_role = clientRole;
      await apiFetch(`/api/admin/users/${user.id}`, { method: 'PATCH', token, body });
      setSuccess(true);
      setTimeout(onSaved, 800);
    } catch {
      setError('No se pudo guardar el usuario');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!token || !canEdit) return;
    setResetError(null);
    setResetSuccess(false);
    if (newPassword.length < 8) { setResetError('La contraseña debe tener al menos 8 caracteres'); return; }
    if (newPassword !== confirmPassword) { setResetError('Las contraseñas no coinciden'); return; }
    try {
      setResetLoading(true);
      await apiFetch(`/api/admin/users/${user.id}/set-password`, { method: 'POST', token, body: { password: newPassword } });
      setResetSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setResetError('No tienes permiso para resetear la contraseña');
    } finally {
      setResetLoading(false);
    }
  };

  return {
    isRoot, isAdmin, isSupport, isSelf, canEdit,
    email, setEmail, contactName, setContactName,
    globalRole, setGlobalRole, clientRole, setClientRole,
    isActive, setIsActive, saving, error, success,
    newPassword, setNewPassword, confirmPassword, setConfirmPassword,
    showPassword, setShowPassword, showConfirmPassword, setShowConfirmPassword,
    resetLoading, resetSuccess, resetError,
    handleSave, handleResetPassword,
  };
}
