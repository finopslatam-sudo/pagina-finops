'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect, useMemo, useState } from 'react';

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

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({
      contact_name: user.contact_name || '',
      email: user.email,
      phone: '',
      password: '',
      confirmPassword: '',
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* 🔐 REGLAS PASSWORD */
  const rules = useMemo(() => {
    const p = form.password;
    return {
      length: p.length >= 8 && p.length <= 12,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      number: /[0-9]/.test(p),
      special: /[^A-Za-z0-9]/.test(p),
      notSame: p.length > 0, // backend ya evita reutilizar hash
    };
  }, [form.password]);

  const passwordUsed = form.password.length > 0;
  const allValid =
    !passwordUsed ||
    (Object.values(rules).every(Boolean) &&
      form.password === form.confirmPassword);

  const Rule = ({ ok, text }: { ok: boolean; text: string }) => (
    <li className="flex items-center gap-2 text-sm">
      <span className={ok ? 'text-green-600' : 'text-gray-400'}>
        {ok ? '✔️' : '○'}
      </span>
      <span className={ok ? 'text-green-700' : 'text-gray-600'}>
        {text}
      </span>
    </li>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!allValid) {
      setError('La contraseña no cumple los requisitos');
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
      if (!res.ok) throw new Error(data.error || 'Error al guardar cambios');

      updateUser(data.user);
      setSuccess('Perfil actualizado correctamente');
      setForm((p) => ({ ...p, password: '', confirmPassword: '' }));

    } catch (err: any) {
      setError(err.message || 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center py-12 px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6">

        <h2 className="text-2xl font-semibold mb-6">
          Editar mis datos
        </h2>

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
            value={form.contact_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Nombre de contacto"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            value={user.company_name}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Teléfono"
            className="w-full px-4 py-2 border rounded-lg"
          />

          <hr />

          {/* PASSWORD */}
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="Nueva contraseña (opcional)"
              className="w-full px-4 py-2 border rounded-lg pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              👁
            </button>
          </div>

          <input
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmar contraseña"
            className="w-full px-4 py-2 border rounded-lg"
          />

          {passwordUsed && (
            <ul className="mt-2 space-y-1">
              <Rule ok={rules.length} text="Entre 8 y 12 caracteres" />
              <Rule ok={rules.upper} text="Al menos una letra mayúscula" />
              <Rule ok={rules.lower} text="Al menos una letra minúscula" />
              <Rule ok={rules.number} text="Al menos un número" />
              <Rule ok={rules.special} text="Al menos un carácter especial" />
            </ul>
          )}

          <button
            type="submit"
            disabled={loading || !allValid}
            className={`w-full py-2 rounded-lg text-white font-medium
              ${allValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
            `}
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>

        </form>
      </div>
    </main>
  );
}
