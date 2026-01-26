'use client';

/* =====================================================
   ADMIN USERS TABLE
   Usuarios de plataforma (NO clientes)
===================================================== */

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { apiFetch } from '@/app/lib/api';

/* ============================
   TYPES
============================ */

interface AdminUser {
  id: number;
  email: string;
  global_role: string | null;
  is_active: boolean | null;
  client: null;
}

/* =====================================================
   COMPONENT
===================================================== */

export default function AdminUsersTable() {
  const { token } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* =====================================================
     FETCH USERS
  ===================================================== */

  useEffect(() => {
    if (!token) return;

    setLoading(true);

    apiFetch<{ users: AdminUser[] }>('/api/admin/users', { token })
      .then((data) => {
        // 👇 solo usuarios de plataforma (sin cliente)
        const platformUsers = data.users.filter(
          (u) => !u.client
        );

        setUsers(platformUsers);
        setError('');
      })
      .catch((err) => {
        console.error('ADMIN USERS ERROR:', err);
        setError('No se pudieron cargar los usuarios de plataforma');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  /* =====================================================
     STATES
  ===================================================== */

  if (loading) {
    return <p className="text-gray-400">Cargando usuarios…</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (users.length === 0) {
    return (
      <p className="text-gray-400">
        No hay usuarios de plataforma
      </p>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-4">Email</th>
            <th className="p-4">Rol global</th>
            <th className="p-4">Estado</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-4 font-medium">
                {user.email}
              </td>

              <td className="p-4">
                {user.global_role || '—'}
              </td>

              <td className="p-4">
                {user.is_active ? (
                  <span className="text-green-600 font-medium">
                    Activo
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">
                    Inactivo
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
