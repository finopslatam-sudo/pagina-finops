"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  companyUrl?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("finops_token");
    const storedUser = localStorage.getItem("finops_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = (data: any) => {
    localStorage.setItem("finops_token", data.access_token);
    localStorage.setItem("finops_user", JSON.stringify(data.client));

    setToken(data.access_token);
    setUser(data.client);
  };

  const logout = () => {
    localStorage.removeItem("finops_token");
    localStorage.removeItem("finops_user");
    setToken(null);
    setUser(null);
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};