'use client';

import { usePathname } from 'next/navigation';

const WHATSAPP_URL =
  'https://wa.me/56965090121?text=' +
  encodeURIComponent('Hola, quiero más información sobre FinOpsLatam');

export default function WhatsAppFloatingButton() {
  const pathname = usePathname();

  // El dashboard ya tiene su propio botón flotante (Asistente FinOps.ia)
  // en la misma esquina, y es para clientes ya autenticados.
  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      title="Escríbenos por WhatsApp"
      className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-current">
        <path d="M16.004 3.2c-7.07 0-12.8 5.73-12.8 12.8 0 2.26.6 4.45 1.73 6.39L3.2 28.8l6.4-1.68a12.74 12.74 0 0 0 6.4 1.73h.005c7.07 0 12.8-5.73 12.8-12.8s-5.73-12.85-12.8-12.85Zm0 23.36h-.004a10.6 10.6 0 0 1-5.4-1.48l-.387-.23-4.02 1.05 1.073-3.92-.253-.4a10.56 10.56 0 0 1-1.62-5.66c0-5.86 4.77-10.63 10.63-10.63 2.84 0 5.51 1.11 7.52 3.12a10.55 10.55 0 0 1 3.11 7.52c0 5.86-4.77 10.63-10.63 10.63Zm5.83-7.96c-.32-.16-1.9-.94-2.2-1.04-.29-.11-.51-.16-.72.16-.21.32-.83 1.04-1.02 1.25-.19.21-.37.24-.69.08-.32-.16-1.34-.5-2.55-1.58-.94-.84-1.58-1.87-1.76-2.19-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.53-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64s1.14 3.06 1.29 3.27c.16.21 2.24 3.42 5.42 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </a>
  );
}
