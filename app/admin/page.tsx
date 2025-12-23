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
}

export default function AdminPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [mode, setMode] = useState<'edit' | 'create'>('edit');
  const [saving, setSaving] = useState(false);

  const [newUser, setNewUser] = useState({
    company_name: '',
    email: '',
    password: '',
    contact_name: '',
    phone: '',
    role: 'client',
  });

  // 🔒 Solo admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [user, router]);

  // 📡 Cargar usuarios
  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data.users || []);
      setError('');
    } catch {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  // 💾 Guardar edición
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

      if (!res.ok) throw new Error();
      setEditingUser(null);
      fetchUsers();
    } finally {
      setSaving(false);
    }
  };

  // ➕ Crear usuario
  const createUser = async () => {
    if (
      !newUser.company_name ||
      !newUser.email ||
      !newUser.password ||
      !newUser.contact_name ||
      !newUser.phone
    ) {
      alert('Completa todos los campos obligatorios');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) throw new Error();
      setMode('edit');
      setNewUser({
        company_name: '',
        email: '',
        password: '',
        contact_name: '',
        phone: '',
        role: 'client',
      });
      fetchUsers();
    } catch {
      alert('Error al crear usuario');
    }
  };

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-semibold">Usuarios</h2>
            <button
              onClick={() => setMode('create')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              + Crear nuevo usuario
            </button>
          </div>

          {!loading && (
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">Empresa</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Rol</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{u.company_name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          u.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {u.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setMode('edit');
                        }}
                        className="text-blue-600 font-medium"
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

        {/* 🧩 MODAL EDITAR */}
        {editingUser && mode === 'edit' && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
              <h2 className="text-xl font-semibold">Editar usuario</h2>

              <input
                className="border p-2 w-full"
                value={editingUser.company_name}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, company_name: e.target.value })
                }
              />

              <input
                className="border p-2 w-full"
                value={editingUser.contact_name || ''}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, contact_name: e.target.value })
                }
              />

              <input
                className="border p-2 w-full"
                value={editingUser.phone || ''}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, phone: e.target.value })
                }
              />

              <select
                className="border p-2 w-full"
                value={editingUser.role}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    role: e.target.value as 'admin' | 'client',
                  })
                }
              >
                <option value="client">Cliente</option>
                <option value="admin">Admin</option>
              </select>

              <div className="flex justify-end gap-3">
                <button onClick={() => setEditingUser(null)}>Cancelar</button>
                <button
                  onClick={saveUser}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🧩 MODAL CREAR */}
        {mode === 'create' && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
              <h2 className="text-xl font-semibold">Crear usuario</h2>

              <input
                className="border p-2 w-full"
                placeholder="Empresa"
                value={newUser.company_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, company_name: e.target.value })
                }
              />
              <input
                className="border p-2 w-full"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <input
                className="border p-2 w-full"
                placeholder="Password"
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
              />
              <input
                className="border p-2 w-full"
                placeholder="Contacto"
                value={newUser.contact_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, contact_name: e.target.value })
                }
              />
              <input
                className="border p-2 w-full"
                placeholder="Teléfono"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
              />

              <div className="flex justify-end gap-3">
                <button onClick={() => setMode('edit')}>Cancelar</button>
                <button
                  onClick={createUser}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </PrivateRoute>
  );
}
