# Currency Exchange with Role-Based LIBOR Rates - Frontend Implementation

## Overview

This document describes the complete implementation of the currency exchange functionality with role-based LIBOR rates in the MarketNow React frontend application.

## Key Features Implemented

### ✅ Role-Based Rate System
- **Normal Users**: Get base rate + normal LIBOR spread (2% default)
- **Premium Users**: Get base rate + special LIBOR spread (1.4% default)
- Automatic role detection from user context
- Real-time rate calculation based on user type

### ✅ API Integration
- **GET /api/currency/symbols** - Fetch available currencies
- **GET /api/currency/exchange/role-based** - Get role-based exchange rates
- **GET /api/currency/convert/role-based** - Convert currency with role-based rates
- **GET /api/currency/libor-rates** - Get current LIBOR rates
- **GET /api/currency/rates-info** - Get complete rate comparison

### ✅ Global State Management
- Currency symbols persistence until logout
- Selected currency persistence across sessions
- Automatic data clearing on logout
- Real-time state synchronization

### ✅ Fixed EUR Left Side
- EUR is locked as the base currency
- Cannot be changed by user
- Consistent with business requirements

### ✅ Dynamic Right Side Dropdown
- Populated from `/api/currency/symbols` endpoint
- Shows currency code and full name
- Persists user selection globally

## Implementation Details

### 1. Type Definitions (`src/config/types.ts`)

```typescript
export interface RoleBasedExchangeRate {
  id: string;
  base: string;
  target: string;
  baseRate: number;
  finalRate: number;
  customerType: string;
}

export interface LiborRates {
  id: string;
  normalRate: number;
  specialRate: number;
}

export interface CompleteRatesInfo {
  base: string;
  target: string;
  userCustomerType: string;
  normalRate: RoleBasedExchangeRate;
  specialRate: RoleBasedExchangeRate;
  liborRates: LiborRates;
  currentUserRate: RoleBasedExchangeRate;
}

export interface CurrencySymbolsResponse {
  [key: string]: string; // e.g., "EUR": "Euro"
}
```

### 2. API Service (`src/config/apiService.ts`)

```typescript
export const currencyAPI = {
  getCurrencySymbols: async (): Promise<CurrencySymbolsResponse> => {
    const response = await api.get<CurrencySymbolsResponse>('/api/currency/symbols');
    return response.data;
  },

  getRoleBasedExchangeRate: async (base: string, target: string): Promise<RoleBasedExchangeRate> => {
    const response = await api.get<RoleBasedExchangeRate>('/api/currency/exchange/role-based', {
      params: { base, target }
    });
    return response.data;
  },

  convertCurrencyRoleBased: async (base: string, target: string, amount: number): Promise<number> => {
    const response = await api.get<number>('/api/currency/convert/role-based', {
      params: { base, target, amount }
    });
    return response.data;
  },

  getLiborRates: async (): Promise<LiborRates> => {
    const response = await api.get<LiborRates>('/api/currency/libor-rates');
    return response.data;
  },

  getCompleteRatesInfo: async (base: string, target: string): Promise<CompleteRatesInfo> => {
    const response = await api.get<CompleteRatesInfo>('/api/currency/rates-info', {
      params: { base, target }
    });
    return response.data;
  },
};
```

### 3. React Query Hooks (`src/hooks/useApi.ts`)

```typescript
export const useCurrencySymbols = () => {
  return useQuery({
    queryKey: ['currency', 'symbols'],
    queryFn: () => currencyAPI.getCurrencySymbols(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useRoleBasedExchangeRate = (base: string, target: string) => {
  return useQuery({
    queryKey: ['currency', 'role-based-exchange', base, target],
    queryFn: () => currencyAPI.getRoleBasedExchangeRate(base, target),
    enabled: !!base && !!target,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLiborRates = () => {
  return useQuery({
    queryKey: ['currency', 'libor-rates'],
    queryFn: () => currencyAPI.getLiborRates(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCompleteRatesInfo = (base: string, target: string) => {
  return useQuery({
    queryKey: ['currency', 'complete-rates-info', base, target],
    queryFn: () => currencyAPI.getCompleteRatesInfo(base, target),
    enabled: !!base && !!target,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

### 4. Global State Management (`src/contexts/CurrencyContext.tsx`)

```typescript
interface CurrencyContextType {
  symbols: CurrencySymbolsResponse;
  selectedToCurrency: string;
  setSelectedToCurrency: (currency: string) => void;
  isLoading: boolean;
  error: string | null;
  refreshSymbols: () => void;
}

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedToCurrency, setSelectedToCurrency] = useState<string>('USD');
  const [localSymbols, setLocalSymbols] = useState<CurrencySymbolsResponse>({});

  // Persistence logic
  useEffect(() => {
    const savedSelectedCurrency = localStorage.getItem('selectedToCurrency');
    if (savedSelectedCurrency) {
      setSelectedToCurrency(savedSelectedCurrency);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedToCurrency', selectedToCurrency);
  }, [selectedToCurrency]);

  // Logout cleanup
  useEffect(() => {
    const handleLogout = () => {
      setSelectedToCurrency('USD');
      localStorage.removeItem('selectedToCurrency');
    };

    window.addEventListener('logout', handleLogout);
    return () => window.removeEventListener('logout', handleLogout);
  }, []);

  // ... rest of implementation
};
```

### 5. Currency Page (`src/pages/Currency.tsx`)

Key features implemented:

- **Fixed EUR on left side** - Cannot be changed
- **Dynamic currency dropdown** - Populated from API
- **Role-based rate display** - Shows different rates for premium vs standard users
- **Local calculation** - Converts any amount using fetched rate
- **Real-time updates** - Rate updates when currency changes
- **User type indication** - Shows premium/standard status
- **LIBOR spread display** - Shows current spread rates
- **Rate comparison** - Shows difference between normal and special rates

## Usage Flow

1. **Page Load**: 
   - Fetch currency symbols from `/api/currency/symbols`
   - Load user's selected currency from localStorage
   - Fetch LIBOR rates from `/api/currency/libor-rates`

2. **Currency Selection**:
   - User selects target currency from dropdown
   - Automatically fetch role-based rate from `/api/currency/exchange/role-based`
   - Update global state with selected currency

3. **Amount Input**:
   - User enters amount in EUR (fixed)
   - Calculate conversion locally: `amount * finalRate`
   - Display result in real-time

4. **Rate Information**:
   - Display base rate and final rate
   - Show LIBOR spread based on user type
   - Show rate difference between normal and premium users

5. **Persistence**:
   - Selected currency saved to localStorage
   - Persists across browser sessions
   - Cleared only on logout

## Testing

### API Test Component (`src/components/CurrencyApiTest.tsx`)

A comprehensive test component that verifies:
- Currency symbols API
- Role-based exchange rate API
- LIBOR rates API
- Complete rates info API
- User role detection
- Rate calculations

### Test Scenarios

1. **Standard User**:
   - Should see normal LIBOR spread (2%)
   - Should see standard rates
   - Should see "Standard User" indicator

2. **Premium User**:
   - Should see special LIBOR spread (1.4%)
   - Should see better rates than standard users
   - Should see "Premium User" indicator
   - Should see rate difference in comparison

3. **Currency Switching**:
   - Should fetch new rates when currency changes
   - Should maintain selected currency across page reloads
   - Should clear data on logout

## Error Handling

- **API Errors**: Graceful error messages for failed API calls
- **Network Issues**: Loading states and retry mechanisms
- **Invalid Data**: Type conversion and validation
- **Authentication**: Automatic logout on auth failures

## Performance Optimizations

- **Caching**: React Query caching for API responses
- **Stale Time**: Appropriate cache invalidation times
- **Lazy Loading**: API calls only when needed
- **Local Storage**: Efficient persistence strategy

## Security Considerations

- **Authentication**: All role-based endpoints require JWT token
- **Authorization**: User roles determine rate access
- **Data Validation**: Type checking and sanitization
- **Logout Cleanup**: Proper data clearing on logout

## Future Enhancements

1. **Rate History**: Historical rate tracking
2. **Rate Alerts**: Notifications for rate changes
3. **Bulk Conversion**: Convert multiple currencies at once
4. **Rate Charts**: Visual rate trend display
5. **Currency News**: Integration with currency news feed

## Conclusion

The implementation provides a complete, production-ready currency exchange system with:

- ✅ Role-based LIBOR rate calculation
- ✅ Real-time currency conversion
- ✅ Persistent user preferences
- ✅ Comprehensive error handling
- ✅ Performance optimizations
- ✅ Security best practices
- ✅ Extensible architecture

The system is ready for production use and can be easily extended with additional features as needed. 