"use client";

/* =====================================================
   AUTH CONTEXT — FINOPSLATAM
   Versión simplificada (solo users)
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
   TYPES
===================================================== */

export interface User {
  id: number;
  email: string;

  global_role: "root" | "admin" | "support" | null;
  client_role: "owner" | "finops_admin" | "viewer" | null;

  is_active: boolean;
  force_password_change: boolean;

  contact_name?: string | null;
}


interface AuthContextType {
  user: User | null;
  token: string | null;

  isRoot: boolean;
  isAdmin: boolean;
  isSupport: boolean;
  isStaff: boolean;

  isAuthReady: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: (reason?: "expired") => void;
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

  const logout = (reason?: "expired") => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    localStorage.removeItem("finops_token");
    localStorage.removeItem("finops_user");

    if (reason === "expired") {
      sessionStorage.setItem("session_expired", "true");
    }

    setUser(null);
    setToken(null);

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
      () => logout("expired"),
      INACTIVITY_LIMIT
    );
  };

  /* =========================
     REHYDRATE SESSION
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

        const freshUser = await apiFetch<User>("/api/me", {
          token: savedToken,
        });

        setUser(freshUser);

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

    localStorage.setItem(
      "finops_user",
      JSON.stringify(data.user)
    );

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
