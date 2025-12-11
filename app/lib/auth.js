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

export const getAuthHeaders = () => {
  const token = getToken();
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const verifyToken = async () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = getToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.ok;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};
