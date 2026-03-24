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
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  cacheTtlMs?: number;
  cacheKey?: string;
}

/**
 * Error tipado para consumo en UI
 */
export interface ApiError extends Error {
  status?: number;
  payload?: unknown;
}

interface CacheEntry {
  expiresAt: number;
  value: unknown;
}

const responseCache = new Map<string, CacheEntry>();
const inflightRequests = new Map<string, Promise<unknown>>();

function buildCacheKey(
  endpoint: string,
  token: string | null | undefined,
  cacheKey?: string
) {
  const tokenScope = token ? token.slice(-16) : 'anon';
  return `${cacheKey ?? endpoint}::${tokenScope}`;
}

export function clearApiCache() {
  responseCache.clear();
  inflightRequests.clear();
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

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { token, method = 'GET', body, cacheTtlMs = 0, cacheKey } = options;
  const shouldUseCache = method === 'GET' && cacheTtlMs > 0;
  const resolvedCacheKey = shouldUseCache
    ? buildCacheKey(endpoint, token, cacheKey)
    : null;

  if (resolvedCacheKey) {
    const cached = responseCache.get(resolvedCacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value as T;
    }

    const inflight = inflightRequests.get(resolvedCacheKey);
    if (inflight) {
      return inflight as Promise<T>;
    }
  }

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

  const requestPromise = (async () => {
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
      let payload: unknown = null;

      try {
        payload = await res.json();
      } catch {
        payload = null;
      }

      const payloadObj = payload as { error?: string; msg?: string } | null;
      const error: ApiError = new Error(
        payloadObj?.error ||
        payloadObj?.msg ||
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
    let parsedResponse: T;

    if (contentType?.includes('application/json')) {
      parsedResponse = await res.json();
    } else {
      /**
       * Fallback de seguridad:
       * - CSV
       * - PDF
       * - XLSX
       */
      parsedResponse = await res.text() as unknown as T;
    }

    if (resolvedCacheKey) {
      responseCache.set(resolvedCacheKey, {
        expiresAt: Date.now() + cacheTtlMs,
        value: parsedResponse,
      });
    }

    return parsedResponse;
  })();

  if (resolvedCacheKey) {
    inflightRequests.set(resolvedCacheKey, requestPromise);
  }

  try {
    return await requestPromise;
  } finally {
    if (resolvedCacheKey) {
      inflightRequests.delete(resolvedCacheKey);
    }
  }
}
