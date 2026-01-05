"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/* =====================================================
   TIPOS
===================================================== */

export interface User {
  id: number;
  email: string;
  role?: "admin" | "client";
  force_password_change?: boolean;
  company_name?: string;
  contact_name?: string;
  phone?: string;
}

type PlanState =
  | { status: "loading" }
  | {
      status: "assigned";
      plan: { id: number; code: string; name: string };
    }
  | { status: "none" };

interface AuthContextType {
  user: User | null;
  token: string | null;
  planState: PlanState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

/* =====================================================
   CONTEXT
===================================================== */

const AuthContext = createContext<AuthContextType | null>(null);

/* ⏱ 10 minutos exactos */
const INACTIVITY_LIMIT = 10 * 60 * 1000;

/* =====================================================
   PROVIDER
===================================================== */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [planState, setPlanState] = useState<PlanState>({
    status: "loading",
  });

  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoggingOutRef = useRef(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "https://api.finopslatam.com";

  /* =====================================================
     LOGOUT (BLINDADO)
  ===================================================== */

  const logout = () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }

    // ⛔️ IMPORTANTE: primero limpiar storage
    localStorage.clear();

    // ⛔️ luego limpiar estado
    setUser(null);
    setToken(null);
    setPlanState({ status: "none" });

    // ⛔️ salir inmediatamente
    router.replace("/");
  };

  /* =====================================================
     INACTIVIDAD
  ===================================================== */

  const resetInactivityTimer = () => {
    if (!token) return;

    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    inactivityTimer.current = setTimeout(() => {
      logout();
    }, INACTIVITY_LIMIT);
  };

  /* =====================================================
     REHIDRATAR SESIÓN
  ===================================================== */

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("finops_token");
      const savedUser = localStorage.getItem("finops_user");
      const savedPlan = localStorage.getItem("finops_plan");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));

        if (savedPlan) {
          setPlanState({
            status: "assigned",
            plan: JSON.parse(savedPlan),
          });
        } else {
          setPlanState({ status: "none" });
        }
      } else {
        setPlanState({ status: "none" });
      }
    } catch {
      localStorage.clear();
      setPlanState({ status: "none" });
    }
  }, []);

  /* =====================================================
     LISTENERS DE ACTIVIDAD
  ===================================================== */

  useEffect(() => {
    if (!user || !token) return;

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    const handleActivity = () => resetInactivityTimer();

    events.forEach((e) =>
      window.addEventListener(e, handleActivity)
    );

    resetInactivityTimer();

    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }

      events.forEach((e) =>
        window.removeEventListener(e, handleActivity)
      );
    };
  }, [user, token]);

  /* =====================================================
     LOGIN
  ===================================================== */

  const login = async (email: string, password: string) => {
    isLoggingOutRef.current = false;

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

    localStorage.setItem("finops_token", data.access_token);
    localStorage.setItem("finops_user", JSON.stringify(data.user));

    if (data.user?.plan) {
      setPlanState({
        status: "assigned",
        plan: data.user.plan,
      });
      localStorage.setItem(
        "finops_plan",
        JSON.stringify(data.user.plan)
      );
    } else {
      setPlanState({ status: "none" });
      localStorage.removeItem("finops_plan");
    }
  };

  /* =====================================================
     UPDATE USER
  ===================================================== */

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(
      "finops_user",
      JSON.stringify(updatedUser)
    );
  };

  /* =====================================================
     PROVIDER
  ===================================================== */

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        planState,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* =====================================================
   HOOK
===================================================== */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "useAuth debe usarse dentro de AuthProvider"
    );
  }
  return ctx;
}
