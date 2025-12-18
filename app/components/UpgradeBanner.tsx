export default function UpgradeBanner() {
    return (
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl text-center">
        <h3 className="text-lg font-semibold mb-2">
          🚀 Desbloquea esta funcionalidad
        </h3>
        <p className="text-gray-600 mb-4">
          Tu plan actual no incluye este módulo.
        </p>
        <a
          href="/planes"
          className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Ver planes
        </a>
      </div>
    );
  }
  