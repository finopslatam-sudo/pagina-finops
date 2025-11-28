'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay token al cargar - PERO MANEJAR ERRORES CORS
    const token = localStorage.getItem('finops_token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      console.log('🔐 Verificando token...');
      
      const response = await fetch('https://api.finopslatam.com/api/auth/verify', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📋 Verify response status:', response.status);
      
      // Si hay error CORS (status 0) o otro error, no bloquear la app
      if (response.status === 0) {
        console.warn('⚠️ Posible error CORS en verify, continuando...');
        setLoading(false);
        return;
      }
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ User data recibido:', userData);
        setUser(userData);
      } else {
        console.log('❌ Token inválido o error, removiendo...');
        localStorage.removeItem('finops_token');
        setUser(null);
      }
    } catch (error) {
      console.error('💥 Error verifying token:', error);
      // No remover el token en caso de error de red/CORS
      // Solo set loading false para que la app continúe
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Iniciando login para:', email);
      
      const response = await fetch('https://api.finopslatam.com/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      console.log('📋 Login response status:', response.status);
      console.log('📋 Login response ok:', response.ok);
      
      // Verificar si hay error CORS
      if (response.status === 0) {
        console.error('❌ Error CORS detectado');
        return { 
          success: false, 
          error: 'Error de CORS. Verifica la configuración del servidor.' 
        };
      }
      
      // Verificar si la respuesta es JSON válida
      const text = await response.text();
      console.log('📋 Response text:', text);
      
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('💥 Error parseando JSON:', parseError, 'Texto:', text);
        return { 
          success: false, 
          error: 'Error en la respuesta del servidor' 
        };
      }

      console.log('📊 Datos completos de login:', data);

      if (response.ok) {
        // Verificar estructura esperada
        if (data.access_token && data.client) {
          localStorage.setItem('finops_token', data.access_token);
          setUser(data.client);
          console.log('✅ Login exitoso, usuario:', data.client);
          return { success: true };
        } else {
          console.error('❌ Estructura de datos incompleta:', data);
          return { 
            success: false, 
            error: 'Datos de usuario incompletos' 
          };
        }
      } else {
        const errorMsg = data.error || data.message || 'Error en el login';
        console.log('❌ Error del servidor:', errorMsg);
        return { 
          success: false, 
          error: errorMsg 
        };
      }
    } catch (error) {
      console.error('💥 Error completo en login:', error);
      
      // Detectar específicamente errores CORS
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        return { 
          success: false, 
          error: 'Error de CORS: No se puede conectar con el servidor de autenticación' 
        };
      }
      
      return { 
        success: false, 
        error: 'Error de conexión con el servidor: ' + error.message 
      };
    }
  };

  const logout = () => {
    console.log('🚪 Cerrando sesión...');
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