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
const INACTIVITY_LIMIT = 15 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [plan, setPlan] = useState<any | null>(null);
  const [features, setFeatures] = useState<string[]>([]);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL &&
    process.env.NEXT_PUBLIC_API_URL.trim() !== ""
      ? process.env.NEXT_PUBLIC_API_URL
      : "https://api.finopslatam.com";

  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    inactivityTimer.current = setTimeout(() => {
      if (token) {
        logout();
      }
    }, INACTIVITY_LIMIT);
  };

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
  }, []);

  // ⏱️ Inactividad
  useEffect(() => {
    if (!user) return;

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    const handleActivity = () => resetInactivityTimer();

    events.forEach((event) =>
      window.addEventListener(event, handleActivity)
    );

    resetInactivityTimer();

    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }

      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
    };
  }, [user, token]);

  // 🔄 Refrescar plan y features
  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/api/me/plan`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.plan) {
          setPlan(data.plan);
          localStorage.setItem("finops_plan", JSON.stringify(data.plan));
        }
      })
      .catch(() => {});

    fetch(`${API_URL}/api/me/features`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.features) {
          setFeatures(data.features);
        }
      })
      .catch(() => {});
  }, [token]);

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