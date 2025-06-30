import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/config/apiService';
import { useNavigate } from 'react-router-dom';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login({ username, password });
      console.log(response);
      const hasAdminRole = response.roles.some(role => role.authority === 'ROLE_ADMIN');
      if (hasAdminRole) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('adminUser', JSON.stringify({
          username: response.username,
          email: response.email,
          roles: response.roles
        }));
        return true;
      } else {
        throw new Error('You do not have admin privileges.');
      }
    } catch (error: any) {
      console.error('Admin login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('accessToken');
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid username or password, or you do not have admin privileges.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}; 