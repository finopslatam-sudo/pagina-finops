"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: number;
  company_name: string;
  email: string;
  contact_name?: string;
  phone?: string;
  role?: "admin" | "client";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  plan: any | null;
  features: string[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [plan, setPlan] = useState<any | null>(null);
  const [features, setFeatures] = useState<string[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🔄 Rehidratar sesión
  useEffect(() => {
    const savedToken = localStorage.getItem("finops_token");
    const savedUser = localStorage.getItem("finops_user");
    const savedPlan = localStorage.getItem("finops_plan");

    if (!savedToken || !savedUser) return;

    setToken(savedToken);
    setUser(JSON.parse(savedUser));

    if (savedPlan) {
      try {
        setPlan(JSON.parse(savedPlan));
      } catch {
        localStorage.removeItem("finops_plan");
        setPlan(null);
      }
    }

    // 🔹 Refrescar plan desde API
    fetch(`${API_URL}/api/me/plan`, {
      headers: { Authorization: `Bearer ${savedToken}` },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.plan) {
          setPlan(data.plan);
          localStorage.setItem("finops_plan", JSON.stringify(data.plan));
        }
      })
      .catch(() => {});

    // 🔹 Refrescar features
    fetch(`${API_URL}/api/me/features`, {
      headers: { Authorization: `Bearer ${savedToken}` },
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.features) setFeatures(data.features);
      })
      .catch(() => {});
  }, []);

  // 🔐 LOGIN
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

    // 🔹 Plan
    const planRes = await fetch(`${API_URL}/api/me/plan`, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });

    if (planRes.ok) {
      const planData = await planRes.json();
      setPlan(planData.plan);
      localStorage.setItem("finops_plan", JSON.stringify(planData.plan));
    } else {
      setPlan(null);
      localStorage.removeItem("finops_plan");
    }

    // 🔹 Features
    const featRes = await fetch(`${API_URL}/api/me/features`, {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });

    if (featRes.ok) {
      const featData = await featRes.json();
      setFeatures(featData.features || []);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPlan(null);
    setFeatures([]);

    localStorage.removeItem("finops_token");
    localStorage.removeItem("finops_user");
    localStorage.removeItem("finops_plan");
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("finops_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, plan, features, login, logout, updateUser }}
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
