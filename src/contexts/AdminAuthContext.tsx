import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/config/apiService';

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

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Use the same auth API as regular users
      const response = await authAPI.login({ username, password });
      
      // Check if user has admin role
      const hasAdminRole = response.roles.some(role => 
        role.authority === 'ROLE_ADMIN' || role.authority === 'ADMIN'
      );
      
      if (hasAdminRole) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('accessToken', response.accessToken);
      return true;
      } else {
        console.error('User does not have admin privileges');
        return false;
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('accessToken');
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}; 