'use client';

/* =====================================================
   IMPORTS
===================================================== */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

/* =====================================================
   TYPES
===================================================== */

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* =====================================================
   CONFIG
===================================================== */

/**
 * Backend API base
 * Centralizado y alineado con producción
 */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://api.finopslatam.com';

/* =====================================================
   COMPONENT
===================================================== */

/**
 * LoginModal
 *
 * - Punto único de entrada al sistema
 * - Maneja login + recuperación de contraseña
 * - No guarda estado de sesión
 * - Delega TODO a AuthContext
 */
export default function LoginModal({
  isOpen,
  onClose,
}: LoginModalProps) {
  const { login } = useAuth();
  const router = useRouter();

  /* =========================
     LOGIN STATE
  ========================== */

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* =========================
     FORGOT PASSWORD STATE
  ========================== */

  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  /* =========================
     GUARD
  ========================== */

  if (!isOpen) return null;

  /* =====================================================
     LOGIN SUBMIT
  ===================================================== */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      /**
       * Login delega a AuthContext:
       * - guarda token
       * - guarda user
       * - maneja force_password_change
       */
      await login(email, password);

      onClose();

      /**
       * Redirección ÚNICA
       * El dashboard decide qué renderizar
       */
      router.replace('/dashboard');
    } catch {
      /**
       * ⚠️ Mensaje genérico por seguridad
       */
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FORGOT PASSWORD
  ===================================================== */

  const handleForgotPassword = async () => {
    setForgotLoading(true);
    setForgotMessage('');

    try {
      const response = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: forgotEmail,
          }),
        }
      );

      /**
       * 🔐 Importante:
       * - No revelar si el email existe
       * - Mensaje neutro SIEMPRE
       */
      if (!response.ok) {
        console.warn(
          'Forgot password request failed:',
          response.status
        );
      }

      setForgotMessage(
        'Si el correo existe, recibirás instrucciones en tu email.'
      );
    } catch (err) {
      console.error(
        'Forgot password error:',
        err
      );

      /**
       * Mismo mensaje por seguridad
       */
      setForgotMessage(
        'Si el correo existe, recibirás instrucciones en tu email.'
      );
    } finally {
      setForgotLoading(false);
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* HEADER */}
        <h2 className="text-xl font-semibold mb-2">
          Partner Portal
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Acceso exclusivo para socios de FinOpsLatam
        </p>

        {/* ERROR */}
        {error && !showForgot && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* =========================
           LOGIN VIEW
        ========================== */}
        {!showForgot ? (
          <>
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full px-4 py-2 border rounded-lg"
                autoComplete="email"
                required
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full px-4 py-2 border rounded-lg"
                autoComplete="current-password"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {loading
                  ? 'Ingresando...'
                  : 'Acceder al Portal'}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setShowForgot(true);
                setError('');
              }}
              className="w-full text-sm text-blue-600 hover:underline mt-3"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </>
        ) : (
          /* =========================
             FORGOT PASSWORD VIEW
          ========================== */
          <>
            <h3 className="text-lg font-semibold mb-4">
              Recuperar contraseña
            </h3>

            {forgotMessage ? (
              <p className="text-sm text-green-600 mb-4">
                {forgotMessage}
              </p>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Correo registrado"
                  value={forgotEmail}
                  onChange={(e) =>
                    setForgotEmail(e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                  autoComplete="email"
                  required
                />

                <button
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  {forgotLoading
                    ? 'Enviando...'
                    : 'Enviar instrucciones'}
                </button>
              </>
            )}

            <button
              onClick={() => {
                setShowForgot(false);
                setForgotEmail('');
                setForgotMessage('');
              }}
              className="mt-4 text-sm text-gray-500 hover:underline"
            >
              Volver al login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
