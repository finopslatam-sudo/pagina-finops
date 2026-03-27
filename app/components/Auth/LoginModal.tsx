'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.finopslatam.com';

interface Props { isOpen: boolean; onClose: () => void }

function LoginForm({ onLogin, error, onForgot }: {
  onLogin: (email: string, password: string) => Promise<void>;
  error: string;
  onForgot: () => void;
}) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await onLogin(email, password); }
    finally { setLoading(false); }
  };

  return (
    <>
      {error && <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg" autoComplete="email" required />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg" autoComplete="current-password" required />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium disabled:opacity-50">
          {loading ? 'Ingresando...' : 'Acceder al Portal'}
        </button>
      </form>
      <button type="button" onClick={onForgot} className="w-full text-sm text-blue-600 hover:underline mt-3">¿Olvidaste tu contraseña?</button>
    </>
  );
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [forgotEmail, setForgotEmail]     = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [loading, setLoading]             = useState(false);

  const handleForgot = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
    } catch (err) { console.error('Forgot password error:', err); }
    finally {
      setForgotMessage('Si el correo existe, recibirás instrucciones en tu email.');
      setLoading(false);
    }
  };

  return (
    <>
      <h3 className="text-lg font-semibold mb-4">Recuperar contraseña</h3>
      {forgotMessage ? (
        <p className="text-sm text-green-600 mb-4">{forgotMessage}</p>
      ) : (
        <>
          <input type="email" placeholder="Correo registrado" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg mb-4" autoComplete="email" required />
          <button onClick={handleForgot} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
            {loading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </>
      )}
      <button onClick={onBack} className="mt-4 text-sm text-gray-500 hover:underline">Volver al login</button>
    </>
  );
}

export default function LoginModal({ isOpen, onClose }: Props) {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError]         = useState('');
  const [showForgot, setShowForgot] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (email: string, password: string) => {
    setError('');
    try { await login(email, password); onClose(); router.replace('/dashboard'); }
    catch { setError('Credenciales inválidas'); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Cerrar">✕</button>
        <h2 className="text-xl font-semibold mb-2">Partner Portal</h2>
        <p className="text-sm text-gray-600 mb-4">Acceso exclusivo para socios de FinOpsLatam</p>

        {!showForgot
          ? <LoginForm onLogin={handleLogin} error={error} onForgot={() => { setShowForgot(true); setError(''); }} />
          : <ForgotPasswordForm onBack={() => setShowForgot(false)} />
        }
      </div>
    </div>
  );
}
