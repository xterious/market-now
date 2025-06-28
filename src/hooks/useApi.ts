import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { stocksAPI, newsAPI, currencyAPI, wishlistAPI, userAPI, adminAPI } from '@/config/apiService';
import { useAuth } from '@/contexts/AuthContext';

// Stock API hooks
export const useStockQuote = (symbol: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['stock', 'quote', symbol],
    queryFn: () => stocksAPI.getStockQuote(symbol),
    enabled: enabled && !!symbol,
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
};

export const useStockSymbols = (exchange: string, page: number = 0, size: number = 100) => {
  return useQuery({
    queryKey: ['stocks', 'symbols', exchange, page, size],
    queryFn: () => stocksAPI.getStockSymbols(exchange, page, size),
    enabled: !!exchange,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// News API hooks
export const useTopHeadlines = () => {
  return useQuery({
    queryKey: ['news', 'headlines'],
    queryFn: () => newsAPI.getTopHeadlines(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useNewsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['news', 'category', category],
    queryFn: () => newsAPI.getNewsByCategory(category),
    enabled: !!category,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useNewsCategories = () => {
  return useQuery({
    queryKey: ['news', 'categories'],
    queryFn: () => newsAPI.getAllCategories(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Currency API hooks
export const useExchangeRate = (base: string, target: string, customerType: string = 'normal') => {
  return useQuery({
    queryKey: ['currency', 'exchange', base, target, customerType],
    queryFn: () => currencyAPI.getExchangeRate(base, target, customerType),
    enabled: !!base && !!target,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCurrencyConversion = (base: string, target: string, amount: number, customerType: string = 'normal') => {
  return useQuery({
    queryKey: ['currency', 'convert', base, target, amount, customerType],
    queryFn: () => currencyAPI.convertCurrency(base, target, amount, customerType),
    enabled: !!base && !!target && amount > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Wishlist API hooks
export const useStockWishlist = (username: string) => {
  return useQuery({
    queryKey: ['wishlist', 'stock', username],
    queryFn: () => wishlistAPI.getStockWishlist(username),
    enabled: !!username,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useNewsWishlist = (username: string) => {
  return useQuery({
    queryKey: ['wishlist', 'news', username],
    queryFn: () => wishlistAPI.getNewsWishlist(username),
    enabled: !!username,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useCurrencyWishlist = (username: string) => {
  return useQuery({
    queryKey: ['wishlist', 'currency', username],
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
      wishlistAPI.addToStockWishlist(user?.username || '', stockSymbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', 'stock', user?.username] });
    },
  });
};

export const useRemoveFromStockWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ stockSymbol }: { stockSymbol: string }) =>
      wishlistAPI.removeFromStockWishlist(user?.username || '', stockSymbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', 'stock', user?.username] });
    },
  });
};

export const useAddToNewsWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ newsItem }: { newsItem: string }) =>
      wishlistAPI.addToNewsWishlist(user?.username || '', newsItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', 'news', user?.username] });
    },
  });
};

export const useRemoveFromNewsWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ newsItem }: { newsItem: string }) =>
      wishlistAPI.removeFromNewsWishlist(user?.username || '', newsItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', 'news', user?.username] });
    },
  });
};

export const useAddToCurrencyWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ currencyCode }: { currencyCode: string }) =>
      wishlistAPI.addToCurrencyWishlist(user?.username || '', currencyCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', 'currency', user?.username] });
    },
  });
};

export const useRemoveFromCurrencyWishlist = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ currencyCode }: { currencyCode: string }) =>
      wishlistAPI.removeFromCurrencyWishlist(user?.username || '', currencyCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', 'currency', user?.username] });
    },
  });
};

// User API hooks
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: () => userAPI.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAllUsers = () => {
  return useQuery({
    queryKey: ['users', 'all'],
    queryFn: () => userAPI.getAllUsers(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Admin API hooks
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: {
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      password: string;
    }) => userAPI.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'all'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: {
      id: string;
      userData: {
        username: string;
        email: string;
        firstName: string;
        lastName: string;
      };
    }) => userAPI.updateUser(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'all'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userAPI.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'all'] });
    },
  });
};

export const useLiborSpreadNormal = () => {
  return useQuery({
    queryKey: ['admin', 'libor', 'normal'],
    queryFn: () => adminAPI.getLiborSpreadNormal(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLiborSpreadSpecial = () => {
  return useQuery({
    queryKey: ['admin', 'libor', 'special'],
    queryFn: () => adminAPI.getLiborSpreadSpecial(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSetLiborSpreadNormal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rate: number) => adminAPI.setLiborSpreadNormal(rate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'libor', 'normal'] });
    },
  });
};

export const useSetLiborSpreadSpecial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rate: number) => adminAPI.setLiborSpreadSpecial(rate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'libor', 'special'] });
    },
  });
}; 