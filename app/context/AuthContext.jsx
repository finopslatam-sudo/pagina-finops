'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay token al cargar
    const token = localStorage.getItem('finops_token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('https://api.finopslatam.com/api/auth/verify', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('finops_token');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('finops_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('https://api.finopslatam.com/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Login exitoso - usar la estructura real de tu API
        localStorage.setItem('finops_token', data.access_token);
        setUser(data.client);  // Cambié data.user por data.client (como responde tu API)
        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.error || 'Error en el login' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Error de conexión con el servidor' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('finops_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};