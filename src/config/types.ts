// API Types based on OpenAPI specification

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  provider?: string;
  providerId?: string;
}

export interface UserDTO {
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface Role {
  name: string;
  description: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  username: string;
  email: string;
  roles: GrantedAuthority[];
  token: string;
}

export interface GrantedAuthority {
  authority: string;
}

export interface Stock {
  content: any[];
  symbol: string;
  currency: string;
  description: string;
  displaySymbol: string;
  exchange: string;
  timestamp: number;
}

export interface News {
  category: string;
  datetime: number;
  headline: string;
  newsId: string;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export interface CurrencyExchangeRate {
  base: string;
  target: string;
  rate: number;
  finalRate: number;
  customerType: string;
}

export interface CurrencySymbol {
  code: string;
  name: string;
  symbol: string;
  flag?: string;
}

export interface StockWishlist {
  username: string;
  favoriteStocks: string[];
}

export interface NewsWishlist {
  username: string;
  favoriteNews: string[];
}

export interface CurrencyWishlist {
  username: string;
  favoriteCurrencies: string[];
}

export interface RoleAssignmentRequest {
  userId: string;
  roleNames: string[];
}

export interface LiborRate {
  id: string;
  rate: number;
  type: string;
  effectiveDate: string;
  description?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// New types for role-based LIBOR rates
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

// Update CurrencySymbol to match backend response format
export interface CurrencySymbolsResponse {
  [key: string]: string; // e.g., "EUR": "Euro"
} 