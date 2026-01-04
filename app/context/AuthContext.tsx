"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface User {
  id: number;
  email: string;
  role?: "admin" | "client";
  force_password_change?: boolean;
  
  company_name?: string;
  contact_name?: string;
  phone?: string;

  plan?: {
    id: number;
    code: string;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  plan: User["plan"] | null;
  features: string[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const INACTIVITY_LIMIT = 15 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [plan, setPlan] = useState<User["plan"] | null>(null);
  const [features, setFeatures] = useState<string[]>([]);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "https://api.finopslatam.com";

  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    inactivityTimer.current = setTimeout(() => {
      if (token) logout();
    }, INACTIVITY_LIMIT);
  };

  // 🔄 Rehidratar sesión
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("finops_token");
      const savedUser = localStorage.getItem("finops_user");
      const savedPlan = localStorage.getItem("finops_plan");

      if (savedToken && savedUser) {
        setToken(savedToken);
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        if (savedPlan) {
          setPlan(JSON.parse(savedPlan));
        }
      }
    } catch {
      localStorage.clear();
    }
  }, []);

   // 🔐 LOGIN
  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Error al iniciar sesión");
    }

    setUser(data.user);
    setToken(data.access_token);
    setPlan(data.user.plan ?? null);

    localStorage.setItem("finops_token", data.access_token);
    localStorage.setItem("finops_user", JSON.stringify(data.user));

    if (data.user.plan) {
      localStorage.setItem("finops_plan", JSON.stringify(data.user.plan));
    } else {
      localStorage.removeItem("finops_plan");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPlan(null);
    setFeatures([]);
    localStorage.clear();
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
