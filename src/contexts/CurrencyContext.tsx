import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencySymbolsResponse } from '@/config/types';

interface CurrencyContextType {
  symbols: CurrencySymbolsResponse;
  selectedToCurrency: string;
  setSelectedToCurrency: (currency: string) => void;
  isLoading: boolean;
  error: string | null;
  refreshSymbols: () => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedToCurrency, setSelectedToCurrency] = useState<string>('USD');
  const [localSymbols, setLocalSymbols] = useState<CurrencySymbolsResponse>({});

  // Load selected currency from localStorage on mount
  useEffect(() => {
    const savedSelectedCurrency = localStorage.getItem('selectedToCurrency');
    if (savedSelectedCurrency) {
      setSelectedToCurrency(savedSelectedCurrency);
    }
  }, []);

  // Save selected currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedToCurrency', selectedToCurrency);
  }, [selectedToCurrency]);

  // Clear data on logout
  const clearCurrencyData = () => {
    setSelectedToCurrency('USD');
    localStorage.removeItem('selectedToCurrency');
  };

  // Expose clear function for logout
  useEffect(() => {
    // Listen for logout events
    const handleLogout = () => {
      clearCurrencyData();
    };

    window.addEventListener('logout', handleLogout);
    return () => {
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  const value: CurrencyContextType = {
    symbols: localSymbols,
    selectedToCurrency,
    setSelectedToCurrency,
    isLoading: false,
    error: null,
    refreshSymbols: () => {},
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}; 