import api from "./api";
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
  Role,
  RoleAssignmentRequest,
  CurrencySymbolsResponse,
  RoleBasedExchangeRate,
  LiborRates,
  CompleteRatesInfo,
} from "./types";

// Authentication API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    console.log("authAPI.login called with credentials:", credentials);
    const response = await api.post<AuthResponse>(
      "/api/auth/login",
      credentials
    );
    console.log("authAPI.login response:", response.data);
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<User> => {
    const response = await api.post<User>("/api/auth/register", userData);
    return response.data;
  },

  registerAdmin: async (userData: RegisterRequest): Promise<User> => {
    const response = await api.post<User>("/api/auth/register/admin", userData);
    return response.data;
  },
};

// User API
export const userAPI = {
  getCurrentUser: async (): Promise<UserDTO> => {
    const response = await api.get<UserDTO>("/api/user/me");
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/api/user");
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
    const response = await api.post<User>("/api/user", userData);
    return response.data;
  },
};

// Stocks API
export const stocksAPI = {
  getStockSymbols: async (
    exchange: string = "USD",
    page: number = 0,
    query: string = "",
    size: number = 20
  ): Promise<Stock> => {
    const params: Record<string, string | number> = {
      exchange,
      page,
      size,
      ...(query ? { query } : {}),
    };

    const response = await api.get<Stock>("/api/stocks/symbols", {
      params,
    });

    return response.data;
  },
};

// News API
export const newsAPI = {
  getTopHeadlines: async (): Promise<News[]> => {
    const response = await api.get<News[]>("/api/news/headlines");
    return response.data;
  },

  getNewsByCategory: async (category: string): Promise<News[]> => {
    const response = await api.get<News[]>("/api/news/category", {
      params: { category },
    });
    return response.data;
  },

  getAllCategories: async (): Promise<string> => {
    const response = await api.get<string>("/api/news/categories");
    return response.data;
  },
};

// Currency API
export const currencyAPI = {
  getCurrencySymbols: async (): Promise<CurrencySymbolsResponse> => {
    const response = await api.get<CurrencySymbolsResponse>(
      "/api/currency/symbols"
    );
    return response.data;
  },

  getRoleBasedExchangeRate: async (
    base: string,
    target: string
  ): Promise<RoleBasedExchangeRate> => {
    const response = await api.get<RoleBasedExchangeRate>(
      "/api/currency/exchange/role-based",
      {
        params: { base, target },
      }
    );
    return response.data;
  },

  convertCurrencyRoleBased: async (
    base: string,
    target: string,
    amount: number
  ): Promise<number> => {
    const response = await api.get<number>("/api/currency/convert/role-based", {
      params: { base, target, amount },
    });
    return response.data;
  },

  getLiborRates: async (): Promise<LiborRates> => {
    const response = await api.get<LiborRates>("/api/currency/libor-rates");
    return response.data;
  },

  getCompleteRatesInfo: async (
    base: string,
    target: string
  ): Promise<CompleteRatesInfo> => {
    const response = await api.get<CompleteRatesInfo>(
      "/api/currency/rates-info",
      {
        params: { base, target },
      }
    );
    return response.data;
  },

  // Legacy methods for backward compatibility
  getExchangeRate: async (
    base: string,
    target: string,
    customerType: string = "normal"
  ): Promise<CurrencyExchangeRate> => {
    const response = await api.get<CurrencyExchangeRate>(
      "/api/currency/exchange",
      {
        params: { base, target, customerType },
      }
    );
    return response.data;
  },

  convertCurrency: async (
    base: string,
    target: string,
    amount: number,
    customerType: string = "normal"
  ): Promise<number> => {
    const response = await api.get<number>("/api/currency/convert", {
      params: { base, target, amount, customerType },
    });
    return response.data;
  },
};

// Wishlist API
export const wishlistAPI = {
  // Stock wishlist
  getStockWishlist: async (username: string): Promise<StockWishlist> => {
    const response = await api.get<StockWishlist>(
      `/api/wishlist/stock/${username}`
    );
    return response.data;
  },

  addToStockWishlist: async (
    username: string,
    stockSymbol: string
  ): Promise<StockWishlist> => {
    const response = await api.post<StockWishlist>(
      `/api/wishlist/stock/${username}/${stockSymbol}`
    );
    return response.data;
  },

  removeFromStockWishlist: async (
    username: string,
    stockSymbol: string
  ): Promise<StockWishlist> => {
    const response = await api.delete<StockWishlist>(
      `/api/wishlist/stock/${username}/${stockSymbol}`
    );
    return response.data;
  },

  // News wishlist
  getNewsWishlist: async (username: string): Promise<NewsWishlist> => {
    const response = await api.get<NewsWishlist>(
      `/api/wishlist/news/${username}`
    );
    return response.data;
  },

  addToNewsWishlist: async (
    username: string,
    newsItem: string
  ): Promise<NewsWishlist> => {
    const response = await api.post<NewsWishlist>(
      `/api/wishlist/news/${username}/${newsItem}`
    );
    return response.data;
  },

  removeFromNewsWishlist: async (
    username: string,
    newsItem: string
  ): Promise<NewsWishlist> => {
    const response = await api.delete<NewsWishlist>(
      `/api/wishlist/news/${username}/${newsItem}`
    );
    return response.data;
  },

  // Currency wishlist
  getCurrencyWishlist: async (username: string): Promise<CurrencyWishlist> => {
    const response = await api.get<CurrencyWishlist>(
      `/api/wishlist/currency/${username}`
    );
    return response.data;
  },

  addToCurrencyWishlist: async (
    username: string,
    currencyCode: string
  ): Promise<CurrencyWishlist> => {
    const response = await api.post<CurrencyWishlist>(
      `/api/wishlist/currency/${username}/${currencyCode}`
    );
    return response.data;
  },

  removeFromCurrencyWishlist: async (
    username: string,
    currencyCode: string
  ): Promise<CurrencyWishlist> => {
    const response = await api.delete<CurrencyWishlist>(
      `/api/wishlist/currency/${username}/${currencyCode}`
    );
    return response.data;
  },
};

// AI API
export const aiAPI = {
  summarizeNews: async (text: string): Promise<string> => {
    const response = await api.post<string>("/api/ai/summarize", text);
    return response.data;
  },

  askQuestion: async (question: string): Promise<string> => {
    const response = await api.post<string>("/api/ai/ask", question);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  // User management
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/api/admin/users");
    return response.data;
  },

  createUser: async (userData: RegisterRequest): Promise<User> => {
    const response = await api.post<User>("/api/admin/users", userData);
    return response.data;
  },

  createAdminUser: async (userData: RegisterRequest): Promise<User> => {
    const response = await api.post<User>("/api/admin/users/admin", userData);
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/api/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: UserDTO): Promise<User> => {
    const response = await api.put<User>(`/api/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/users/${id}`);
  },

  // User filtering by role
  getNormalUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/api/admin/users/normal");
    return response.data;
  },

  getSpecialUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/api/admin/users/special");
    return response.data;
  },

  getUsersByRole: async (roleName: string): Promise<User[]> => {
    const response = await api.get<User[]>(
      `/api/admin/users/roles/${roleName}`
    );
    return response.data;
  },

  // Role management
  getAllRoles: async (): Promise<Role[]> => {
    const response = await api.get<Role[]>("/api/admin/roles");
    return response.data;
  },

  createRole: async (role: Role): Promise<Role> => {
    const response = await api.post<Role>("/api/admin/roles", role);
    return response.data;
  },

  deleteRole: async (roleId: string): Promise<void> => {
    await api.delete(`/api/admin/roles/${roleId}`);
  },

  // User role management
  assignRoleToUser: async (userId: string, roleName: string): Promise<User> => {
    const response = await api.post<User>(
      `/api/admin/users/${userId}/roles`,
      null,
      {
        params: { roleName },
      }
    );
    return response.data;
  },

  setUserRole: async (userId: string, role: string): Promise<User> => {
    const response = await api.put<User>(
      `/api/admin/users/${userId}/role`,
      null,
      {
        params: { role },
      }
    );
    return response.data;
  },

  setUserRoles: async (userId: string, roles: Role[]): Promise<User> => {
    const response = await api.put<User>(
      `/api/admin/users/${userId}/roles`,
      roles
    );
    return response.data;
  },

  assignRolesBulk: async (
    roleAssignment: RoleAssignmentRequest
  ): Promise<User> => {
    const response = await api.post<User>(
      "/api/admin/users/roles/bulk",
      roleAssignment
    );
    return response.data;
  },

  // LIBOR rate management
  getLiborRates: async (): Promise<any[]> => {
    const response = await api.get<any[]>("/api/admin/libor");
    return response.data;
  },

  updateLiborRates: async (liborData: any): Promise<void> => {
    await api.put("/api/admin/libor", liborData);
  },

  deleteLiborRate: async (id: string): Promise<void> => {
    await api.delete(`/api/admin/libor/${id}`);
  },

  // Individual LIBOR spread management (legacy endpoints)
  getLiborSpreadSpecial: async (): Promise<number> => {
    const response = await api.get<number>("/api/admin/libor/special");
    return response.data;
  },

  setLiborSpreadSpecial: async (spread: number): Promise<void> => {
    await api.put("/api/admin/libor/special", spread);
  },

  getLiborSpreadNormal: async (): Promise<number> => {
    const response = await api.get<number>("/api/admin/libor/normal");
    return response.data;
  },

  setLiborSpreadNormal: async (spread: number): Promise<void> => {
    await api.put("/api/admin/libor/normal", spread);
  },
};
