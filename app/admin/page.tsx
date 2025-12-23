'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import PrivateRoute from '@/app/components/Auth/PrivateRoute';
import { useRouter } from 'next/navigation';

interface AdminUser {
  id: number;
  email: string;
  company_name: string;
  contact_name?: string;
  phone?: string;
  role: 'admin' | 'client';
  is_active: boolean;
  plan: {
    code: string;
    name: string;
  } | null;
}

export default function AdminPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🧩 edición
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🔒 Protección por rol
  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  // 📡 Cargar usuarios
  const fetchUsers = () => {
    if (!token) return;

    setLoading(true);
    fetch(`${API_URL}/api/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Error al cargar usuarios');
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data.users || []);
        setError('');
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  // 💾 Guardar usuario editado
  const saveUser = async () => {
    if (!editingUser || !token) return;

    setSaving(true);

    try {
      const res = await fetch(
        `${API_URL}/api/admin/users/${editingUser.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            company_name: editingUser.company_name,
            contact_name: editingUser.contact_name,
            phone: editingUser.phone,
            role: editingUser.role,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al guardar usuario');
      }

      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        {/* HEADER */}
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Administración
          </h1>
          <p className="text-gray-600 mt-1">
            Gestión de usuarios y suscripciones
          </p>
        </div>

        {/* CONTENIDO */}
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow border">
          {loading && (
            <div className="p-6 text-gray-500">
              Cargando usuarios…
            </div>
          )}

          {error && (
            <div className="p-6 text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                    Empresa
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                    Rol
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                    Plan
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{u.company_name}</td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      {u.email}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {u.plan ? (
                        <span className="font-medium text-gray-800">
                          {u.plan.name}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">
                          Sin plan
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {u.is_active ? (
                        <span className="text-green-600 font-medium">
                          Activo
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          Inactivo
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => setEditingUser(u)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 🧩 MODAL EDITAR USUARIO */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-3">
              <h2 className="text-lg font-semibold">
                Editar usuario
              </h2>

              <input
                className="border p-2 w-full"
                placeholder="Empresa"
                value={editingUser.company_name}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    company_name: e.target.value,
                  })
                }
              />

              <input
                className="border p-2 w-full"
                placeholder="Contacto"
                value={editingUser.contact_name || ''}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    contact_name: e.target.value,
                  })
                }
              />

              <input
                className="border p-2 w-full"
                placeholder="Teléfono"
                value={editingUser.phone || ''}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    phone: e.target.value,
                  })
                }
              />

              <select
                className="border p-2 w-full"
                value={editingUser.role}
                disabled={editingUser.id === user?.id}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    role: e.target.value as 'admin' | 'client',
                  })
                }
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveUser}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {saving ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </PrivateRoute>
  );
}
