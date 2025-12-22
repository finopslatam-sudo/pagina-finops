'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import PrivateRoute from '@/app/components/Auth/PrivateRoute';
import { useRouter } from 'next/navigation';

interface AdminUser {
  id: number;
  email: string;
  company_name: string;
  role: string;
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

  // 🔒 Protección por rol
  useEffect(() => {
    if (user && user.role && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // 📡 Cargar usuarios
  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
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
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

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
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      {u.company_name}
                    </td>

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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </PrivateRoute>
  );
}
