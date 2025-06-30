import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  stocksAPI,
  newsAPI,
  currencyAPI,
  wishlistAPI,
  userAPI,
  adminAPI,
  aiAPI,
} from "@/config/apiService";
import { useAuth } from "@/contexts/AuthContext";
import { CurrencyExchangeRate, CurrencySymbolsResponse } from "@/config/types";

// Stock API hooks
export const useStockSymbols = (
  exchange: string,
  page: number,
  query: string,
  size: number
) => {
  return useQuery({
    queryKey: ["stocks", "symbols", exchange, page, query, size],
    queryFn: () => stocksAPI.getStockSymbols(exchange, page, query, size),
    enabled: !!exchange,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// News API hooks
export const useTopHeadlines = () => {
  return useQuery({
    queryKey: ["news", "headlines"],
    queryFn: () => newsAPI.getTopHeadlines(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useNewsByCategory = (category: string) => {
  return useQuery({
    queryKey: ["news", "category", category],
    queryFn: () => newsAPI.getNewsByCategory(category),
    enabled: !!category,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useNewsCategories = () => {
  return useQuery({
    queryKey: ["news", "categories"],
    queryFn: () => newsAPI.getAllCategories(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Currency API hooks
// Fetch currency symbols
export const useCurrencySymbols = () => {
  return useQuery<CurrencySymbolsResponse, Error>({
    queryKey: ["currency", "symbols"],
    queryFn: () => currencyAPI.getCurrencySymbols(),
    staleTime: Infinity, // Persist until logout
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Fetch exchange rate for a currency pair
export const useExchangeRate = (
  base: string,
  target: string,
  customerType: string = "normal"
) => {
  return useQuery<CurrencyExchangeRate, Error>({
    queryKey: ["currency", "exchange", base, target, customerType],
    queryFn: () => currencyAPI.getExchangeRate(base, target, customerType),
    enabled: !!base && !!target,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};

// Wishlist API hooks
export const useStockWishlist = (username: string) => {
  return useQuery({
    queryKey: ["wishlist", "stock", username],
    queryFn: () => wishlistAPI.getStockWishlist(username),
    enabled: !!username,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useNewsWishlist = (username: string) => {
  return useQuery({
    queryKey: ["wishlist", "news", username],
    queryFn: () => wishlistAPI.getNewsWishlist(username),
    enabled: !!username,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useCurrencyWishlist = (username: string) => {
  return useQuery({
    queryKey: ["wishlist", "currency", username],
    queryFn: () => wishlistAPI.getCurrencyWishlist(username),
    enabled: !!username,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Wishlist mutations
export const useAddToStockWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ stockSymbol }: { stockSymbol: string }) =>
      wishlistAPI.addToStockWishlist(user?.username || "", stockSymbol),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist", "stock", user?.username],
      });
    },
  });
};

export const useRemoveFromStockWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ stockSymbol }: { stockSymbol: string }) =>
      wishlistAPI.removeFromStockWishlist(user?.username || "", stockSymbol),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist", "stock", user?.username],
      });
    },
  });
};

export const useAddToNewsWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ newsItem }: { newsItem: string }) =>
      wishlistAPI.addToNewsWishlist(user?.username || "", newsItem),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist", "news", user?.username],
      });
    },
  });
};

export const useRemoveFromNewsWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ newsItem }: { newsItem: string }) =>
      wishlistAPI.removeFromNewsWishlist(user?.username || "", newsItem),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist", "news", user?.username],
      });
    },
  });
};

export const useAddToCurrencyWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ currencyCode }: { currencyCode: string }) =>
      wishlistAPI.addToCurrencyWishlist(user?.username || "", currencyCode),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist", "currency", user?.username],
      });
    },
  });
};

export const useRemoveFromCurrencyWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ currencyCode }: { currencyCode: string }) =>
      wishlistAPI.removeFromCurrencyWishlist(
        user?.username || "",
        currencyCode
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist", "currency", user?.username],
      });
    },
  });
};

// User API hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user", "current"],
    queryFn: () => userAPI.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Admin API hooks
export const useAllUsers = () => {
  return useQuery({
    queryKey: ["users", "all"],
    queryFn: () => adminAPI.getAllUsers(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useNormalUsers = () => {
  return useQuery({
    queryKey: ["users", "normal"],
    queryFn: () => adminAPI.getNormalUsers(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useSpecialUsers = () => {
  return useQuery({
    queryKey: ["users", "special"],
    queryFn: () => adminAPI.getSpecialUsers(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUsersByRole = (roleName: string) => {
  return useQuery({
    queryKey: ["users", "role", roleName],
    queryFn: () => adminAPI.getUsersByRole(roleName),
    enabled: !!roleName,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAllRoles = () => {
  return useQuery({
    queryKey: ["roles", "all"],
    queryFn: () => adminAPI.getAllRoles(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: {
      username: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => adminAPI.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
      queryClient.invalidateQueries({ queryKey: ["users", "normal"] });
      queryClient.invalidateQueries({ queryKey: ["users", "special"] });
    },
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (role: { name: string; description: string }) =>
      adminAPI.createRole(role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", "all"] });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: string) => adminAPI.deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles", "all"] });
    },
  });
};

export const useAssignRoleToUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleName }: { userId: string; roleName: string }) =>
      adminAPI.assignRoleToUser(userId, roleName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
      queryClient.invalidateQueries({ queryKey: ["users", "normal"] });
      queryClient.invalidateQueries({ queryKey: ["users", "special"] });
    },
  });
};

export const useSetUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminAPI.setUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
      queryClient.invalidateQueries({ queryKey: ["users", "normal"] });
      queryClient.invalidateQueries({ queryKey: ["users", "special"] });
    },
  });
};

export const useAssignRolesBulk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleAssignment: { userId: string; roleNames: string[] }) =>
      adminAPI.assignRolesBulk(roleAssignment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
      queryClient.invalidateQueries({ queryKey: ["users", "normal"] });
      queryClient.invalidateQueries({ queryKey: ["users", "special"] });
    },
  });
};

export const useUpdateLiborRates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (liborData: any) => adminAPI.updateLiborRates(liborData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libor", "rates"] });
    },
  });
};

export const useDeleteLiborRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminAPI.deleteLiborRate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libor", "rates"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: any }) =>
      adminAPI.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
      queryClient.invalidateQueries({ queryKey: ["users", "normal"] });
      queryClient.invalidateQueries({ queryKey: ["users", "special"] });
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminAPI.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
      queryClient.invalidateQueries({ queryKey: ["users", "normal"] });
      queryClient.invalidateQueries({ queryKey: ["users", "special"] });
    },
  });
};

// LIBOR spread hooks
export const useLiborSpreadNormal = () => {
  return useQuery({
    queryKey: ["libor", "normal"],
    queryFn: () => adminAPI.getLiborSpreadNormal(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLiborSpreadSpecial = () => {
  return useQuery({
    queryKey: ["libor", "special"],
    queryFn: () => adminAPI.getLiborSpreadSpecial(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSetLiborSpreadNormal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (spread: number) => adminAPI.setLiborSpreadNormal(spread),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libor", "normal"] });
    },
  });
};

export const useSetLiborSpreadSpecial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (spread: number) => adminAPI.setLiborSpreadSpecial(spread),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["libor", "special"] });
    },
  });
};

// AI API hooks
export const useSummarizeNews = () => {
  return useMutation({
    mutationFn: (text: string) => aiAPI.summarizeNews(text),
  });
};

export const useAskQuestion = () => {
  return useMutation({
    mutationFn: (question: string) => aiAPI.askQuestion(question),
  });
};
