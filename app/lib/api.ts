/* =====================================================
   API CLIENT — FINOPSLATAM
   Punto único de comunicación con el backend
===================================================== */

/* =====================================================
   BASE URL
===================================================== */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  'https://api.finopslatam.com';

/* =====================================================
   TYPES
===================================================== */

export interface ApiFetchOptions {
  token?: string | null;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
}

/**
 * Error tipado para consumo en UI
 */
export interface ApiError extends Error {
  status?: number;
  payload?: any;
}

/* =====================================================
   EVENTOS GLOBALES
===================================================== */

/**
 * Evento global para forzar logout
 * Escuchado por AuthContext
 */
export const AUTH_LOGOUT_EVENT = 'finops:force-logout';

/* =====================================================
   API FETCH
===================================================== */

export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { token, method = 'GET', body } = options;

  /* ============================
     HEADERS
  ============================ */

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  /* ============================
     REQUEST
  ============================ */

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  /* ============================
     AUTH ERRORS (CRÍTICO)
     401 / 403 → sesión inválida
  ============================ */

  if (res.status === 401 || res.status === 403) {
    /**
     * 🚨 Seguridad:
     * Token inválido / expirado / revocado
     *
     * No intentamos refresh silencioso
     * No seguimos ejecutando lógica
     * Forzamos logout global
     */
    window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));

    const error: ApiError = new Error('Sesión expirada');
    error.status = res.status;
    throw error;
  }

  /* ============================
     ERROR HANDLING GENERAL
  ============================ */

  if (!res.ok) {
    let payload: any = null;

    try {
      payload = await res.json();
    } catch {
      payload = null;
    }

    const error: ApiError = new Error(
      payload?.error ||
      payload?.msg ||
      `Error HTTP ${res.status}`
    );

    error.status = res.status;
    error.payload = payload;

    throw error;
  }

  /* ============================
     RESPONSE PARSING
  ============================ */

  const contentType = res.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return res.json();
  }

  /**
   * Fallback de seguridad:
   * - CSV
   * - PDF
   * - XLSX
   */
  return res.text() as unknown as T;
}
