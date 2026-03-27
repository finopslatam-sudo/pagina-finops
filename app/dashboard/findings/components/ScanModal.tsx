export default function ScanModal() {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8 text-center space-y-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <h2 className="text-lg font-semibold">Scanning AWS resources...</h2>
        <p className="text-gray-500 text-sm">
          FinOpsLatam está analizando tu infraestructura cloud.
          Este proceso puede tardar unos minutos.
        </p>
      </div>
    </div>
  );
}
