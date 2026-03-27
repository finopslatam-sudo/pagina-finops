import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';

type ClientItem = { id: number; company_name: string };

export function useCreateUserFormAdmin(onCreated: () => void, onClose: () => void) {
  const { token, user: currentUser } = useAuth();
  const isRoot  = currentUser?.global_role === 'root';
  const isAdmin = currentUser?.global_role === 'admin';

  const [type, setType]                 = useState<'global' | 'client'>('client');
  const [clients, setClients]           = useState<ClientItem[]>([]);
  const [clientId, setClientId]         = useState<number | null>(null);
  const [clientRole, setClientRole]     = useState<'owner' | 'finops_admin' | 'viewer'>('owner');
  const [globalRole, setGlobalRole]     = useState<'root' | 'admin' | 'support'>('admin');
  const [email, setEmail]               = useState('');
  const [contactName, setContactName]   = useState('');
  const [password, setPassword]         = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPass, setShowPass]         = useState(false);
  const [showPass2, setShowPass2]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [success, setSuccess]           = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiFetch<{ data: ClientItem[] }>('/api/admin/clients', { token })
      .then(res => setClients(res.data))
      .catch(() => setClients([]));
  }, [token]);

  const submit = async () => {
    if (!token) return;
    setError(null);
    setLoading(true);
    try {
      if (!email || !contactName) throw new Error('Email y nombre son obligatorios');
      if (!password || password.length < 8) throw new Error('Password mínimo 8 caracteres');
      if (password !== passwordConfirm) throw new Error('Las contraseñas no coinciden');

      const payload: Record<string, unknown> = { type, email, contact_name: contactName, password, password_confirm: passwordConfirm, force_password_change: true };
      if (type === 'global') {
        payload.global_role = globalRole;
      } else {
        if (!clientId) throw new Error('Debe seleccionar un cliente');
        payload.client_id = clientId;
        payload.client_role = clientRole;
      }

      await apiFetch('/api/admin/users/with-password', { method: 'POST', token, body: payload });
      setSuccess('Usuario creado correctamente');
      await onCreated();
      setTimeout(onClose, 1200);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  return {
    isRoot, isAdmin, type, setType, clients, clientId, setClientId,
    clientRole, setClientRole, globalRole, setGlobalRole,
    email, setEmail, contactName, setContactName,
    password, setPassword, passwordConfirm, setPasswordConfirm,
    showPass, setShowPass, showPass2, setShowPass2,
    loading, error, success, submit,
  };
}
