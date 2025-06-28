import api from './api';
import {
  User,
  UserDTO,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  Stock,
  News,
  CurrencyExchangeRate,
  StockWishlist,
  NewsWishlist,
  CurrencyWishlist,
  PaginatedResponse
} from './types';

// Authentication API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    console.log('authAPI.login called with credentials:', credentials);
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    console.log('authAPI.login response:', response.data);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/api/auth/register', userData);
    return response.data;
  },
};

// User API
export const userAPI = {
  getCurrentUser: async (): Promise<UserDTO> => {
    const response = await api.get<UserDTO>('/api/user/me');
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/api/user');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/api/user/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: UserDTO): Promise<User> => {
    const response = await api.put<User>(`/api/user/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/user/${id}`);
  },

  createUser: async (userData: UserDTO): Promise<User> => {
    const response = await api.post<User>('/api/user', userData);
    return response.data;
  },
};

// Stocks API
export const stocksAPI = {
  getStockSymbols: async (
    exchange: string,
    page: number = 0,
    size: number = 100
  ): Promise<PaginatedResponse<Stock>> => {
    const response = await api.get<PaginatedResponse<Stock>>('/api/stocks/symbols', {
      params: { exchange, page, size }
    });
    return response.data;
  },

  getStockQuote: async (symbol: string): Promise<Stock> => {
    const response = await api.get<Stock>('/api/stocks/quote', {
      params: { symbol }
    });
    return response.data;
  },
};

// News API
export const newsAPI = {
  getTopHeadlines: async (): Promise<News[]> => {
    const response = await api.get<News[]>('/api/news/headlines');
    return response.data;
  },

  getNewsByCategory: async (category: string): Promise<News[]> => {
    const response = await api.get<News[]>('/api/news/category', {
      params: { category }
    });
    return response.data;
  },

  getAllCategories: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/api/news/categories');
    return response.data;
  },
};

// Currency API
export const currencyAPI = {
  getExchangeRate: async (
    base: string,
    target: string,
    customerType: string = 'normal'
  ): Promise<CurrencyExchangeRate> => {
    const response = await api.get<CurrencyExchangeRate>('/api/currency/exchange', {
      params: { base, target, customerType }
    });
    return response.data;
  },

  convertCurrency: async (
    base: string,
    target: string,
    amount: number,
    customerType: string = 'normal'
  ): Promise<number> => {
    const response = await api.get<number>('/api/currency/convert', {
      params: { base, target, amount, customerType }
    });
    return response.data;
  },
};

// Wishlist API
export const wishlistAPI = {
  // Stock wishlist
  getStockWishlist: async (username: string): Promise<StockWishlist> => {
    const response = await api.get<StockWishlist>(`/api/wishlist/stock/${username}`);
    return response.data;
  },

  addToStockWishlist: async (username: string, stockSymbol: string): Promise<StockWishlist> => {
    const response = await api.post<StockWishlist>(`/api/wishlist/stock/${username}/${stockSymbol}`);
    return response.data;
  },

  removeFromStockWishlist: async (username: string, stockSymbol: string): Promise<StockWishlist> => {
    const response = await api.delete<StockWishlist>(`/api/wishlist/stock/${username}/${stockSymbol}`);
    return response.data;
  },

  // News wishlist
  getNewsWishlist: async (username: string): Promise<NewsWishlist> => {
    const response = await api.get<NewsWishlist>(`/api/wishlist/news/${username}`);
    return response.data;
  },

  addToNewsWishlist: async (username: string, newsItem: string): Promise<NewsWishlist> => {
    const response = await api.post<NewsWishlist>(`/api/wishlist/news/${username}/${newsItem}`);
    return response.data;
  },

  removeFromNewsWishlist: async (username: string, newsItem: string): Promise<NewsWishlist> => {
    const response = await api.delete<NewsWishlist>(`/api/wishlist/news/${username}/${newsItem}`);
    return response.data;
  },

  // Currency wishlist
  getCurrencyWishlist: async (username: string): Promise<CurrencyWishlist> => {
    const response = await api.get<CurrencyWishlist>(`/api/wishlist/currency/${username}`);
    return response.data;
  },

  addToCurrencyWishlist: async (username: string, currencyCode: string): Promise<CurrencyWishlist> => {
    const response = await api.post<CurrencyWishlist>(`/api/wishlist/currency/${username}/${currencyCode}`);
    return response.data;
  },

  removeFromCurrencyWishlist: async (username: string, currencyCode: string): Promise<CurrencyWishlist> => {
    const response = await api.delete<CurrencyWishlist>(`/api/wishlist/currency/${username}/${currencyCode}`);
    return response.data;
  },
};

// AI API
export const aiAPI = {
  summarizeNews: async (text: string): Promise<string> => {
    const response = await api.post<string>('/api/ai/summarize', text);
    return response.data;
  },

  askQuestion: async (question: string): Promise<string> => {
    const response = await api.post<string>('/api/ai/ask', question);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/api/admin/users');
    return response.data;
  },

  createUser: async (userData: User): Promise<User> => {
    const response = await api.post<User>('/api/admin/users', userData);
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/api/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: User): Promise<User> => {
    const response = await api.put<User>(`/api/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/users/${id}`);
  },

  getLiborSpreadSpecial: async (): Promise<number> => {
    const response = await api.get<number>('/api/admin/libor/special');
    return response.data;
  },

  setLiborSpreadSpecial: async (spread: number): Promise<void> => {
    await api.put('/api/admin/libor/special', spread);
  },

  getLiborSpreadNormal: async (): Promise<number> => {
    const response = await api.get<number>('/api/admin/libor/normal');
    return response.data;
  },

  setLiborSpreadNormal: async (spread: number): Promise<void> => {
    await api.put('/api/admin/libor/normal', spread);
  },
}; 