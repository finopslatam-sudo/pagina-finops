'use client';

import { useEffect, useState } from 'react';

export default function SessionExpiredModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const expired = sessionStorage.getItem(
      "session_expired"
    );

    if (expired === "true") {
      setVisible(true);
      sessionStorage.removeItem(
        "session_expired"
      );
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center space-y-4 shadow-xl">
        <h2 className="text-lg font-semibold">
          Sesión expirada
        </h2>

        <p className="text-sm text-gray-600">
          Por seguridad tu sesión fue cerrada por inactividad.
          Debes volver a iniciar sesión.
        </p>

        <button
          onClick={() => setVisible(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
