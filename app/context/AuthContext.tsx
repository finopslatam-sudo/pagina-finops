'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🔐 Cargar sesión persistida
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedClient = localStorage.getItem('finops_client');
    if (savedClient) {
      setUser(JSON.parse(savedClient));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // 🛑 Protección crítica
      if (!API_URL) {
        console.error('❌ NEXT_PUBLIC_API_URL no está definida');
        return {
          success: false,
          error: 'Configuración incorrecta del frontend (API_URL)',
        };
      }

      const loginUrl = `${API_URL}/api/auth/login`;

      // 🔍 Log SOLO para debugging (puedes quitarlo luego)
      console.log('➡️ Intentando login contra:', loginUrl);

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

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}
