// User-related types

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

// Stock-related types

export interface Stock {
  content: any[];
  symbol: string;
  currency: string;
  description: string;
  displaySymbol: string;
  exchange: string;
  timestamp: number;
}

// News-related types

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

// Exchange Rate - **THIS replaces CurrencyExchangeRate**

export interface ExchangeRate {
  id: string;
  base: string;
  target: string;
  rate: number;
  finalRate: number;
  customerType: string;
  lastUpdated: number;
}

// Currency symbols response

export interface CurrencySymbolsResponse {
  [key: string]: string; // e.g., "EUR": "Euro"
}

// Wishlist types

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

// Roles & permissions

export interface RoleAssignmentRequest {
  userId: string;
  roleNames: string[];
}

// LIBOR rates

export interface LiborRate {
  id: string;
  rate: number;
  type: string;
  effectiveDate: string;
  description?: string;
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
  normalRate: ExchangeRate;
  specialRate: ExchangeRate;
  liborRates: LiborRates;
  currentUserRate: ExchangeRate;
}

// Generic API response wrappers

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
