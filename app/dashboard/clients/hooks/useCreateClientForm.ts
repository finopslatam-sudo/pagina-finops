'use client';

import { useState, useEffect } from 'react';
import { PLANS } from '@/app/lib/plans';
import type { CreateClientPayload } from '../components/CreateClientModal';

export function useCreateClientForm() {
  /* ── Client ── */
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail]             = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone]             = useState('');
  const [pais, setPais]               = useState('');
  const [isActive, setIsActive]       = useState(true);
  const [planId, setPlanId]           = useState<number>(PLANS[0].id);

  /* ── Owner ── */
  const [ownerEmail, setOwnerEmail]               = useState('');
  const [ownerName, setOwnerName]                 = useState('');
  const [ownerPassword, setOwnerPassword]         = useState('');
  const [ownerPasswordConfirm, setOwnerPasswordConfirm] = useState('');
  const [showOwnerPass, setShowOwnerPass]         = useState(false);
  const [showOwnerPass2, setShowOwnerPass2]       = useState(false);

  /* ── Extra user ── */
  const [addExtraUser, setAddExtraUser]           = useState(false);
  const [extraEmail, setExtraEmail]               = useState('');
  const [extraName, setExtraName]                 = useState('');
  const [extraRole, setExtraRole]                 = useState<'finops_admin' | 'viewer'>('finops_admin');
  const [extraPassword, setExtraPassword]         = useState('');
  const [extraPasswordConfirm, setExtraPasswordConfirm] = useState('');
  const [showExtraPass, setShowExtraPass]         = useState(false);
  const [showExtraPass2, setShowExtraPass2]       = useState(false);

  /* ── UI ── */
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const reset = () => {
    setCompanyName(''); setEmail(''); setContactName(''); setPhone(''); setPais('');
    setIsActive(true);  setPlanId(PLANS[0].id);
    setOwnerEmail('');  setOwnerName(''); setOwnerPassword(''); setOwnerPasswordConfirm('');
    setShowOwnerPass(false); setShowOwnerPass2(false);
    setAddExtraUser(false);
    setExtraEmail('');  setExtraName(''); setExtraRole('finops_admin');
    setExtraPassword(''); setExtraPasswordConfirm('');
    setShowExtraPass(false); setShowExtraPass2(false);
    setError(null);
  };

  useEffect(() => { reset(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const validate = (): string | null => {
    if (!companyName) return 'El nombre de la empresa es obligatorio';
    if (!email)       return 'El email de la empresa es obligatorio';
    if (!planId)      return 'Debes seleccionar un plan';
    if (!ownerEmail)  return 'El email del Owner es obligatorio';
    if (!ownerName)   return 'El nombre del Owner es obligatorio';
    if (!ownerPassword || ownerPassword.length < 8)
      return 'La contraseña del Owner debe tener al menos 8 caracteres';
    if (ownerPassword !== ownerPasswordConfirm)
      return 'Las contraseñas del Owner no coinciden';
    if (addExtraUser) {
      if (!extraEmail || !extraName)
        return 'Email y nombre del usuario adicional son obligatorios';
      if (!extraPassword || extraPassword.length < 8)
        return 'La contraseña del usuario adicional debe tener mínimo 8 caracteres';
      if (extraPassword !== extraPasswordConfirm)
        return 'Las contraseñas del usuario adicional no coinciden';
    }
    return null;
  };

  const buildPayload = (): CreateClientPayload => {
    const payload: CreateClientPayload = {
      company_name: companyName,
      email,
      contact_name: contactName || undefined,
      phone: phone || undefined,
      pais: pais || undefined,
      is_active: isActive,
      plan_id: planId,
      owner: { email: ownerEmail, contact_name: ownerName, password: ownerPassword, password_confirm: ownerPasswordConfirm },
    };
    if (addExtraUser) {
      payload.extra_users = [{
        email: extraEmail, contact_name: extraName, client_role: extraRole,
        password: extraPassword, password_confirm: extraPasswordConfirm,
      }];
    }
    return payload;
  };

  return {
    /* client */
    companyName, setCompanyName, email, setEmail, contactName, setContactName,
    phone, setPhone, pais, setPais, isActive, setIsActive, planId, setPlanId,
    /* owner */
    ownerEmail, setOwnerEmail, ownerName, setOwnerName,
    ownerPassword, setOwnerPassword, ownerPasswordConfirm, setOwnerPasswordConfirm,
    showOwnerPass, setShowOwnerPass, showOwnerPass2, setShowOwnerPass2,
    /* extra */
    addExtraUser, setAddExtraUser, extraEmail, setExtraEmail, extraName, setExtraName,
    extraRole, setExtraRole, extraPassword, setExtraPassword,
    extraPasswordConfirm, setExtraPasswordConfirm,
    showExtraPass, setShowExtraPass, showExtraPass2, setShowExtraPass2,
    /* ui */
    loading, setLoading, error, setError,
    validate, buildPayload,
  };
}
