"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ✅ Backend centralizado (PRO)
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.finopslatam.com";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const router = useRouter();

  // LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // FORGOT PASSWORD
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      await login(email, password);
      onClose();
  
      // 🔁 Redirección única: el dashboard decide según rol
      router.replace("/dashboard");

  
    } catch (err) {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };
   
  const handleForgotPassword = async () => {
    setForgotLoading(true);
    setForgotMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      // 🔎 Seguridad + debug
      if (!response.ok) {
        console.error("Forgot password error:", response.status);
      }

      setForgotMessage(
        "Si el correo existe, recibirás instrucciones en tu email."
      );
    } catch (err) {
      console.error("Forgot password fetch failed:", err);
      setForgotMessage(
        "Si el correo existe, recibirás instrucciones en tu email."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-2">Partner Portal</h2>
        <p className="text-sm text-gray-600 mb-4">
          Acceso exclusivo para socios de FinOpsLatam
        </p>

        {error && !showForgot && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {!showForgot ? (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {loading ? "Ingresando..." : "Acceder al Portal de Socios"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setShowForgot(true);
                setError("");
              }}
              className="w-full text-sm text-blue-600 hover:underline mt-2"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </>
        ) : (
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
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg mb-4"
                  required
                />

                <button
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg"
                >
                  {forgotLoading ? "Enviando..." : "Enviar"}
                </button>
              </>
            )}

            <button
              onClick={() => {
                setShowForgot(false);
                setForgotEmail("");
                setForgotMessage("");
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
