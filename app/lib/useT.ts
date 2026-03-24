'use client';

/* =====================================================
   useT — hook de traducciones
   Devuelve el objeto de strings para el idioma activo
===================================================== */

import { useLang } from '@/app/context/LanguageContext';
import { translations } from '@/app/lib/translations';

export function useT() {
  const { lang } = useLang();
  return translations[lang];
}
