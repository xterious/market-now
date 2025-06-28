import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useStockQuote, 
  useTopHeadlines, 
  useExchangeRate,
  useStockWishlist,
  useAddToStockWishlist,
  useRemoveFromStockWishlist
} from '@/hooks/useApi';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField, 
  Grid,
  Alert,
  CircularProgress,
  Chip,
  IconButton
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

const ExampleWithHooks: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [stockSymbol, setStockSymbol] = useState('AAPL');
  const [showStockQuote, setShowStockQuote] = useState(false);

  // Using custom hooks with React Query
  const stockQuote = useStockQuote(stockSymbol, showStockQuote);
  const headlines = useTopHeadlines();
  const exchangeRate = useExchangeRate('USD', 'EUR', 'normal');
  const stockWishlist = useStockWishlist(user?.username || '');
  
  // Wishlist mutations
  const addToWishlist = useAddToStockWishlist();
  const removeFromWishlist = useRemoveFromStockWishlist();

  const handleAddToWishlist = (symbol: string) => {
    addToWishlist.mutate({ stockSymbol: symbol });
  };

  const handleRemoveFromWishlist = (symbol: string) => {
    removeFromWishlist.mutate({ stockSymbol: symbol });
  };

  const isInWishlist = (symbol: string) => {
    return stockWishlist.data?.favoriteStocks?.includes(symbol) || false;
  };

  if (!isAuthenticated) {
    return (
      <Box p={3}>
        <Alert severity="info">
          Please log in to see API examples with hooks
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        API Examples with React Query Hooks
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        This demonstrates the power of React Query with automatic caching, refetching, and optimistic updates.
      </Typography>

      <Grid container spacing={3}>
        {/* Stock Quote with Hooks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Quote with React Query
              </Typography>
              <Box display="flex" gap={1} mb={2}>
                <TextField
                  label="Stock Symbol"
                  value={stockSymbol}
                  onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                  size="small"
                />
                <Button 
                  variant="contained" 
                  onClick={() => setShowStockQuote(true)}
                  disabled={!stockSymbol.trim()}
                >
                  Fetch
                </Button>
              </Box>
              
              {stockQuote.isLoading && (
                <Box display="flex" justifyContent="center" p={2}>
                  <CircularProgress />
                </Box>
              )}
              
              {stockQuote.error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Failed to fetch stock quote
                </Alert>
              )}
              
              {stockQuote.data && (
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{stockQuote.data.symbol}</Typography>
                    <IconButton
                      onClick={() => isInWishlist(stockQuote.data.symbol) 
                        ? handleRemoveFromWishlist(stockQuote.data.symbol)
                        : handleAddToWishlist(stockQuote.data.symbol)
                      }
                      color="primary"
                      disabled={addToWishlist.isPending || removeFromWishlist.isPending}
                    >
                      {isInWishlist(stockQuote.data.symbol) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>
                  <Typography variant="h4" color="primary">
                    ${stockQuote.data.currentPrice?.toFixed(2)}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color={stockQuote.data.change >= 0 ? 'success.main' : 'error.main'}
                  >
                    {stockQuote.data.change >= 0 ? '+' : ''}{stockQuote.data.change?.toFixed(2)} 
                    ({stockQuote.data.percentChange?.toFixed(2)}%)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {new Date(stockQuote.data.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Currency Exchange with Hooks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Currency Exchange with React Query
              </Typography>
              
              {exchangeRate.isLoading && (
                <Box display="flex" justifyContent="center" p={2}>
                  <CircularProgress />
                </Box>
              )}
              
              {exchangeRate.error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Failed to fetch exchange rate
                </Alert>
              )}
              
              {exchangeRate.data && (
                <Box>
                  <Typography variant="h6">
                    {exchangeRate.data.base}/{exchangeRate.data.target}
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {exchangeRate.data.finalRate?.toFixed(4)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customer Type: {exchangeRate.data.customerType}
                  </Typography>
                  <Chip 
                    label={`Base Rate: ${exchangeRate.data.rate?.toFixed(4)}`}
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* News with Hooks */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  News Headlines with React Query
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => headlines.refetch()}
                  disabled={headlines.isRefetching}
                >
                  {headlines.isRefetching ? <CircularProgress size={20} /> : 'Refresh'}
                </Button>
              </Box>
              
              {headlines.isLoading && (
                <Box display="flex" justifyContent="center" p={2}>
                  <CircularProgress />
                </Box>
              )}
              
              {headlines.error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Failed to fetch news
                </Alert>
              )}
              
              {headlines.data && headlines.data.length > 0 && (
                <Box>
                  {headlines.data.slice(0, 3).map((item, index) => (
                    <Box key={index} mb={2} p={2} border={1} borderColor="divider" borderRadius={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.headline}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.summary}
                      </Typography>
                      <Box display="flex" gap={1} mt={1}>
                        <Chip label={item.source} size="small" />
                        <Chip label={item.category} size="small" variant="outlined" />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Stock Wishlist */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Stock Wishlist
              </Typography>
              
              {stockWishlist.isLoading && (
                <Box display="flex" justifyContent="center" p={2}>
                  <CircularProgress />
                </Box>
              )}
              
              {stockWishlist.data && stockWishlist.data.favoriteStocks.length > 0 ? (
                <Box display="flex" gap={1} flexWrap="wrap">
                  {stockWishlist.data.favoriteStocks.map((symbol) => (
                    <Chip
                      key={symbol}
                      label={symbol}
                      onDelete={() => handleRemoveFromWishlist(symbol)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No stocks in your wishlist yet. Add some using the heart icon above!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExampleWithHooks; 