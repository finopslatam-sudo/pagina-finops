"use client";

/* =====================================================
   AUTH CONTEXT — FINOPSLATAM
   Gestión centralizada de sesión, usuario y permisos
===================================================== */

/* =====================================================
   IMPORTS
===================================================== */

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { apiFetch } from "@/app/lib/api";

/* =====================================================
   TYPES — USER (users + clients JOIN)
===================================================== */

/**
 * Representa el usuario autenticado
 * Resultado real del backend (JOIN users + clients)
 */
export interface User {
  id: number;
  email: string;

  global_role: "root" | "admin" | "support" | null;
  client_role: "owner" | "finops_admin" | "viewer" | null;
  client_id: number | null;

  is_active: boolean;
  force_password_change: boolean;

  company_name?: string | null;
  contact_name?: string | null;
  phone?: string | null;

  plan?: {
    id: number;
    code: string;
    name: string;
  } | null;
}
/**
 * Estado del plan del cliente
 * (no forma parte del User table)
 */
export type PlanState =
  | { status: "loading" }
  | { status: "none" }
  | {
      status: "assigned";
      plan: {
        id: number;
        code: string;
        name: string;
      };
    };

/**
 * Contrato del AuthContext
 */
interface AuthContextType {
  user: User | null;
  token: string | null;

  /* ===== PERMISOS DERIVADOS ===== */
  isRoot: boolean;
  isAdmin: boolean;
  isSupport: boolean;
  isStaff: boolean;

  /* ===== PLAN ===== */
  planState: PlanState;

  /* ===== ESTADO ===== */
  isAuthReady: boolean;

  /* ===== ACCIONES ===== */
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
}

/* =====================================================
   CONTEXT
===================================================== */

const AuthContext = createContext<AuthContextType | null>(null);

/* =====================================================
   CONFIG
===================================================== */

const INACTIVITY_LIMIT = 10 * 60 * 1000;

/* =====================================================
   PROVIDER
===================================================== */

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  /* =========================
     STATE
  ========================== */

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [planState, setPlanState] = useState<PlanState>({
    status: "loading",
  });

  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLoggingOutRef = useRef(false);

  /* =========================
     PERMISSIONS
  ========================== */

  const isRoot = user?.global_role === "root";
  const isAdmin = user?.global_role === "admin";
  const isSupport = user?.global_role === "support";
  
  const isStaff = isRoot || isAdmin || isSupport;
  

  /* =========================
     LOGOUT
  ========================== */

  const logout = (reason?: 'expired') => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;
  
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
  
    localStorage.removeItem("finops_token");
    localStorage.removeItem("finops_user");
  
    if (reason === 'expired') {
      sessionStorage.setItem(
        "session_expired",
        "true"
      );
    }
  
    setUser(null);
    setToken(null);
    setPlanState({ status: "none" });
  
    router.replace("/");
  };
  

  /* =========================
     INACTIVITY
  ========================== */

  const resetInactivityTimer = () => {
    if (!token) return;

    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    inactivityTimer.current = setTimeout(
      () => logout('expired'),
      INACTIVITY_LIMIT
    );
    
  };

  /* =========================
   REHYDRATE SESSION (ENTERPRISE SAFE)
   - Token es source of truth
   - User siempre se valida contra backend
========================== */

useEffect(() => {
  const rehydrate = async () => {
    try {
      const savedToken = localStorage.getItem("finops_token");

      if (!savedToken) {
        setIsAuthReady(true);
        return;
      }

      setToken(savedToken);

      // 🔎 Validamos sesión contra backend
      const freshUser = await apiFetch<User>("/api/me", {
        token: savedToken,
      });

      setUser(freshUser);

      // Solo cache defensivo, NO source of truth
      localStorage.setItem(
        "finops_user",
        JSON.stringify(freshUser)
      );
    } catch (err) {
      console.warn("[REHYDRATE_FAILED]", err);
      logout();
    } finally {
      setIsAuthReady(true);
    }
  };

  rehydrate();
}, []);


  /* =========================
     FETCH PLAN
  ========================== */

  useEffect(() => {
    if (!token || !user?.client_id) {
      setPlanState({ status: "none" });
      return;
    }

    apiFetch("/api/client/plan", { token })
      .then((data) =>
        setPlanState({
          status: "assigned",
          plan: data.plan,
        })
      )
      .catch(() =>
        setPlanState({ status: "none" })
      );
  }, [token, user?.client_id]);

  /* =========================
     ACTIVITY TRACKING
  ========================== */

  useEffect(() => {
    if (!user || !token) return;

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];

    const handler = () => resetInactivityTimer();

    events.forEach((e) =>
      window.addEventListener(e, handler)
    );

    resetInactivityTimer();

    return () => {
      events.forEach((e) =>
        window.removeEventListener(e, handler)
      );
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [user, token]);

  /* =========================
     LOGIN
  ========================== */

  const login = async (
    email: string,
    password: string
  ) => {
    isLoggingOutRef.current = false;
  
    const data = await apiFetch<{
      access_token: string;
      user: User;
    }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
  
    setToken(data.access_token);
    setUser(data.user);
  
    localStorage.setItem(
      "finops_token",
      data.access_token
    );
  
    // Guardado defensivo, pero NO se usa como source of truth
    localStorage.setItem(
      "finops_user",
      JSON.stringify(data.user)
    );
  
    // 🚫 NO redirigimos aquí por force_password_change
    // PrivateRoute se encarga del bloqueo
  
    router.replace("/dashboard");
  };
    

  /* =========================
     UPDATE USER (LOCAL)
  ========================== */

  const updateUser = (partial: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;

      const merged = { ...prev, ...partial };
      localStorage.setItem(
        "finops_user",
        JSON.stringify(merged)
      );
      return merged;
    });
  };

  /* =========================
     PROVIDER EXPORT
  ========================== */

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        planState,
        isRoot,
        isAdmin,
        isSupport,
        isStaff,
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
