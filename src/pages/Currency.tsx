import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  TextField,
  Button,
  Divider,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
  Tooltip,
  Fade,
  Slide,
  Paper,
  LinearProgress,
  Badge,
  Grid
} from '@mui/material';
import {
  SwapHoriz,
  ArrowDownward,
  ArrowUpward,
  MonetizationOn,
  Star,
  StarBorder,
  TrendingUp,
  TrendingDown,
  Refresh,
  Visibility,
  VisibilityOff,
  CurrencyExchange,
  AccountBalance,
  Timeline,
  Speed,
  ShowChart,
  AttachMoney,
  Euro,
  CurrencyPound,
  CurrencyYen,
  CurrencyFranc,
  CurrencyRuble,
  CurrencyBitcoin
} from '@mui/icons-material';
import Navigation from "@/components/Navigation";
import { useExchangeRate, useCurrencyConversion, useAddToCurrencyWishlist, useRemoveFromCurrencyWishlist, useCurrencyWishlist } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { useCustomer } from '@/contexts/CustomerContext';

// Enhanced currency pairs with more data and icons
const currencyPairs = [
  { pair: 'EUR/USD', base: 'EUR', quote: 'USD', name: 'Euro / US Dollar', flag: '🇪🇺', volatility: 'Low', icon: <Euro />, change: '+0.12%', volume: '2.1M' },
  { pair: 'USD/JPY', base: 'USD', quote: 'JPY', name: 'US Dollar / Japanese Yen', flag: '🇺🇸', volatility: 'Medium', icon: <AttachMoney />, change: '-0.08%', volume: '1.8M' },
  { pair: 'GBP/USD', base: 'GBP', quote: 'USD', name: 'British Pound / US Dollar', flag: '🇬🇧', volatility: 'High', icon: <CurrencyPound />, change: '+0.25%', volume: '1.5M' },
  { pair: 'USD/CHF', base: 'USD', quote: 'CHF', name: 'US Dollar / Swiss Franc', flag: '🇨🇭', volatility: 'Low', icon: <CurrencyFranc />, change: '-0.03%', volume: '0.9M' },
  { pair: 'AUD/USD', base: 'AUD', quote: 'USD', name: 'Australian Dollar / US Dollar', flag: '🇦🇺', volatility: 'Medium', icon: <AttachMoney />, change: '+0.18%', volume: '1.2M' },
  { pair: 'USD/CAD', base: 'USD', quote: 'CAD', name: 'US Dollar / Canadian Dollar', flag: '🇨🇦', volatility: 'Medium', icon: <AttachMoney />, change: '-0.05%', volume: '1.1M' },
  { pair: 'EUR/GBP', base: 'EUR', quote: 'GBP', name: 'Euro / British Pound', flag: '🇪🇺', volatility: 'Medium', icon: <Euro />, change: '+0.09%', volume: '0.8M' },
  { pair: 'USD/CNY', base: 'USD', quote: 'CNY', name: 'US Dollar / Chinese Yuan', flag: '🇨🇳', volatility: 'Low', icon: <AttachMoney />, change: '+0.02%', volume: '0.6M' },
];

const Currency = () => {
  const { user } = useAuth();
  const { customerType } = useCustomer();

  // Converter state
  const [fromAmount, setFromAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [showDetails, setShowDetails] = useState(false);

  // API calls
  const { data: exchangeRate, isLoading: rateLoading, error: rateError } = useExchangeRate(fromCurrency, toCurrency, customerType);
  const { data: convertedAmount, isLoading: convertLoading } = useCurrencyConversion(fromCurrency, toCurrency, fromAmount, customerType);

  // Wishlist API calls
  const { data: currencyWishlist } = useCurrencyWishlist(user?.username || '');
  const addToCurrencyWishlist = useAddToCurrencyWishlist();
  const removeFromCurrencyWishlist = useRemoveFromCurrencyWishlist();

  // Check if currency pair is in wishlist
  const isInWishlist = (currencyPair: string) => {
    return currencyWishlist?.favoriteCurrencies?.includes(currencyPair) || false;
  };

  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(Number(convertedAmount || 0));
  };

  const handleAddToWishlist = async (currencyPair: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.username) return;

    try {
      await addToCurrencyWishlist.mutateAsync({ currencyCode: currencyPair });
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const handleRemoveFromWishlist = async (currencyPair: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.username) return;

    try {
      await removeFromCurrencyWishlist.mutateAsync({ currencyCode: currencyPair });
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const getVolatilityColor = (volatility: string) => {
    switch (volatility) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getChangeColor = (change: string) => {
    return change.startsWith('+') ? 'success' : 'error';
  };

  if (rateError) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navigation />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load currency data. Please try again later.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      py: 4
    }}>
      <Navigation />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            mb: 2,
            color: 'text.primary'
          }}>
            Currency Exchange
          </Typography>
          <Typography variant="h6" sx={{ 
            mb: 4, 
            color: 'text.secondary',
            fontWeight: 400
          }}>
            Convert between currencies with real-time exchange rates
          </Typography>
        </Box>

        {/* Currency Converter */}
        <Card sx={{ 
          mb: 6, 
          borderRadius: 2, 
          boxShadow: 2,
          maxWidth: 800,
          mx: 'auto'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 600, 
              mb: 4,
              color: 'text.primary'
            }}>
              Currency Converter
            </Typography>

            <Grid container spacing={4} alignItems="center" justifyContent="center">
              {/* Left Side - Input + Dropdown */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                  <TextField
                    label="Amount"
                    type="number"
                    value={fromAmount}
                    onChange={e => setFromAmount(Number(e.target.value))}
                    placeholder="1000"
                    fullWidth
                  />
                  <TextField
                    select
                    value={fromCurrency}
                    onChange={e => setFromCurrency(e.target.value)}
                    sx={{ minWidth: 120 }}
                    SelectProps={{ native: true }}
                  >
                    {currencyPairs.map(c => (
                      <option key={c.base} value={c.base}>{c.base}</option>
                    ))}
                  </TextField>
                </Box>
              </Grid>

              {/* Middle - Swap Button */}
              <Grid item xs={12} md={2} sx={{ textAlign: 'center' }}>
                <Tooltip title="Swap currencies">
                  <IconButton
                    onClick={handleSwap}
                    size="large"
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { 
                        bgcolor: 'primary.dark'
                      },
                    }}
                  >
                    <SwapHoriz />
                  </IconButton>
                </Tooltip>
              </Grid>

              {/* Right Side - Disabled Input + Dropdown */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                  <TextField
                    label="Result"
                    type="number"
                    value={convertedAmount?.toFixed(4) || ''}
                    disabled
                    placeholder="0.00"
                    fullWidth
                  />
                  <TextField
                    select
                    value={toCurrency}
                    onChange={e => setToCurrency(e.target.value)}
                    sx={{ minWidth: 120 }}
                    SelectProps={{ native: true }}
                  >
                    {currencyPairs.map(c => (
                      <option key={c.quote} value={c.quote}>{c.quote}</option>
                    ))}
                  </TextField>
                </Box>
              </Grid>
            </Grid>

            {rateLoading ? (
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : exchangeRate ? (
              <Box sx={{ 
                mt: 4, 
                p: 3, 
                bgcolor: 'grey.50', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200'
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  mb: 1
                }}>
                  1 {fromCurrency} = {exchangeRate.finalRate?.toFixed(4)} {toCurrency}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'text.secondary'
                }}>
                  Base rate: {exchangeRate.rate?.toFixed(4)} • Spread: {((exchangeRate.finalRate - exchangeRate.rate) * 100).toFixed(2)}%
                </Typography>
              </Box>
            ) : null}
          </CardContent>
        </Card>

        {/* Popular Currency Pairs */}
        <Box>
          <Typography variant="h4" sx={{ 
            fontWeight: 600, 
            mb: 4, 
            textAlign: 'center',
            color: 'text.primary'
          }}>
            Popular Currency Pairs
          </Typography>
          <Grid container spacing={3}>
            {currencyPairs.map((pair, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={pair.pair}>
                <Card sx={{ 
                  borderRadius: 2, 
                  boxShadow: 1,
                  '&:hover': { 
                    boxShadow: 3
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          color: 'text.primary'
                        }}>
                          {pair.pair}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'text.secondary'
                        }}>
                          {pair.name}
                        </Typography>
                      </Box>
                      <Tooltip title={isInWishlist(pair.pair) ? "Remove from favorites" : "Add to favorites"}>
                        <IconButton 
                          size="small"
                          onClick={(e) => isInWishlist(pair.pair) 
                            ? handleRemoveFromWishlist(pair.pair, e)
                            : handleAddToWishlist(pair.pair, e)
                          }
                          disabled={addToCurrencyWishlist.isPending || removeFromCurrencyWishlist.isPending}
                          sx={{
                            color: isInWishlist(pair.pair) ? 'error.main' : 'grey.400',
                            '&:hover': { color: 'error.main' },
                            '&.Mui-disabled': { color: isInWishlist(pair.pair) ? 'error.main' : 'grey.400' }
                          }}
                        >
                          {isInWishlist(pair.pair) ? <Star /> : <StarBorder />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    <Typography variant="h5" sx={{ 
                      fontWeight: 700, 
                      mb: 2,
                      color: 'text.primary'
                    }}>
                      {exchangeRate?.finalRate?.toFixed(4) || '1.2345'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label="+0.25%"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={pair.volatility}
                        color={getVolatilityColor(pair.volatility) as any}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Currency;
