"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Client {
  id: number;
  email: string;
  name: string;
  company_name?: string;  // ← AGREGADO
  // agrega más campos si tu backend los devuelve
}

interface AuthContextType {
  user: Client | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Client | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Mantener sesión si ya había login previo
  useEffect(() => {
    const savedClient = localStorage.getItem("finops_client");
    if (savedClient) {
      setUser(JSON.parse(savedClient));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 401)
        return { success: false, error: "Credenciales inválidas" };

      if (!response.ok)
        return { success: false, error: "Servidor " + response.status };

      const data = await response.json();

      // Guardamos token + usuario completo
      localStorage.setItem("finops_token", data.access_token);
      localStorage.setItem("finops_client", JSON.stringify(data.client));

      setUser(data.client);

      return { success: true };
    } catch {
      return { success: false, error: "Error de conexión" };
    }
  };

  const logout = () => {
    localStorage.removeItem("finops_token");
    localStorage.removeItem("finops_client");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
};
