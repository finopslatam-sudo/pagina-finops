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
  role: "admin" | "client";
  company_name: string;
  contact_name: string;
  phone: string;
  is_active: boolean;
  is_root: boolean;
  force_password_change?: boolean;
  global_role?: 'root' | 'support' | null;
  client_role?: 'owner' | 'finops_admin' | 'viewer' | null;
  client_id?: number | null;
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
  isAdmin: boolean;
  isAuthReady: boolean; 
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (partialUser: Partial<User>) => void;
}

/* =====================================================
   CONTEXT
===================================================== */

const AuthContext = createContext<AuthContextType | null>(null);

/* ⏱ 10 minutos */
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

  const [isAuthReady, setIsAuthReady] = useState(false); 

  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoggingOutRef = useRef(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "https://api.finopslatam.com";

  console.log("🔥 API_URL EN FRONTEND:", API_URL);  

  const isAdmin = user?.role === "admin";

  /* =====================================================
     LOGOUT
  ===================================================== */

  const logout = () => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }

    localStorage.clear();
    setUser(null);
    setToken(null);
    setPlanState({ status: "none" });

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
    } finally {
      setIsAuthReady(true); 
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
      credentials: "include", // ✅ ESTA LÍNEA ES CLAVE
      body: JSON.stringify({ email, password }),
    });
  
    const data = await res.json();

    console.log("LOGIN USER:", data.user);
  
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

  const updateUser = (partialUser: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;

      const merged = { ...prev, ...partialUser };
      localStorage.setItem(
        "finops_user",
        JSON.stringify(merged)
      );
      return merged;
    });
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
        isAdmin,
        isAuthReady,
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
