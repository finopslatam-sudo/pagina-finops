'use client';

/* =====================================================
   CONFIRM DIALOG
   - Componente UI reutilizable
   - NO conoce backend
   - NO contiene lógica de negocio
   - Accesible (a11y)
===================================================== */

/* =====================================================
   TYPES
===================================================== */

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText: string;

  /**
   * Callback cuando el usuario cancela
   */
  onCancel: () => void;

  /**
   * Callback cuando el usuario confirma
   */
  onConfirm: () => void;

  /**
   * Estilo del botón de confirmación
   * default: danger (rojo)
   */
  variant?: 'danger' | 'primary';
}

/* =====================================================
   COMPONENT
===================================================== */

export default function ConfirmDialog({
  title,
  message,
  confirmText,
  onCancel,
  onConfirm,
  variant = 'danger',
}: ConfirmDialogProps) {
  const confirmButtonStyle =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700'
      : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">

        {/* TITLE */}
        <h2 className="text-lg font-semibold mb-2">
          {title}
        </h2>

        {/* MESSAGE */}
        <p className="text-sm text-gray-600 mb-4">
          {message}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:underline"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg ${confirmButtonStyle}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
