type Props = {
  runningAudit: boolean;
  lastScan: string | null;
  onRunAudit: () => void;
};

export default function FindingsHeader({ runningAudit, lastScan, onRunAudit }: Props) {
  return (
    <div className="bg-slate-100 border border-blue-300 p-5 sm:p-8 rounded-3xl shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold text-slate-800">
          Findings &amp; Optimization
        </h1>
        <p className="text-slate-600 mt-3">
          Detección y recomendaciones de optimización (rightsizing, tags, gobernanza y costos)
          en tu entorno cloud, incluyendo ahorro estimado y acciones sugeridas.
        </p>
      </div>

      <div className="flex flex-col items-start sm:items-end w-full sm:w-auto">
        <button
          onClick={onRunAudit}
          disabled={runningAudit}
          className={`px-5 py-3 rounded-xl text-white font-semibold flex items-center gap-2 ${
            runningAudit ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {runningAudit && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          )}
          {runningAudit ? 'Scanning...' : 'Run Scan'}
        </button>
        {lastScan && (
          <p className="text-xs text-gray-500 mt-2">
            Last scan: {new Date(lastScan).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
