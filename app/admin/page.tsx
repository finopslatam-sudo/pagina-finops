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
    id: number;
    code: string;
    name: string;
  } | null;
}

interface Plan {
  id: number;
  code: string;
  name: string;
}
interface NewUser {
  company_name: string;
  email: string;
  password: string;
  contact_name: string;
  phone: string;
  role: 'admin' | 'client';
  is_active: boolean;
  plan_id: number | null;
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
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const [saving, setSaving] = useState(false);

  const [newUser, setNewUser] = useState<NewUser>({
    company_name: '',
    email: '',
    password: '',
    contact_name: '',
    phone: '',
    role: 'client',
    is_active: true,
    plan_id: null,
  });
  
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);



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
  const fetchPlans = async () => {
    if (!token) return;
  
    try {
      const res = await fetch(`${API_URL}/api/admin/plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        throw new Error('Error al cargar planes');
      }
  
      const data = await res.json();
      setPlans(data.plans || []);
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchUsers();
    fetchPlans();
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
              is_active: editingUser.is_active,
              email: editingUser.email,
            }),
          }
        );
    
        if (!res.ok) {
          throw new Error('Error al guardar usuario');
        }
    
        // 🟢 PASO 2.5 — guardar plan
        if (selectedPlanId) {
          await fetch(
            `${API_URL}/api/admin/users/${editingUser.id}/plan`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ plan_id: selectedPlanId }),
            }
          );
        }
    
        setEditingUser(null);
        setSelectedPlanId(null);
        fetchUsers();
      } catch (err) {
        alert('Error al guardar usuario');
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
    if (newUser.password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden');
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
        is_active: true,
        plan_id: null,
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
                          setSelectedPlanId(u.plan?.id || null);
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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

              {/* HEADER */}
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Editar usuario
                </h2>
                <p className="text-sm text-gray-500">
                  Modifica la información del usuario
                </p>
              </div>

              {/* BODY (SCROLL) */}
              <div className="p-6 space-y-4 overflow-y-auto">

                {/* Plan */}
                <div>
                  <label className="text-sm text-gray-600">
                    Plan de suscripción
                  </label>
                  <select
                    className="mt-1 border rounded-lg p-2 w-full"
                    value={selectedPlanId || ''}
                    onChange={(e) =>
                      setSelectedPlanId(Number(e.target.value))
                    }
                  >
                    <option value="">Sin plan</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Empresa */}
                <div>
                  <label className="text-sm text-gray-600">Empresa</label>
                  <input
                    className="mt-1 border rounded-lg p-2 w-full"
                    value={editingUser.company_name}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        company_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    className="mt-1 border rounded-lg p-2 w-full"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Contacto */}
                <div>
                  <label className="text-sm text-gray-600">Contacto</label>
                  <input
                    className="mt-1 border rounded-lg p-2 w-full"
                    value={editingUser.contact_name || ''}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        contact_name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="text-sm text-gray-600">Teléfono</label>
                  <input
                    className="mt-1 border rounded-lg p-2 w-full"
                    value={editingUser.phone || ''}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Rol */}
                <div>
                  <label className="text-sm text-gray-600">Rol</label>
                  <select
                    className="mt-1 border rounded-lg p-2 w-full"
                    value={editingUser.role}
                    disabled={editingUser.id === user?.id}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value as 'admin' | 'client',
                      })
                    }
                  >
                    <option value="client">Cliente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                {/* Estado */}
                <div>
                  <label className="text-sm text-gray-600">Estado</label>
                  <select
                    className="mt-1 border rounded-lg p-2 w-full"
                    value={editingUser.is_active ? 'active' : 'inactive'}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        is_active: e.target.value === 'active',
                      })
                    }
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>

              </div>

              {/* FOOTER (STICKY) */}
              <div className="p-6 border-t bg-white flex justify-end gap-3 sticky bottom-0">
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setSelectedPlanId(null);
                  }}
                  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>

                <button
                  onClick={saveUser}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Guardar cambios
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 🧩 MODAL CREAR */}
        {mode === 'create' && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">

              {/* HEADER */}
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Crear nuevo usuario
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Todos los campos son obligatorios
                </p>
              </div>

              {/* BODY (SCROLL) */}
              <div className="p-6 space-y-4 overflow-y-auto">

                {formError && (
                  <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                    {formError}
                  </div>
                )}

                {/* PLAN */}
                <div>
                  <label className="text-sm text-gray-600">
                    Plan de suscripción
                  </label>
                  <select
                    className="mt-1 border rounded-lg p-2 w-full"
                    value={newUser.plan_id || ''}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        plan_id: Number(e.target.value),
                      })
                    }
                    required
                  >
                    <option value="">Selecciona un plan</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* EMPRESA */}
                <div>
                  <label className="text-sm text-gray-600">Empresa</label>
                  <input
                    className="mt-1 border rounded-lg p-2 w-full"
                    value={newUser.company_name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, company_name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    className="mt-1 border rounded-lg p-2 w-full"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-sm text-gray-600">Password</label>
                  <input
                    type="password"
                    className="mt-1 border rounded-lg p-2 w-full"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    required
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="text-sm text-gray-600">
                    Confirmar password
                  </label>
                  <input
                    type="password"
                    className="mt-1 border rounded-lg p-2 w-full"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {/* CONTACTO */}
                <div>
                  <label className="text-sm text-gray-600">Contacto</label>
                  <input
                    className="mt-1 border rounded-lg p-2 w-full"
                    value={newUser.contact_name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, contact_name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* TELÉFONO */}
                <div>
                  <label className="text-sm text-gray-600">Teléfono</label>
                  <input
                    className="mt-1 border rounded-lg p-2 w-full"
                    value={newUser.phone}
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                    required
                  />
                </div>

                {/* ROL */}
                <div>
                  <label className="text-sm text-gray-600">Rol</label>
                  <select
                    className="mt-1 border rounded-lg p-2 w-full"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value as 'admin' | 'client'})
                    }
                  >
                    <option value="client">Cliente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>

                {/* ESTADO */}
                <div>
                  <label className="text-sm text-gray-600">Estado</label>
                  <select
                    className="mt-1 border rounded-lg p-2 w-full"
                    value={newUser.is_active ? 'active' : 'inactive'}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        is_active: e.target.value === 'active',
                      })
                    }
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>

              {/* FOOTER (STICKY) */}
              <div className="p-6 border-t bg-white flex justify-end gap-3 sticky bottom-0">
                <button
                  onClick={() => {
                    setMode('edit');
                    setFormError('');
                    setConfirmPassword('');
                  }}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Cancelar
                </button>

                <button
                  onClick={createUser}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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
