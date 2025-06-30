import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI } from '@/config/apiService';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '@/config/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (userData: RegisterRequest) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token and user data on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          
          // Verify token is still valid by fetching current user
          await refreshUser();
        } catch (error) {
          console.error('Error initializing auth:', error);
          handleLogout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Listen for logout events from API interceptor
  useEffect(() => {
    const handleLogoutEvent = () => {
      handleLogout();
    };

    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => window.removeEventListener('auth:logout', handleLogoutEvent);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    // Dispatch custom logout event for other contexts
    window.dispatchEvent(new CustomEvent('logout'));
    window.location.href = '/login';
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    console.log('Starting login process for username:', username);
    
    try {
      const credentials: LoginRequest = { username, password };
      console.log('Sending login request to backend...');
      const authResponse: AuthResponse = await authAPI.login(credentials);
      console.log('Login successful, received auth response:', authResponse);
      
      // Store token
      localStorage.setItem('accessToken', authResponse.accessToken);
      console.log('Token stored in localStorage');
      
      // Fetch user details
      console.log('Fetching user details...');
      const userData = await userAPI.getCurrentUser();
      console.log('User details received:', userData);
      
      const fullUser: User = {
        id: userData.username, // Using username as ID for now
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName || '', // Handle null values
        lastName: userData.lastName || '', // Handle null values
        roles: authResponse.roles.map(role => ({
          id: role.authority,
          name: role.authority,
          description: role.authority
        }))
      };
      
      setUser(fullUser);
      localStorage.setItem('user', JSON.stringify(fullUser));
      console.log('User state updated and stored:', fullUser);
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide more specific error messages
      if (error.response?.status === 401) {
        console.error('Invalid credentials');
      } else if (error.response?.status === 400) {
        console.error('Bad request:', error.response.data);
      } else if (error.response?.status >= 500) {
        console.error('Server error:', error.response.status);
      } else if (error.code === 'NETWORK_ERROR') {
        console.error('Network error - check if backend is running');
      }
      
      return false;
    } finally {
      setIsLoading(false);
      console.log('Login process completed');
    }
  };

  const signup = async (userData: RegisterRequest): Promise<boolean> => {
    setIsLoading(true);
    try {
      const newUser = await authAPI.register(userData);
      
      // After successful registration, log the user in
      return await login(userData.username, userData.password);
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // TODO: Implement Google OAuth
      // For now, return false
      console.log('Google OAuth not implemented yet');
      return false;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    handleLogout();
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await userAPI.getCurrentUser();
      const updatedUser: User = {
        ...user!,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName || '', // Handle null values
        lastName: userData.lastName || '', // Handle null values
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error refreshing user:', error);
      handleLogout();
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      signup,
      loginWithGoogle,
      logout,
      updateUser,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 