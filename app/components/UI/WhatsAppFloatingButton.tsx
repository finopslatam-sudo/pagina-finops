'use client';

/* =====================================================
   WHATSAPP FLOATING BUTTON
   - Conversión directa
   - No invasivo
   - Estilo enterprise
===================================================== */

export default function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/56965090121?text=Hola,%20quiero%20información%20sobre%20FinOpsLatam"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        bg-green-500 hover:bg-green-600
        text-white text-2xl
        flex items-center justify-center
        shadow-lg hover:shadow-xl
        transition-all
      "
    >
      💬
    </a>
  );
}
