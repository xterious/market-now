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
  id: string;
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
  symbol: string;
  currency: string;
  description: string;
  displaySymbol: string;
  figi: string;
  mic: string;
  type: string;
  exchange: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
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