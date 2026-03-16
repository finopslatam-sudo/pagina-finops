'use client';

import { useAuth } from '@/app/context/AuthContext';

export default function SessionExpiredModal() {
  const {
    sessionWarningVisible,
    sessionCountdown,
    staySignedIn,
    logout,
  } = useAuth();

  if (!sessionWarningVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-md text-center space-y-4 shadow-xl">
        <h2 className="text-lg font-semibold">
          Tu sesion esta por expirar
        </h2>

        <p className="text-sm text-gray-600">
          Por seguridad, tu sesion se cerrara automaticamente en{" "}
          <span className="font-semibold text-gray-900">
            {sessionCountdown}
          </span>{" "}
          segundo{sessionCountdown === 1 ? "" : "s"} por inactividad.
        </p>

        <p className="text-sm text-gray-600">
          Si deseas continuar trabajando, puedes mantener tu sesion activa.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={staySignedIn}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Mantener sesion
          </button>

          <button
            onClick={() => logout("expired")}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg"
          >
            Cerrar sesion
          </button>
        </div>
      </div>
    </div>
  );
}
