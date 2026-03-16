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
import { AUTH_LOGOUT_EVENT, apiFetch } from "@/app/lib/api";

/* =====================================================
   TYPES
===================================================== */

export interface User {
  id: number;
  email: string;

  global_role: "root" | "admin" | "support" | null;
  client_role: "owner" | "finops_admin" | "viewer" | null;

  client_id: number | null;

  is_active: boolean;
  force_password_change: boolean;

  contact_name?: string | null;

  plan_code?: string | null;
}


interface AuthContextType {
  user: User | null;
  token: string | null;

  isRoot: boolean;
  isAdmin: boolean;
  isSupport: boolean;
  isStaff: boolean;

  isOwner: boolean;
  isFinopsAdmin: boolean;
  isViewer: boolean;
  isClientUser: boolean;
  refreshUser: () => Promise<void>;

  /* =========================
     PLAN FLAGS
  ========================== */

  isFoundation: boolean;
  isProfessional: boolean;
  isEnterprise: boolean;

  isAuthReady: boolean;
  sessionWarningVisible: boolean;
  sessionCountdown: number;

  login: (email: string, password: string) => Promise<void>;
  logout: (reason?: "expired") => void;
  staySignedIn: () => void;
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
const SESSION_WARNING_DURATION = 10 * 1000;
const SESSION_WARNING_SECONDS = 10;

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
  const [sessionWarningVisible, setSessionWarningVisible] = useState(false);
  const [sessionCountdown, setSessionCountdown] = useState(
    SESSION_WARNING_SECONDS
  );

  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLoggingOutRef = useRef(false);

  /* =========================
     PERMISSIONS
  ========================== */

  const isRoot = user?.global_role === "root";
  const isAdmin = user?.global_role === "admin";
  const isSupport = user?.global_role === "support";
  const isStaff = isRoot || isAdmin || isSupport;
  const isOwner = user?.client_role === "owner";
  const isFinopsAdmin = user?.client_role === "finops_admin";
  const isViewer = user?.client_role === "viewer";

  const isClientUser = !!user?.client_role;
  const isFoundation = user?.plan_code === "FINOPS_FOUNDATION";
  const isProfessional = user?.plan_code === "FINOPS_PROFESSIONAL";
  const isEnterprise = user?.plan_code === "FINOPS_ENTERPRISE";

  /* =========================
     LOGOUT
  ========================== */

  const logout = (reason?: "expired") => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    if (warningTimer.current) {
      clearTimeout(warningTimer.current);
    }

    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
    }

    localStorage.removeItem("finops_token");
    localStorage.removeItem("finops_user");

    setUser(null);
    setToken(null);
    setSessionWarningVisible(false);
    setSessionCountdown(SESSION_WARNING_SECONDS);

    router.replace("/");
  };

  /* =========================
     INACTIVITY
  ========================== */

  const startSessionWarning = () => {
    setSessionWarningVisible(true);
    setSessionCountdown(SESSION_WARNING_SECONDS);

    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
    }

    countdownTimer.current = setInterval(() => {
      setSessionCountdown((prev) => {
        if (prev <= 1) {
          if (countdownTimer.current) {
            clearInterval(countdownTimer.current);
          }
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    inactivityTimer.current = setTimeout(
      () => logout("expired"),
      SESSION_WARNING_DURATION
    );
  };

  const resetInactivityTimer = () => {
    if (!token) return;

    setSessionWarningVisible(false);
    setSessionCountdown(SESSION_WARNING_SECONDS);

    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    if (warningTimer.current) {
      clearTimeout(warningTimer.current);
    }

    if (countdownTimer.current) {
      clearInterval(countdownTimer.current);
    }

    warningTimer.current = setTimeout(
      startSessionWarning,
      INACTIVITY_LIMIT - SESSION_WARNING_DURATION
    );
  };

  const staySignedIn = () => {
    if (!token) return;

    isLoggingOutRef.current = false;
    resetInactivityTimer();
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

  useEffect(() => {
    const handleForcedLogout = () => {
      logout("expired");
    };

    window.addEventListener(
      AUTH_LOGOUT_EVENT,
      handleForcedLogout
    );

    return () => {
      window.removeEventListener(
        AUTH_LOGOUT_EVENT,
        handleForcedLogout
      );
    };
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
      if (warningTimer.current) {
        clearTimeout(warningTimer.current);
      }
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current);
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

  // =========================
  // REFRESH USER FROM API
  // =========================

  const refreshUser = async () => {

    if (!token) return;

    try {

      const freshUser = await apiFetch<User>("/api/me", {
        token,
      });

      setUser(freshUser);

      localStorage.setItem(
        "finops_user",
        JSON.stringify(freshUser)
      );

    } catch (err) {

      console.warn("[USER_REFRESH_FAILED]", err);

    }

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

        isOwner,
        isFinopsAdmin,
        isViewer,
        isClientUser,

        isFoundation,
        isProfessional,
        isEnterprise,
        
        isAuthReady,
        sessionWarningVisible,
        sessionCountdown,
        login,
        logout,
        staySignedIn,
        updateUser,
        refreshUser

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
