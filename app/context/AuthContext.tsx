"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: number;
  company_name: string;
  email: string;
  contact_name?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  plan: any;
  features: string[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void; 
}


const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [plan, setPlan] = useState<any>(null);
  const [features, setFeatures] = useState<string[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🔐 LOGIN CORRECTO (firma clara)
  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      throw new Error("Credenciales inválidas");
    }

    const data = await res.json();

    setUser(data.client);
    setToken(data.access_token);

    localStorage.setItem("finops_token", data.access_token);
    localStorage.setItem("finops_user", JSON.stringify(data.client));

    // 🔹 cargar plan
    const planRes = await fetch(`${API_URL}/api/me/plan`, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    const planData = await planRes.json();
    setPlan(planData.plan);

    // 🔹 cargar features
    const featRes = await fetch(`${API_URL}/api/me/features`, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    const featData = await featRes.json();
    setFeatures(featData.features);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPlan(null);
    setFeatures([]);

    localStorage.removeItem("finops_token");
    localStorage.removeItem("finops_user");
  };
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("finops_user", JSON.stringify(updatedUser));
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        plan,
        features,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}
