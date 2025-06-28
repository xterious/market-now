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
  CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  SwapHoriz,
  ArrowDownward,
  ArrowUpward,
  MonetizationOn,
  Star,
  StarBorder
} from '@mui/icons-material';
import Navigation from "@/components/Navigation";
import { useWishlist } from "@/contexts/WishlistContext";
import { useExchangeRate, useCurrencyConversion, useAddToCurrencyWishlist, useRemoveFromCurrencyWishlist } from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import { useCustomer } from '@/contexts/CustomerContext';

// Common currency pairs
const currencyPairs = [
  { pair: 'EUR/USD', base: 'EUR', quote: 'USD' },
  { pair: 'USD/JPY', base: 'USD', quote: 'JPY' },
  { pair: 'USD/CHF', base: 'USD', quote: 'CHF' },
  { pair: 'GBP/USD', base: 'GBP', quote: 'USD' },
  { pair: 'AUD/USD', base: 'AUD', quote: 'USD' },
  { pair: 'EUR/GBP', base: 'EUR', quote: 'GBP' },
];

const Currency = () => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { customerType } = useCustomer();

  // Converter state
  const [fromAmount, setFromAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  // API calls
  const { data: exchangeRate, isLoading: rateLoading, error: rateError } = useExchangeRate(fromCurrency, toCurrency, customerType);
  const { data: convertedAmount, isLoading: convertLoading } = useCurrencyConversion(fromCurrency, toCurrency, fromAmount, customerType);

  // Wishlist mutations
  const addToCurrencyWishlist = useAddToCurrencyWishlist();
  const removeFromCurrencyWishlist = useRemoveFromCurrencyWishlist();

  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(Number(convertedAmount || 0));
  };

  const handleAddToWishlist = async (currencyCode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.username) return;

    try {
      await addToCurrencyWishlist.mutateAsync({ currencyCode });
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const handleRemoveFromWishlist = async (currencyCode: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.username) return;

    try {
      await removeFromCurrencyWishlist.mutateAsync({ currencyCode });
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  if (rateError) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navigation />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load currency data. Please try again later.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navigation />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
          Currencies & Forex
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 3, color: 'text.secondary' }}>
          Live exchange rates and currency conversion
        </Typography>

        {/* Currency Converter */}
        <Card sx={{ mb: 4, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 6, p: 0 }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <MonetizationOn sx={{ color: 'primary.main', fontSize: 32, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                Currency Converter
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Convert between currencies using live rates
            </Typography>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  label="From"
                  type="number"
                  value={fromAmount}
                  onChange={e => setFromAmount(Number(e.target.value))}
                  fullWidth
                  InputProps={{
                    endAdornment: <span style={{ fontWeight: 700, fontSize: 18 }}>{fromCurrency}</span>,
                    sx: { fontSize: 20, borderRadius: 2, bgcolor: 'background.default' }
                  }}
                  sx={{
                    '& .MuiInputBase-root': { fontSize: 20, borderRadius: 2, bgcolor: 'background.default' },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2} sx={{ textAlign: 'center', position: 'relative' }}>
                <IconButton
                  onClick={handleSwap}
                  size="large"
                  sx={{
                    mt: { xs: 1, sm: 0 },
                    bgcolor: 'primary.main',
                    color: 'white',
                    border: '2px solid',
                    borderColor: 'primary.dark',
                    boxShadow: 3,
                    '&:hover': { bgcolor: 'primary.dark', color: 'white', transform: 'rotate(90deg)', transition: '0.2s' },
                    width: 48, height: 48
                  }}
                >
                  <SwapHoriz fontSize="medium" />
                </IconButton>
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  label="To"
                  type="number"
                  value={convertedAmount?.toFixed(4) || ''}
                  fullWidth
                  InputProps={{
                    endAdornment: <span style={{ fontWeight: 700, fontSize: 18 }}>{toCurrency}</span>,
                    sx: { fontSize: 20, borderRadius: 2, bgcolor: 'background.default' }
                  }}
                  sx={{
                    '& .MuiInputBase-root': { fontSize: 20, borderRadius: 2, bgcolor: 'background.default' },
                  }}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  select
                  label="From Currency"
                  value={fromCurrency}
                  onChange={e => setFromCurrency(e.target.value)}
                  fullWidth
                  SelectProps={{ native: true }}
                  sx={{ mt: 2, borderRadius: 2, bgcolor: 'background.default' }}
                >
                  {currencyPairs.map(c => (
                    <option key={c.base} value={c.base}>{c.base}</option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' }, mx: 'auto', height: 48, borderColor: 'grey.800' }} />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  select
                  label="To Currency"
                  value={toCurrency}
                  onChange={e => setToCurrency(e.target.value)}
                  fullWidth
                  SelectProps={{ native: true }}
                  sx={{ mt: 2, borderRadius: 2, bgcolor: 'background.default' }}
                >
                  {currencyPairs.map(c => (
                    <option key={c.quote} value={c.quote}>{c.quote}</option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            {rateLoading ? (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={20} />
              </Box>
            ) : exchangeRate ? (
            <Box sx={{ mt: 3, color: 'primary.main', fontWeight: 'bold', fontSize: 16, textAlign: 'center', letterSpacing: 1 }}>
                1 {fromCurrency} = {exchangeRate.finalRate?.toFixed(4)} {toCurrency}
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  • {customerType} customer rate
              </Typography>
            </Box>
            ) : null}
          </CardContent>
        </Card>

        {/* Popular Currency Pairs */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          Popular Currency Pairs
            </Typography>
        <Grid container spacing={3}>
          {currencyPairs.map((pair) => (
            <Grid item xs={12} sm={6} md={4} key={pair.pair}>
              <Card sx={{ 
                bgcolor: 'background.paper', 
                borderRadius: 3, 
                boxShadow: 4, 
                cursor: 'pointer', 
                transition: '0.2s', 
                '&:hover': { boxShadow: 8 } 
                    }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {pair.pair}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {pair.base} to {pair.quote}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small"
                      onClick={(e) => handleAddToWishlist(pair.pair, e)}
                      disabled={addToCurrencyWishlist.isPending || removeFromCurrencyWishlist.isPending}
                      color={isInWishlist(pair.pair) ? "error" : "default"}
                    >
                      {isInWishlist(pair.pair) ? <Star /> : <StarBorder />}
                    </IconButton>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {exchangeRate?.finalRate?.toFixed(4) || 'Loading...'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      icon={<ArrowUpward />}
                      label="+0.25%"
                      color="success"
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Live rate
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Currency;
