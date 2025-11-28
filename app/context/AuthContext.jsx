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
      console.log('Verificando token...');
      const response = await fetch('https://api.finopslatam.com/api/auth/verify', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include' // ← IMPORTANTE para CORS
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('User data recibido:', userData);
        setUser(userData);
      } else {
        console.log('Token inválido, removiendo...');
        localStorage.removeItem('finops_token');
        setUser(null);
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('finops_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Iniciando login para:', email);
      
      const response = await fetch('https://api.finopslatam.com/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include', // ← IMPORTANTE para CORS
        body: JSON.stringify({ email, password })
      });

      console.log('Login response status:', response.status);
      
      // Verificar si la respuesta es JSON válida
      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Error parseando JSON:', parseError, 'Texto:', text);
        return { 
          success: false, 
          error: 'Error en la respuesta del servidor' 
        };
      }

      console.log('Datos completos de login:', data);

      if (response.ok) {
        // Verificar estructura esperada
        if (data.access_token && data.client) {
          localStorage.setItem('finops_token', data.access_token);
          setUser(data.client);
          console.log('Login exitoso, usuario:', data.client);
          return { success: true };
        } else {
          console.error('Estructura de datos incompleta:', data);
          return { 
            success: false, 
            error: 'Datos de usuario incompletos' 
          };
        }
      } else {
        const errorMsg = data.error || data.message || 'Error en el login';
        console.log('Error del servidor:', errorMsg);
        return { 
          success: false, 
          error: errorMsg 
        };
      }
    } catch (error) {
      console.error('Error completo en login:', error);
      return { 
        success: false, 
        error: 'Error de conexión con el servidor' 
      };
    }
  };

  const logout = () => {
    console.log('Cerrando sesión...');
    localStorage.removeItem('finops_token');
    setUser(null);
    // Opcional: llamar a endpoint de logout del backend
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