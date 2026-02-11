'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateUserModal({
  onClose,
  onCreated,
}: Props) {
  const { token } = useAuth();

  const [type, setType] = useState<'global' | 'client'>('client');

  const [clients, setClients] = useState<any[]>([]);

  const [clientId, setClientId] = useState<number | null>(null);
  const [clientRole, setClientRole] =
    useState<'owner' | 'finops_admin' | 'viewer'>('owner');

  const [globalRole, setGlobalRole] =
    useState<'admin' | 'support'>('admin');

  const [email, setEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] =
    useState('');

  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    null
  );
  const [success, setSuccess] =
    useState<string | null>(null);

  // ===============================
  // Cargar clientes
  // ===============================
  useEffect(() => {
    if (!token) return;

    const loadClients = async () => {
      try {
        const res = await apiFetch<{
          data: any[];
        }>('/api/admin/clients', { token });

        setClients(res.data);
      } catch {
        setClients([]);
      }
    };

    loadClients();
  }, [token]);

  // ===============================
  // SUBMIT
  // ===============================
  const submit = async () => {
    if (!token) return;

    setError(null);
    setLoading(true);

    try {
      if (!email || !contactName) {
        throw new Error(
          'Email y nombre son obligatorios'
        );
      }

      if (!password || password.length < 8) {
        throw new Error(
          'Password mínimo 8 caracteres'
        );
      }

      if (password !== passwordConfirm) {
        throw new Error(
          'Las contraseñas no coinciden'
        );
      }

      const payload: any = {
        type,
        email,
        contact_name: contactName,
        password,
        password_confirm: passwordConfirm,
        force_password_change: true,
      };

      if (type === 'global') {
        payload.global_role = globalRole;
      } else {
        if (!clientId) {
          throw new Error(
            'Debe seleccionar un cliente'
          );
        }
        payload.client_id = clientId;
        payload.client_role = clientRole;
      }

      await apiFetch(
        '/api/admin/users/with-password',
        {
          method: 'POST',
          token,
          body: payload,
        }
      );

      setSuccess('Usuario creado correctamente');

      await onCreated();

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(
        err?.message || 'Error al crear usuario'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg space-y-4 max-h-[85vh] overflow-y-auto">

        <h2 className="text-lg font-semibold">
          Crear Usuario
        </h2>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-600 text-sm">
            {success}
          </div>
        )}

        {/* TYPE */}
        <select
          className="w-full border rounded px-3 py-2"
          value={type}
          onChange={(e) =>
            setType(e.target.value as any)
          }
        >
          <option value="client">
            Comercial
          </option>
          <option value="global">
            Sistema
          </option>
        </select>

        {/* GLOBAL */}
        {type === 'global' && (
          <select
            className="w-full border rounded px-3 py-2"
            value={globalRole}
            onChange={(e) =>
              setGlobalRole(e.target.value as any)
            }
          >
            <option value="admin">
              Admin
            </option>
            <option value="support">
              Support
            </option>
          </select>
        )}

        {/* CLIENT */}
        {type === 'client' && (
          <>
            <select
              className="w-full border rounded px-3 py-2"
              value={clientId ?? ''}
              onChange={(e) =>
                setClientId(
                  Number(e.target.value)
                )
              }
            >
              <option value="">
                Seleccionar cliente
              </option>
              {clients.map((c) => (
                <option
                  key={c.id}
                  value={c.id}
                >
                  {c.company_name}
                </option>
              ))}
            </select>

            <select
              className="w-full border rounded px-3 py-2"
              value={clientRole}
              onChange={(e) =>
                setClientRole(
                  e.target.value as any
                )
              }
            >
              <option value="owner">
                Owner
              </option>
              <option value="finops_admin">
                FinOps Admin
              </option>
              <option value="viewer">
                Viewer
              </option>
            </select>
          </>
        )}

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Nombre contacto"
          value={contactName}
          onChange={(e) =>
            setContactName(e.target.value)
          }
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            className="w-full border rounded px-3 py-2 pr-10"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
          <button
            type="button"
            onClick={() =>
              setShowPass(!showPass)
            }
            className="absolute right-2 top-2"
          >
            👁️
          </button>
        </div>

        <div className="relative">
          <input
            type={showPass2 ? 'text' : 'password'}
            className="w-full border rounded px-3 py-2 pr-10"
            placeholder="Confirmar contraseña"
            value={passwordConfirm}
            onChange={(e) =>
              setPasswordConfirm(
                e.target.value
              )
            }
          />
          <button
            type="button"
            onClick={() =>
              setShowPass2(!showPass2)
            }
            className="absolute right-2 top-2"
          >
            👁️
          </button>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="text-gray-600"
          >
            Cancelar
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading
              ? 'Creando…'
              : 'Guardar'}
          </button>
        </div>

      </div>
    </div>
  );
}
