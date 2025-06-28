import React, { createContext, useContext, useState, useEffect } from 'react';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface NewsData {
  id: number;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
}

interface CurrencyData {
  pair: string;
  rate: number;
  change: number;
  changePercent: number;
}

type WishlistDataType = StockData | NewsData | CurrencyData;

interface WishlistItem {
  id: string;
  type: 'stock' | 'news' | 'currency';
  data: WishlistDataType;
  addedAt: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (type: 'stock' | 'news' | 'currency', data: WishlistDataType) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (type: 'stock' | 'news' | 'currency', data: WishlistDataType) => {
    const id = type === 'stock' ? (data as StockData).symbol : type === 'news' ? (data as NewsData).id.toString() : (data as CurrencyData).pair;
    const newItem: WishlistItem = {
      id,
      type,
      data,
      addedAt: new Date().toISOString(),
    };
    
    setWishlistItems(prev => {
      if (prev.some(item => item.id === id)) {
        return prev;
      }
      return [...prev, newItem];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some(item => item.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
