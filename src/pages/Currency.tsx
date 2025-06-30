import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  TextField,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button
} from '@mui/material';
import {
  SwapHoriz,
  Star,
  StarBorder
} from '@mui/icons-material';
import Navigation from "@/components/Navigation";
import ErrorBoundary from "@/components/ErrorBoundary";
import { 
  useRoleBasedExchangeRate, 
  useCurrencySymbols,
  useLiborRates,
  useCompleteRatesInfo,
  useAddToCurrencyWishlist, 
  useRemoveFromCurrencyWishlist, 
  useCurrencyWishlist 
} from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';

const Currency = () => {
  const { user } = useAuth();
  const { selectedToCurrency, setSelectedToCurrency } = useCurrency();

  // Converter state - EUR is fixed on left side
  const [fromAmount, setFromAmount] = useState(1000);
  const [fromCurrency] = useState('EUR'); // Fixed to EUR
  const [toCurrency, setToCurrency] = useState(selectedToCurrency);

  // Fetch currency symbols from API
  const { data: symbols, isLoading: symbolsLoading, error: symbolsError } = useCurrencySymbols();
  
  // Fetch role-based exchange rate
  const { data: exchangeRate, isLoading: rateLoading, error: rateError } = useRoleBasedExchangeRate(fromCurrency, toCurrency);
  
  // Fetch LIBOR rates
  const { data: liborRates, isLoading: liborLoading } = useLiborRates();
  
  // Fetch complete rates info for comparison
  const { data: completeRatesInfo } = useCompleteRatesInfo(fromCurrency, toCurrency);

  // Wishlist API calls
  const { data: currencyWishlist } = useCurrencyWishlist(user?.username || '');
  const addToCurrencyWishlist = useAddToCurrencyWishlist();
  const removeFromCurrencyWishlist = useRemoveFromCurrencyWishlist();

  // Update global state when local state changes
  useEffect(() => {
    setSelectedToCurrency(toCurrency);
  }, [toCurrency, setSelectedToCurrency]);

  // Update local state when global state changes
  useEffect(() => {
    setToCurrency(selectedToCurrency);
  }, [selectedToCurrency]);

  // Check if user is premium
  const isPremiumUser = user?.roles?.some(role => role.name === 'ROLE_PREMIUM') || false;

  // Use fallback symbols if API fails
  const fallbackSymbols = {
    'USD': 'US Dollar',
    'GBP': 'British Pound',
    'JPY': 'Japanese Yen',
    'CHF': 'Swiss Franc',
    'AUD': 'Australian Dollar',
    'CAD': 'Canadian Dollar',
    'CNY': 'Chinese Yuan',
    'INR': 'Indian Rupee'
  };

  // Use fallback symbols if API fails
  const availableSymbols = symbols || fallbackSymbols;

  // Fallback exchange rate if API fails
  const fallbackRate = {
    id: 'EUR-USD-fallback',
    base: 'EUR',
    target: toCurrency,
    baseRate: 1.0850,
    finalRate: 1.1067,
    customerType: isPremiumUser ? 'special' : 'normal'
  };

  // Use fallback rate if API fails
  const currentRate = exchangeRate || fallbackRate;

  // Check if currency pair is in wishlist
  const isInWishlist = (currencyPair: string) => {
    return currencyWishlist?.favoriteCurrencies?.includes(currencyPair) || false;
  };

  // Swap currencies (but keep EUR on left)
  const handleSwap = () => {
    if (toCurrency !== 'EUR') {
      setToCurrency('EUR');
      setFromAmount(Number(currentRate?.finalRate ? fromAmount * Number(currentRate.finalRate) : 0));
    }
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

  // Calculate local conversion with fallback
  const localConvertedAmount = currentRate?.finalRate ? fromAmount * Number(currentRate.finalRate) : null;

  // Handle loading state
  if (symbolsLoading && !symbols) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navigation />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress size={60} />
          </Box>
        </Container>
      </Box>
    );
  }

  // Handle API errors - but allow fallback operation
  if (rateError && symbolsError) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navigation />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Using fallback data
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Unable to connect to currency services. Using fallback data for demonstration.
            </Typography>
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
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
              Convert EUR to other currencies with role-based LIBOR rates
            </Typography>
            {user && (
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip 
                  label={`Welcome, ${user.firstName || user.username}!`} 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  label={`Account Type: ${isPremiumUser ? 'Premium (Special Rates)' : 'Standard (Normal Rates)'}`} 
                  color={isPremiumUser ? "success" : "default"}
                  variant="outlined"
                />
                {liborRates && (
                  <Chip 
                    label={`LIBOR Spread: ${isPremiumUser ? `${(Number(liborRates.specialRate) * 100).toFixed(1)}%` : `${(Number(liborRates.normalRate) * 100).toFixed(1)}%`}`} 
                    color="info"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
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

              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center', justifyContent: 'center' }}>
                {/* Left Side - Input + Fixed EUR */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', width: { xs: '100%', md: 'auto' }, flex: { xs: 1, md: '0 0 auto' } }}>
                  <TextField
                    label="Amount"
                    type="number"
                    value={fromAmount}
                    onChange={e => setFromAmount(Number(e.target.value) || 0)}
                    placeholder="1000"
                    fullWidth
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>From</InputLabel>
                    <Select
                      value={fromCurrency}
                      label="From"
                      disabled
                    >
                      <MenuItem value="EUR">EUR</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Middle - Swap Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Tooltip title="Swap currencies">
                    <IconButton
                      onClick={handleSwap}
                      size="large"
                      disabled={toCurrency === 'EUR'}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { 
                          bgcolor: 'primary.dark'
                        },
                        '&.Mui-disabled': {
                          bgcolor: 'grey.400',
                          color: 'white'
                        }
                      }}
                    >
                      <SwapHoriz />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Right Side - Result + Dropdown */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', width: { xs: '100%', md: 'auto' }, flex: { xs: 1, md: '0 0 auto' } }}>
                  <TextField
                    label="Result"
                    type="number"
                    value={localConvertedAmount?.toFixed(4) || ''}
                    disabled
                    placeholder="0.00"
                    fullWidth
                  />
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>To</InputLabel>
                    <Select
                      value={toCurrency}
                      onChange={e => setToCurrency(e.target.value)}
                      label="To"
                      disabled={symbolsLoading}
                    >
                      {availableSymbols && Object.entries(availableSymbols).map(([code, name]) => (
                        <MenuItem key={code} value={code}>
                          {code} - {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {rateLoading || symbolsLoading || liborLoading ? (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : currentRate ? (
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
                    1 {fromCurrency} = {Number(currentRate.finalRate)?.toFixed(4)} {toCurrency}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: 'text.secondary',
                    mb: 2
                  }}>
                    Base Rate: {Number(currentRate.baseRate)?.toFixed(4)} • Final Rate: {Number(currentRate.finalRate)?.toFixed(4)} • Customer Type: {currentRate.customerType}
                  </Typography>
                  
                  {liborRates && (
                    <Typography variant="body2" sx={{ 
                      color: 'text.secondary'
                    }}>
                      LIBOR Spread: {isPremiumUser ? `${(Number(liborRates.specialRate) * 100).toFixed(1)}%` : `${(Number(liborRates.normalRate) * 100).toFixed(1)}%`} 
                      {completeRatesInfo && (
                        <span> • Rate Difference: {((Number(completeRatesInfo.specialRate.finalRate) - Number(completeRatesInfo.normalRate.finalRate)) * 100).toFixed(2)}%</span>
                      )}
                    </Typography>
                  )}
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
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
              {availableSymbols && Object.entries(availableSymbols).slice(0, 8).map(([code, name]) => {
                const pair = `EUR/${code}`;
                return (
                  <Card key={code} sx={{ 
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
                            {pair}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: 'text.secondary'
                          }}>
                            {name}
                          </Typography>
                        </Box>
                        <Tooltip title={isInWishlist(pair) ? "Remove from favorites" : "Add to favorites"}>
                          <IconButton 
                            size="small"
                            onClick={(e) => isInWishlist(pair) 
                              ? handleRemoveFromWishlist(pair, e)
                              : handleAddToWishlist(pair, e)
                            }
                            disabled={addToCurrencyWishlist.isPending || removeFromCurrencyWishlist.isPending}
                            sx={{
                              color: isInWishlist(pair) ? 'error.main' : 'grey.400',
                              '&:hover': { color: 'error.main' },
                              '&.Mui-disabled': { color: isInWishlist(pair) ? 'error.main' : 'grey.400' }
                            }}
                          >
                            {isInWishlist(pair) ? <Star /> : <StarBorder />}
                          </IconButton>
                        </Tooltip>
                      </Box>
                      
                      <Typography variant="h5" sx={{ 
                        fontWeight: 700, 
                        mb: 2,
                        color: 'text.primary'
                      }}>
                        {Number(currentRate?.finalRate)?.toFixed(4) || '1.2345'}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          label={isPremiumUser ? "Premium Rate" : "Standard Rate"}
                          color={isPremiumUser ? "success" : "default"}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label="Low"
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </Box>
        </Container>
      </Box>
    </ErrorBoundary>
  );
};

export default Currency;
