'use client';

import { useState } from 'react';
import { API_URL } from '@/app/lib/api';

export default function ContractModal({ plan, onClose }: { plan: string; onClose: () => void }) {
  const [form, setForm] = useState({ nombre: '', empresa: '', email: '', telefono: '', mensaje: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, servicio: plan }),
    });
    setLoading(false);
    if (!res.ok) { alert('Error al enviar solicitud'); return; }
    setSuccess(true);
    setForm({ nombre: '', empresa: '', email: '', telefono: '', mensaje: '' });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">✕</button>
        <h3 className="text-2xl font-bold mb-2">Contratar {plan}</h3>

        {success ? (
          <div className="bg-green-50 border border-green-300 text-green-700 p-4 rounded-lg">
            ✅ Solicitud enviada correctamente. Alguien de nuestro equipo se contactará a la brevedad.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input required placeholder="Nombre" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full border rounded-lg px-4 py-2" />
            <input required placeholder="Empresa" value={form.empresa}
              onChange={(e) => setForm({ ...form, empresa: e.target.value })}
              className="w-full border rounded-lg px-4 py-2" />
            <input required type="email" placeholder="Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg px-4 py-2" />
            <input placeholder="Teléfono" value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              className="w-full border rounded-lg px-4 py-2" />
            <textarea required rows={4} placeholder="Mensaje" value={form.mensaje}
              onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
              className="w-full border rounded-lg px-4 py-2" />
            <button disabled={loading} type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg">
              {loading ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
