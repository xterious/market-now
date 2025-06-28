import React, { createContext, useContext, useState, useEffect } from 'react';

type CustomerType = 'Special' | 'Normal';

interface CustomerContextType {
  customerType: CustomerType;
  setCustomerType: (type: CustomerType) => void;
  isSpecialCustomer: boolean;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerType, setCustomerType] = useState<CustomerType>('Normal');

  useEffect(() => {
    // Check if customer type is saved in localStorage
    const savedCustomerType = localStorage.getItem('customerType') as CustomerType;
    if (savedCustomerType) {
      setCustomerType(savedCustomerType);
    }
  }, []);

  const handleSetCustomerType = (type: CustomerType) => {
    setCustomerType(type);
    localStorage.setItem('customerType', type);
  };

  const isSpecialCustomer = customerType === 'Special';

  return (
    <CustomerContext.Provider value={{ 
      customerType, 
      setCustomerType: handleSetCustomerType, 
      isSpecialCustomer 
    }}>
      {children}
    </CustomerContext.Provider>
  );
}; 