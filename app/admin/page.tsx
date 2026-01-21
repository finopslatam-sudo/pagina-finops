'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import PrivateRoute from '@/app/components/Auth/PrivateRoute';
import { useRouter } from 'next/navigation';

/* =========================
   TYPES
========================= */
interface AdminUser {
  id: number;
  email: string;
  company_name: string;
  role: 'admin' | 'client';
  is_active: boolean;
  is_root?: boolean;
  plan: string | null;
}

/* =========================
   COMPONENT
========================= */
export default function AdminPage() {
  const { user, token, isStaff, isRoot } = useAuth();
  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    'https://api.finopslatam.com';

  /* =========================
     GUARD GLOBAL
  ========================= */
  useEffect(() => {
    if (!user) return;

    // /admin no es entrypoint
    router.replace('/dashboard');
  }, [user, router]);

  if (!user || !isStaff) return null;

  /* =========================
     STATE
  ========================= */
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  /* =========================
     FETCH
  ========================= */
  const fetchUsers = async () => {
    if (!token) return;

    const res = await fetch(`${API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  /* =========================
     ACTIONS
  ========================= */
  const deleteUser = async (id: number) => {
    if (!token) return;
    if (id === user.id) {
      alert('No puedes eliminar tu propio usuario');
      return;
    }

    await fetch(`${API_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    setSuccessMessage('Usuario eliminado correctamente');
    fetchUsers();
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <PrivateRoute>
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">
          Panel de Administración
        </h1>

        {successMessage && (
          <div className="mb-6 rounded-lg border border-green-300 bg-green-50 p-4 text-green-800">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-6">
          {loading ? (
            <p className="text-gray-400">Cargando usuarios…</p>
          ) : (
            <table className="w-full border-collapse">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2">Empresa</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Rol</th>
                  <th className="text-left py-2">Estado</th>
                  <th className="text-right py-2">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => {
                  /* =========================
                     PERMISOS POR FILA
                  ========================= */
                  const canEdit =
                    isRoot ||
                    (u.role === 'client' ||
                      u.id === user.id);

                  const canDelete =
                    isRoot ||
                    (u.role === 'client' &&
                      u.is_active &&
                      u.id !== user.id);

                  return (
                    <tr
                      key={u.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3">
                        {u.company_name}
                      </td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        {u.is_active ? 'Activo' : 'Inactivo'}
                      </td>

                      <td className="text-right space-x-4">
                        {canEdit && (
                          <button className="text-blue-600 font-medium">
                            Editar
                          </button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="text-red-600 font-medium"
                          >
                            Eliminar
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </PrivateRoute>
  );
}
