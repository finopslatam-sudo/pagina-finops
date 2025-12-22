'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';


export default function PerfilPage() {
  const { user, token, updateUser } = useAuth();

  if (!user || !token) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Debes iniciar sesión</p>
      </main>
    );
  }

  const [form, setForm] = useState({
    contact_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setForm({
      contact_name: user.contact_name || '',
      email: user.email,
      phone: user.phone || '',
      password: '',
      confirmPassword: '',
    });
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password && form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            contact_name: form.contact_name,
            email: form.email,
            phone: form.phone,
            password: form.password || undefined,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar cambios');
      }

      // 🔥 sincroniza sesión (PASO 2)
      updateUser(data.user);

      setSuccess('Perfil actualizado correctamente');
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center py-12 px-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Editar mi perfil
        </h1>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="contact_name"
            placeholder="Nombre de contacto"
            value={form.contact_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />

          <input
            value={user.company_name}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
          />

          <input
            name="phone"
            placeholder="Teléfono"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <hr />

          <input
            name="password"
            type="password"
            placeholder="Nueva contraseña (opcional)"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirmar contraseña"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </main>
  );
}