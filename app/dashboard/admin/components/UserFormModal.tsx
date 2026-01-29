'use client';

import { useState } from 'react';
import { AdminUser } from '../hooks/useAdminUsers';
import Modal from '@/app/components/UI/Modal';

interface Props {
  user: AdminUser;
  onClose: () => void;
  onSaved: () => void;
}

export default function UserFormModal({
  user,
  onClose,
  onSaved,
}: Props) {
  const [email, setEmail] = useState(user.email);
  const [globalRole, setGlobalRole] = useState(
    user.global_role ?? ''
  );
  const [clientRole, setClientRole] = useState(
    user.client_role ?? ''
  );
  const [isActive, setIsActive] = useState(
    user.is_active
  );

  const handleSave = async () => {
    // Se conecta en FASE 2
    onSaved();
  };

  return (
    <Modal isOpen onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">
        Editar usuario de sistema
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">
            Email
          </label>
          <input
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {user.global_role !== null && (
          <div>
            <label className="block text-sm font-medium">
              Rol del sistema
            </label>
            <input
              value={globalRole}
              onChange={(e) =>
                setGlobalRole(e.target.value)
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        )}

        {user.client_id && (
          <div>
            <label className="block text-sm font-medium">
              Rol del cliente
            </label>
            <input
              value={clientRole}
              onChange={(e) =>
                setClientRole(e.target.value)
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) =>
              setIsActive(e.target.checked)
            }
          />
          <span>Usuario activo</span>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  );
}
