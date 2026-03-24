'use client';

/* =====================================================
   LANGUAGE SWITCHER — FINOPSLATAM
   Botones ES / EN con bandera + texto activo resaltado
===================================================== */

import { useLang } from '@/app/context/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-0.5">

      <button
        onClick={() => setLang('es')}
        title="Español"
        aria-label="Cambiar a Español"
        className={`flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-all ${
          lang === 'es'
            ? 'bg-blue-100 text-blue-700 shadow-sm'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span className="text-base leading-none">🇪🇸</span>
        <span className="hidden sm:inline">ES</span>
      </button>

      <button
        onClick={() => setLang('en')}
        title="English"
        aria-label="Switch to English"
        className={`flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-all ${
          lang === 'en'
            ? 'bg-blue-100 text-blue-700 shadow-sm'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
        }`}
      >
        <span className="text-base leading-none">🇺🇸</span>
        <span className="hidden sm:inline">EN</span>
      </button>

    </div>
  );
}
