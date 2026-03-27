'use client';

import { useCreateClientForm } from '../hooks/useCreateClientForm';
import CompanySection   from './CompanySection';
import OwnerSection     from './OwnerSection';
import ExtraUserSection from './ExtraUserSection';

export type CreateClientPayload = {
  company_name: string;
  email: string;
  contact_name?: string;
  phone?: string;
  is_active: boolean;
  plan_id: number;
  owner: {
    email: string;
    contact_name: string;
    password: string;
    password_confirm: string;
  };
  extra_users?: {
    email: string;
    contact_name: string;
    client_role: 'finops_admin' | 'viewer';
    password: string;
    password_confirm: string;
  }[];
};

interface Props {
  onClose:  () => void;
  onCreate: (payload: CreateClientPayload) => Promise<void>;
}

export default function CreateClientModal({ onClose, onCreate }: Props) {
  const form = useCreateClientForm();

  const submit = async () => {
    form.setError(null);
    const err = form.validate();
    if (err) { form.setError(err); return; }

    form.setLoading(true);
    try {
      await onCreate(form.buildPayload());
    } catch (e: unknown) {
      const msg = (e as { error?: string; message?: string })?.error
                ?? (e as { message?: string })?.message
                ?? 'Error al crear cliente';
      form.setError(msg);
    } finally {
      form.setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto">

        <h2 className="text-lg font-semibold mb-6">Crear Cliente</h2>

        {form.error && (
          <p className="text-sm text-red-600 mb-4">{form.error}</p>
        )}

        <CompanySection
          companyName={form.companyName} setCompanyName={form.setCompanyName}
          email={form.email}             setEmail={form.setEmail}
          contactName={form.contactName} setContactName={form.setContactName}
          phone={form.phone}             setPhone={form.setPhone}
          planId={form.planId}           setPlanId={form.setPlanId}
        />

        <OwnerSection
          ownerEmail={form.ownerEmail}                     setOwnerEmail={form.setOwnerEmail}
          ownerName={form.ownerName}                       setOwnerName={form.setOwnerName}
          ownerPassword={form.ownerPassword}               setOwnerPassword={form.setOwnerPassword}
          ownerPasswordConfirm={form.ownerPasswordConfirm} setOwnerPasswordConfirm={form.setOwnerPasswordConfirm}
          showOwnerPass={form.showOwnerPass}   setShowOwnerPass={form.setShowOwnerPass}
          showOwnerPass2={form.showOwnerPass2} setShowOwnerPass2={form.setShowOwnerPass2}
        />

        <ExtraUserSection
          addExtraUser={form.addExtraUser}                       setAddExtraUser={form.setAddExtraUser}
          extraEmail={form.extraEmail}                           setExtraEmail={form.setExtraEmail}
          extraName={form.extraName}                             setExtraName={form.setExtraName}
          extraRole={form.extraRole}                             setExtraRole={form.setExtraRole}
          extraPassword={form.extraPassword}                     setExtraPassword={form.setExtraPassword}
          extraPasswordConfirm={form.extraPasswordConfirm}       setExtraPasswordConfirm={form.setExtraPasswordConfirm}
          showExtraPass={form.showExtraPass}   setShowExtraPass={form.setShowExtraPass}
          showExtraPass2={form.showExtraPass2} setShowExtraPass2={form.setShowExtraPass2}
        />

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:underline">
            Cancelar
          </button>
          <button
            onClick={submit}
            disabled={form.loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {form.loading ? 'Creando…' : 'Crear cliente'}
          </button>
        </div>

      </div>
    </div>
  );
}
