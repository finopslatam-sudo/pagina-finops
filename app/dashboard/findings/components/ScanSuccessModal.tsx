type Props = { onClose: () => void };

export default function ScanSuccessModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 text-center space-y-6">
        <div className="text-5xl">✅</div>
        <h2 className="text-lg font-semibold">Scan completed successfully</h2>
        <p className="text-gray-500 text-sm">
          FinOpsLatam terminó de analizar tu infraestructura cloud.
          Los findings demoran entre 3 a 5 minutos en reflejarse la primera vez.
        </p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
