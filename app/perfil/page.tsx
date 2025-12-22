'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useState } from 'react';

export default function PerfilPage() {
  const { user, token, updateUser } = useAuth();

  if (!user || !token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
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
      phone: '', // 👈 limpio por diseño
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
            phone: form.phone || undefined,
            password: form.password || undefined,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar cambios');
      }

      updateUser(data.user);
      setSuccess('Perfil actualizado correctamente');
    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">

      {/* HERO AZUL */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 mb-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3">
            Mi Perfil
          </h1>
          <p className="text-blue-100 text-lg">
            Gestiona tu información personal y credenciales
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="max-w-2xl mx-auto px-4 pb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Editar información
          </h2>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <input
              name="contact_name"
              placeholder="Nombre de contacto"
              value={form.contact_name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              value={user.company_name}
              disabled
              className="w-full px-4 py-2.5 border rounded-lg bg-gray-100 text-gray-500"
            />

            <input
              name="phone"
              placeholder="+56"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <hr className="my-6" />

            <input
              name="password"
              type="password"
              placeholder="Nueva contraseña (opcional)"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {loading ? 'Guardando cambios…' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
