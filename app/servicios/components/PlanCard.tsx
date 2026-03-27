export default function PlanCard({
  title,
  description,
  features,
  bg,
  border,
  button,
  highlight,
  onClick,
}: {
  title: string;
  description: string;
  features: string[];
  bg: string;
  border: string;
  button: string;
  highlight?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`
        relative rounded-3xl p-8 flex flex-col shadow-xl
        ${bg} ${border}
        transition-transform hover:-translate-y-1
      `}
    >
      {/* DESCUENTO */}
      <span className="
        absolute -top-6 left-1/2 -translate-x-1/2
        bg-green-600 text-white
        text-base font-bold
        px-6 py-2
        rounded-full
        shadow-lg
        tracking-wide
      ">
        🎉 20% DCTO
      </span>

      {/* MÁS ELEGIDO */}
      {highlight && (
        <span className="absolute top-6 right-6 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          Más elegido
        </span>
      )}

      <h2 className="text-2xl font-bold mb-2 text-gray-900">{title}</h2>
      <p className="text-gray-700 mb-6">{description}</p>

      <ul className="space-y-2 text-gray-800 flex-1 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✔</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onClick}
        className={`${button} text-white font-semibold py-3 rounded-xl transition hover:opacity-90`}
      >
        Contratar Plan
      </button>
    </div>
  );
}
