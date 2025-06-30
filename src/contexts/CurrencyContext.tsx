import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencySymbolsResponse } from '@/config/types';

interface CurrencyContextType {
  symbols: CurrencySymbolsResponse;
  selectedToCurrency: string;
  setSelectedToCurrency: (currency: string) => void;
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
  const [symbols, setSymbols] = useState<CurrencySymbolsResponse>({});

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
    setSymbols({});
    localStorage.removeItem('selectedToCurrency');
  };

  // Listen for logout events
  useEffect(() => {
    const handleLogout = () => {
      clearCurrencyData();
    };
    window.addEventListener('logout', handleLogout);
    return () => {
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  const value: CurrencyContextType = {
    symbols,
    selectedToCurrency,
    setSelectedToCurrency,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};