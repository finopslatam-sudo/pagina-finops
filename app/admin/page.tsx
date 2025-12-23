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

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);

  const [mode, setMode] = useState<'edit' | 'create'>('edit');

  const [newUser, setNewUser] = useState({
    company_name: '',
    email: '',
    password: '',
    contact_name: '',
    phone: '',
    role: 'client',
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🔒 Protección por rol
  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') router.replace('/dashboard');
  }, [user, router]);

  // 📡 Cargar usuarios
  const fetchUsers = () => {
    if (!token) return;

    setLoading(true);
    fetch(`${API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
        setError('');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  // ✏️ Guardar usuario editado
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

      if (!res.ok) throw new Error('Error al guardar usuario');

      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ➕ Crear usuario (CON VALIDACIÓN)
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

      if (!res.ok) throw new Error('Error al crear usuario');

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
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <PrivateRoute>
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
        </div>

        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow border p-4">
          {!loading && !error && (
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Usuarios</h2>
              <button
                onClick={() => setMode('create')}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                ➕ Crear nuevo usuario
              </button>
            </div>
          )}

          {/* TABLA */}
          {!loading && !error && (
            <table className="w-full">
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.company_name}</td>
                    <td>{u.email}</td>
                    <td>
                      <button onClick={() => setEditingUser(u)}>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* MODAL CREAR */}
        {mode === 'create' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-5">
              
              {/* HEADER */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Crear nuevo usuario
                </h2>
                <p className="text-sm text-gray-500">
                  Completa la información para registrar una nueva cuenta
                </p>
              </div>

              {/* FORM */}
              <div className="space-y-3">
                <input
                  className="border rounded-lg p-2 w-full"
                  placeholder="Empresa *"
                  value={newUser.company_name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, company_name: e.target.value })
                  }
                />

                <input
                  className="border rounded-lg p-2 w-full"
                  placeholder="Email *"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />

                <input
                  className="border rounded-lg p-2 w-full"
                  placeholder="Password *"
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />

                <input
                  className="border rounded-lg p-2 w-full"
                  placeholder="Nombre de contacto *"
                  value={newUser.contact_name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, contact_name: e.target.value })
                  }
                />

                <input
                  className="border rounded-lg p-2 w-full"
                  placeholder="Teléfono *"
                  value={newUser.phone}
                  onChange={(e) =>
                    setNewUser({ ...newUser, phone: e.target.value })
                  }
                />

                <select
                  className="border rounded-lg p-2 w-full"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                >
                  <option value="client">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setMode('edit')}
                  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>

                <button
                  onClick={createUser}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                >
                  Crear usuario
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </PrivateRoute>
  );
}
