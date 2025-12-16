// app/lib/auth.js

// ===============================
// Token management (localStorage)
// ===============================

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("finops_token");
  }
  return null;
};

export const setToken = (token) => {
  if (typeof window !== "undefined" && token) {
    localStorage.setItem("finops_token", token);
  }
};

export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("finops_token");
  }
};

// ===============================
// Authentication status
// ===============================

export const isAuthenticated = () => {
  const token = getToken();
  return Boolean(token);
};

// ===============================
// API headers helper
// ===============================

export const getAuthHeaders = () => {
  const token = getToken();
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };
};

// ===============================
// Verify token with backend
// ===============================

export const verifyToken = async () => {
  if (typeof window === "undefined") return false;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      console.warn("Token verification failed", response.status);
      removeToken(); // limpiar token inválido
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
};
