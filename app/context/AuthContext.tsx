'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import config from '@/app/lib/config';

/* =======================
   Tipos
======================= */
export interface User {
  id?: number;
  email?: string;
  company_name?: string;
  contact_name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

/* =======================
   Contexto
======================= */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* =======================
   Provider
======================= */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  /**
   * 🔐 API URL CENTRALIZADA
   * Esta constante queda HARDCODEADA en el bundle
   * (gracias a config.js con fallback)
   */
  const API_URL = config.API_BASE_URL;

  /* =======================
     Cargar sesión persistida
  ======================= */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedClient = localStorage.getItem('finops_client');
      if (savedClient) {
        setUser(JSON.parse(savedClient));
      }
    } catch (err) {
      console.error('❌ Error leyendo sesión guardada:', err);
      localStorage.removeItem('finops_client');
    }
  }, []);

  /* =======================
     Login
  ======================= */
  const login = async (email: string, password: string) => {
    try {
      if (!API_URL) {
        console.error('❌ API_BASE_URL no definida');
        return {
          success: false,
          error: 'Configuración incorrecta del frontend',
        };
      }

      const loginUrl = `${API_URL}/api/auth/login`;

      // 🔍 LOG CLAVE (debe verse en producción)
      console.log('➡️ Login contra:', loginUrl);

      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        return {
          success: false,
          error: 'Credenciales inválidas',
        };
      }

      const data = await res.json();

      // 🔐 Persistencia
      localStorage.setItem('finops_token', data.access_token);
      localStorage.setItem('finops_client', JSON.stringify(data.client));

      setUser(data.client);

      return { success: true };
    } catch (error) {
      console.error('❌ Error en login:', error);
      return {
        success: false,
        error: 'Error de conexión con el servidor',
      };
    }
  };

  /* =======================
     Logout
  ======================= */
  const logout = () => {
    localStorage.removeItem('finops_token');
    localStorage.removeItem('finops_client');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* =======================
   Hook
======================= */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}
