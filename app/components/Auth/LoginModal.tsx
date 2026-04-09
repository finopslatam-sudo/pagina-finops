'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AuthChallengeResponse,
  AuthSuccessResponse,
  useAuth,
} from '@/app/context/AuthContext';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://api.finopslatam.com';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

interface LoginFormProps {
  error: string;
  loading: boolean;
  onForgot: () => void;
  onSubmit: (email: string, password: string) => Promise<void>;
}

function LoginForm({
  error,
  loading,
  onForgot,
  onSubmit,
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <>
      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          autoComplete="current-password"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? 'Ingresando...' : 'Acceder al Portal'}
        </button>
      </form>
      <button
        type="button"
        onClick={onForgot}
        className="w-full text-sm text-blue-600 hover:underline mt-3"
      >
        ¿Olvidaste tu contraseña?
      </button>
    </>
  );
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgot = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
    } catch (err) {
      console.error('Forgot password error:', err);
    } finally {
      setForgotMessage(
        'Si el correo existe, recibirás instrucciones en tu email.'
      );
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
          <input
            type="email"
            placeholder="Correo registrado"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg mb-4"
            autoComplete="email"
            required
          />
          <button
            onClick={handleForgot}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            {loading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </>
      )}
      <button
        onClick={onBack}
        className="mt-4 text-sm text-gray-500 hover:underline"
      >
        Volver al login
      </button>
    </>
  );
}

function MfaForm({
  challenge,
  error,
  info,
  loading,
  onBack,
  onSubmit,
}: {
  challenge: AuthChallengeResponse;
  error: string;
  info: string;
  loading: boolean;
  onBack: () => void;
  onSubmit: (code: string, useRecoveryCode: boolean) => Promise<void>;
}) {
  const [code, setCode] = useState('');
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);

  const title = challenge.mfa_enrollment_required
    ? 'Activa tu multifactor'
    : 'Verificación multifactor';

  const helper = challenge.message ||
    (challenge.mfa_enrollment_required
      ? 'Tu organización exige MFA antes de ingresar.'
      : 'Ingresa el código de tu app autenticadora para continuar.');

  const setupLink = useMemo(() => {
    if (!info.startsWith('otpauth://')) return null;
    return info;
  }, [info]);

  const secret = useMemo(() => {
    const parts = info.split('secret=');
    if (parts.length < 2) return null;
    return parts[1].split('&')[0] || null;
  }, [info]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(code, useRecoveryCode);
  };

  return (
    <>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{helper}</p>

      {challenge.mfa_enrollment_required && info && (
        <div className="mb-4 p-4 rounded-lg border bg-blue-50 text-sm text-blue-900 space-y-2">
          <p className="font-medium">Configura tu app autenticadora con este secreto:</p>
          {secret && (
            <div className="font-mono text-base break-all">{secret}</div>
          )}
          {setupLink && (
            <a
              href={setupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline"
            >
              Abrir configuración en la app autenticadora
            </a>
          )}
        </div>
      )}

      {info && !challenge.mfa_enrollment_required && (
        <div className="mb-4 p-3 rounded-lg border bg-amber-50 text-sm text-amber-900">
          {info}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder={useRecoveryCode ? 'Recovery code' : 'Código de 6 dígitos'}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          autoComplete="one-time-code"
          required
        />

        {!challenge.mfa_enrollment_required && (
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={useRecoveryCode}
              onChange={(e) => setUseRecoveryCode(e.target.checked)}
            />
            Usar recovery code
          </label>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg"
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {loading
              ? 'Validando...'
              : challenge.mfa_enrollment_required
                ? 'Confirmar MFA'
                : 'Verificar código'}
          </button>
        </div>
      </form>
    </>
  );
}

export default function LoginModal({ isOpen, onClose }: Props) {
  const { login, completeAuth } = useAuth();
  const router = useRouter();

  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [challenge, setChallenge] = useState<AuthChallengeResponse | null>(null);
  const [info, setInfo] = useState('');

  if (!isOpen) return null;

  const resetChallenge = () => {
    setChallenge(null);
    setInfo('');
    setError('');
  };

  const handleClose = () => {
    resetChallenge();
    setShowForgot(false);
    onClose();
  };

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await login(email, password);

      if ('access_token' in response) {
        completeAuth(response as AuthSuccessResponse);
        handleClose();
        router.replace('/dashboard');
        return;
      }

      const nextChallenge = response as AuthChallengeResponse;
      setChallenge(nextChallenge);

      if (nextChallenge.mfa_enrollment_required) {
        const setupRes = await fetch(`${API_URL}/api/auth/mfa/setup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challenge_token: nextChallenge.challenge_token,
          }),
        });
        const setupData = await setupRes.json();
        if (!setupRes.ok) {
          throw new Error(setupData.error || 'No fue posible iniciar MFA');
        }
        setInfo(setupData.otpauth_url || '');
      } else {
        setInfo('Puedes usar tu app autenticadora o un recovery code.');
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Credenciales inválidas'));
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (
    code: string,
    useRecoveryCode: boolean
  ) => {
    if (!challenge?.challenge_token) return;

    setLoading(true);
    setError('');

    const endpoint = challenge.mfa_enrollment_required
      ? '/api/auth/mfa/confirm'
      : (useRecoveryCode ? '/api/auth/mfa/recovery' : '/api/auth/mfa/verify');

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge_token: challenge.challenge_token,
          code,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Código MFA inválido');
      }

      completeAuth(data as AuthSuccessResponse);
      handleClose();
      router.replace('/dashboard');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Código MFA inválido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          aria-label="Cerrar"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-2">Partner Portal</h2>
        <p className="text-sm text-gray-600 mb-4">
          Acceso exclusivo para socios de FinOpsLatam
        </p>

        {showForgot ? (
          <ForgotPasswordForm onBack={() => setShowForgot(false)} />
        ) : challenge ? (
          <MfaForm
            challenge={challenge}
            error={error}
            info={info}
            loading={loading}
            onBack={resetChallenge}
            onSubmit={handleMfaSubmit}
          />
        ) : (
          <LoginForm
            onLogin={handleLogin}
            error={error}
            loading={loading}
            onForgot={() => {
              setShowForgot(true);
              setError('');
            }}
          />
        )}
      </div>
    </div>
  );
}
