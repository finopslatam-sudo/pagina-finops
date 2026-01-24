'use client';

/* =====================================================
   MODAL UI — FINOPSLATAM
   Componente base reutilizable
===================================================== */

/* =====================================================
   IMPORTS
===================================================== */

import { ReactNode, useEffect } from 'react';

/* =====================================================
   TYPES
===================================================== */

interface ModalProps {
  /**
   * Control de visibilidad
   */
  isOpen: boolean;

  /**
   * Callback de cierre
   * (el padre decide qué hacer)
   */
  onClose: () => void;

  /**
   * Contenido del modal
   */
  children: ReactNode;
}

/* =====================================================
   COMPONENT
===================================================== */

/**
 * Modal
 *
 * Componente UI genérico.
 *
 * Características:
 * - No conoce backend
 * - No conoce AuthContext
 * - No maneja lógica de negocio
 * - Reutilizable en toda la app
 * - Accesible (ARIA + ESC)
 */
export default function Modal({
  isOpen,
  onClose,
  children,
}: ModalProps) {
  /* =========================
     ESC KEY HANDLER
  ========================== */

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  /* =========================
     STATE
  ========================== */

  if (!isOpen) return null;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      onClick={onClose} // click fuera cierra
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg relative min-w-[300px]"
        onClick={(e) => e.stopPropagation()} // evita cierre al click interno
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* CONTENT */}
        {children}
      </div>
    </div>
  );
}
