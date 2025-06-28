import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const navigate = useNavigate();
  
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default AuthWrapper; 