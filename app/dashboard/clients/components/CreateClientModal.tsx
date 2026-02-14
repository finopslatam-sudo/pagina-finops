'use client';

/* =====================================================
   CREATE CLIENT MODAL — FINOPSLATAM
   Cliente + Owner obligatorio + Usuarios adicionales
===================================================== */

import { useState, useEffect } from 'react';
import { PLANS } from '@/app/lib/plans';

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
  onClose: () => void;
  onCreate: (payload: CreateClientPayload) => Promise<void>;
}

export default function CreateClientModal({
  onClose,
  onCreate,
}: Props) {
  /* =========================
     CLIENT STATE
  ========================== */

  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [planId, setPlanId] = useState<number>(PLANS[0].id);

  /* =========================
     OWNER STATE (OBLIGATORIO)
  ========================== */

  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerPasswordConfirm, setOwnerPasswordConfirm] = useState('');

  const [showOwnerPass, setShowOwnerPass] = useState(false);
  const [showOwnerPass2, setShowOwnerPass2] = useState(false);

  /* =========================
     EXTRA USER STATE (OPCIONAL)
  ========================== */

  const [addExtraUser, setAddExtraUser] = useState(false);

  const [extraEmail, setExtraEmail] = useState('');
  const [extraName, setExtraName] = useState('');
  const [extraRole, setExtraRole] =
    useState<'finops_admin' | 'viewer'>('finops_admin');
  const [extraPassword, setExtraPassword] = useState('');
  const [extraPasswordConfirm, setExtraPasswordConfirm] =
    useState('');

  const [showExtraPass, setShowExtraPass] = useState(false);
  const [showExtraPass2, setShowExtraPass2] =
    useState(false);

  /* =========================
     UI STATE
  ========================== */

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    // CLIENT
    setCompanyName('');
    setEmail('');
    setContactName('');
    setPhone('');
    setIsActive(true);
    setPlanId(PLANS[0].id);
  
    // OWNER
    setOwnerEmail('');
    setOwnerName('');
    setOwnerPassword('');
    setOwnerPasswordConfirm('');
    setShowOwnerPass(false);
    setShowOwnerPass2(false);
  
    // EXTRA
    setAddExtraUser(false);
    setExtraEmail('');
    setExtraName('');
    setExtraRole('finops_admin');
    setExtraPassword('');
    setExtraPasswordConfirm('');
    setShowExtraPass(false);
    setShowExtraPass2(false);
  
    // UI
    setError(null);
  };

  useEffect(() => {
    resetForm();
  }, []); 

  /* =========================
     SUBMIT
  ========================== */

  const submit = async () => {
    setError(null);

    /* =========================
       VALIDACIONES CLIENTE
    ========================== */

    if (!companyName) {
      setError('El nombre de la empresa es obligatorio');
      return;
    }

    if (!email) {
      setError('El email de la empresa es obligatorio');
      return;
    }

    if (!planId) {
      setError('Debes seleccionar un plan');
      return;
    }

    /* =========================
       VALIDACIONES OWNER
    ========================== */

    if (!ownerEmail) {
      setError('El email del Owner es obligatorio');
      return;
    }

    if (!ownerName) {
      setError('El nombre del Owner es obligatorio');
      return;
    }

    if (!ownerPassword || ownerPassword.length < 8) {
      setError('La contraseña del Owner debe tener al menos 8 caracteres');
      return;
    }

    if (ownerPassword !== ownerPasswordConfirm) {
      setError('Las contraseñas del Owner no coinciden');
      return;
    }

    /* =========================
       VALIDACIONES EXTRA
    ========================== */

    if (addExtraUser) {
      if (!extraEmail || !extraName) {
        setError('Email y nombre del usuario adicional son obligatorios');
        return;
      }

      if (!extraPassword || extraPassword.length < 8) {
        setError('La contraseña del usuario adicional debe tener mínimo 8 caracteres');
        return;
      }

      if (extraPassword !== extraPasswordConfirm) {
        setError('Las contraseñas del usuario adicional no coinciden');
        return;
      }
    }

    setLoading(true);

    try {
      const payload: CreateClientPayload = {
        company_name: companyName,
        email,
        contact_name: contactName || undefined,
        phone: phone || undefined,
        is_active: isActive,
        plan_id: planId,

        owner: {
          email: ownerEmail,
          contact_name: ownerName,
          password: ownerPassword,
          password_confirm: ownerPasswordConfirm,
        },
      };

      if (addExtraUser) {
        payload.extra_users = [
          {
            email: extraEmail,
            contact_name: extraName,
            client_role: extraRole,
            password: extraPassword,
            password_confirm: extraPasswordConfirm,
          },
        ];
      }

      await onCreate(payload);

    } catch (err: any) {
      setError(
        err?.error ||
        err?.message ||
        'Error al crear cliente'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RENDER
  ========================== */

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-xl max-h-[90vh] overflow-y-auto">

        <h2 className="text-lg font-semibold mb-6">
          Crear Cliente
        </h2>

        {error && (
          <p className="text-sm text-red-600 mb-4">
            {error}
          </p>
        )}

        {/* =========================
            CLIENT DATA
        ========================== */}

        <h3 className="font-medium mb-3">
          Datos de la empresa
        </h3>

        <input
          className="w-full px-4 py-2 border rounded-lg mb-3"
          placeholder="Nombre empresa"
          value={companyName}
          onChange={(e) =>
            setCompanyName(e.target.value)
          }
        />

        <input
          className="w-full px-4 py-2 border rounded-lg mb-3"
          placeholder="Email empresa"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <select
          className="w-full px-4 py-2 border rounded-lg mb-3"
          value={planId}
          onChange={(e) =>
            setPlanId(Number(e.target.value))
          }
        >
          {PLANS.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>

        <input
          className="w-full px-4 py-2 border rounded-lg mb-3"
          placeholder="Nombre contacto empresa"
          value={contactName}
          onChange={(e) =>
            setContactName(e.target.value)
          }
        />

        <input
          className="w-full px-4 py-2 border rounded-lg mb-4"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />

        {/* =========================
            OWNER SECTION
        ========================== */}

        <hr className="my-4" />

        <h3 className="font-medium mb-3">
          Usuario Owner (Obligatorio)
        </h3>

        <input
          className="w-full px-4 py-2 border rounded-lg mb-3"
          placeholder="Email Owner"
          value={ownerEmail}
          onChange={(e) =>
            setOwnerEmail(e.target.value)
          }
        />

        <input
          className="w-full px-4 py-2 border rounded-lg mb-3"
          placeholder="Nombre Owner"
          value={ownerName}
          onChange={(e) =>
            setOwnerName(e.target.value)
          }
        />

        <div className="relative mb-3">
          <input
            type={showOwnerPass ? 'text' : 'password'}
            className="w-full px-4 py-2 border rounded-lg pr-10"
            placeholder="Contraseña Owner"
            value={ownerPassword}
            onChange={(e) =>
              setOwnerPassword(e.target.value)
            }
          />
          <button
            type="button"
            onClick={() =>
              setShowOwnerPass(!showOwnerPass)
            }
            className="absolute right-2 top-2"
          >
            {showOwnerPass ? '🙈' : '👁️'}
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type={showOwnerPass2 ? 'text' : 'password'}
            className="w-full px-4 py-2 border rounded-lg pr-10"
            placeholder="Confirmar contraseña Owner"
            value={ownerPasswordConfirm}
            onChange={(e) =>
              setOwnerPasswordConfirm(
                e.target.value
              )
            }
          />
          <button
            type="button"
            onClick={() =>
              setShowOwnerPass2(
                !showOwnerPass2
              )
            }
            className="absolute right-2 top-2"
          >
            {showOwnerPass2 ? '🙈' : '👁️'}
          </button>
        </div>

        {/* =========================
            EXTRA USER
        ========================== */}

        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={addExtraUser}
            onChange={(e) =>
              setAddExtraUser(e.target.checked)
            }
          />
          Agregar usuario adicional
        </label>

        {addExtraUser && (
          <>
            <input
              className="w-full px-4 py-2 border rounded-lg mb-3"
              placeholder="Email usuario adicional"
              value={extraEmail}
              onChange={(e) =>
                setExtraEmail(e.target.value)
              }
            />

            <input
              className="w-full px-4 py-2 border rounded-lg mb-3"
              placeholder="Nombre usuario adicional"
              value={extraName}
              onChange={(e) =>
                setExtraName(e.target.value)
              }
            />

            <select
              className="w-full px-4 py-2 border rounded-lg mb-3"
              value={extraRole}
              onChange={(e) =>
                setExtraRole(
                  e.target.value as any
                )
              }
            >
              <option value="finops_admin">
                FinOps Admin
              </option>
              <option value="viewer">
                Viewer
              </option>
            </select>

            <div className="relative mb-3">
              <input
                type={showExtraPass ? 'text' : 'password'}
                className="w-full px-4 py-2 border rounded-lg pr-10"
                placeholder="Contraseña"
                value={extraPassword}
                onChange={(e) =>
                  setExtraPassword(
                    e.target.value
                  )
                }
              />
              <button
                type="button"
                onClick={() =>
                  setShowExtraPass(
                    !showExtraPass
                  )
                }
                className="absolute right-2 top-2"
              >
                {showExtraPass ? '🙈' : '👁️'}
              </button>
            </div>

            <div className="relative mb-4">
              <input
                type={showExtraPass2 ? 'text' : 'password'}
                className="w-full px-4 py-2 border rounded-lg pr-10"
                placeholder="Confirmar contraseña"
                value={extraPasswordConfirm}
                onChange={(e) =>
                  setExtraPasswordConfirm(
                    e.target.value
                  )
                }
              />
              <button
                type="button"
                onClick={() =>
                  setShowExtraPass2(
                    !showExtraPass2
                  )
                }
                className="absolute right-2 top-2"
              >
                {showExtraPass2 ? '🙈' : '👁️'}
              </button>
            </div>
          </>
        )}

        {/* ACTIONS */}

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:underline"
          >
            Cancelar
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading
              ? 'Creando…'
              : 'Crear cliente'}
          </button>
        </div>

      </div>
    </div>
  );
}
