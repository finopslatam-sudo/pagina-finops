// Utilidades para autenticación
export const getToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('finops_token');
    }
    return null;
  };
  
  export const setToken = (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('finops_token', token);
    }
  };
  
  export const removeToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('finops_token');
    }
  };
  
  export const isAuthenticated = () => {
    return !!getToken();
  };
  
  // Headers para requests autenticados
  export const getAuthHeaders = () => {
    const token = getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };
  
  // Verificar si el token es válido
  export const verifyToken = async () => {
    const token = getToken();
    if (!token) return false;
  
    try {
      const response = await fetch('https://api.finopslatam.com/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.ok;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  };