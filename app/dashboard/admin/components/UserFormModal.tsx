'use client';

import { useState } from 'react';

export default function UserFormModal({
  user,
  onClose,
}: {
  user: any | null;
  onClose: () => void;
}) {
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.global_role || 'support');

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {user ? 'Editar usuario' : 'Nuevo usuario'}
        </h2>

        <div className="space-y-4">
          <input
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            className="w-full border px-3 py-2 rounded-lg"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="support">Support</option>
            <option value="root">Root</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose}>Cancelar</button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
