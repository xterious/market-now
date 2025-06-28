import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  TextField,
  Button,
  Grid,
  Divider,
  IconButton,
  Chip
} from '@mui/material';
import {
  SwapHoriz,
  ArrowDownward,
  ArrowUpward,
  MonetizationOn
} from '@mui/icons-material';
import Navigation from "@/components/Navigation";
import { useWishlist } from "@/contexts/WishlistContext";

const currencyPairs = [
  { pair: 'EUR/USD', base: 'EUR', quote: 'USD' },
  { pair: 'USD/JPY', base: 'USD', quote: 'JPY' },
  { pair: 'USD/CHF', base: 'USD', quote: 'CHF' },
  { pair: 'GBP/USD', base: 'GBP', quote: 'USD' },
  { pair: 'AUD/USD', base: 'AUD', quote: 'USD' },
  { pair: 'EUR/GBP', base: 'EUR', quote: 'GBP' },
];

const currencyData = [
  { code: "USD", name: "US Dollar", rate: 1.0000, change: 0.0000, changePercent: 0.00, symbol: "$" },
  { code: "EUR", name: "Euro", rate: 0.9234, change: +0.0023, changePercent: +0.25, symbol: "€" },
  { code: "GBP", name: "British Pound", rate: 0.7891, change: -0.0012, changePercent: -0.15, symbol: "£" },
  { code: "JPY", name: "Japanese Yen", rate: 148.25, change: +0.45, changePercent: +0.30, symbol: "¥" },
  { code: "CHF", name: "Swiss Franc", rate: 0.8567, change: -0.0012, changePercent: -0.14, symbol: "CHF" },
  { code: "AUD", name: "Australian Dollar", rate: 1.5234, change: +0.0078, changePercent: +0.51, symbol: "A$" },
];

const getPairRate = (base, quote) => {
  const baseObj = currencyData.find(c => c.code === base);
  const quoteObj = currencyData.find(c => c.code === quote);
  if (!baseObj || !quoteObj) return null;
  // All rates are relative to USD
  // base/quote = (base/USD) / (quote/USD)
  return (baseObj.rate / quoteObj.rate);
};

const getPairChange = (base, quote) => {
  // Approximate: use base's change percent minus quote's change percent
  const baseObj = currencyData.find(c => c.code === base);
  const quoteObj = currencyData.find(c => c.code === quote);
  if (!baseObj || !quoteObj) return 0;
  return baseObj.changePercent - quoteObj.changePercent;
};

const Currency = () => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Converter state
  const [fromAmount, setFromAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [lastUpdated] = useState('2 minutes ago');

  // Calculate conversion
  const fromObj = currencyData.find(c => c.code === fromCurrency);
  const toObj = currencyData.find(c => c.code === toCurrency);
  let toAmount = '';
  let rate = 1;
  if (fromObj && toObj) {
    // All rates are relative to USD
    // from/to = (from/USD) / (to/USD)
    rate = fromObj.rate / toObj.rate;
    toAmount = (fromAmount * rate).toFixed(4);
  }

  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(Number(toAmount));
  };

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
                  value={toAmount}
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
                  {currencyData.map(c => (
                    <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
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
                  {currencyData.map(c => (
                    <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, color: 'primary.main', fontWeight: 'bold', fontSize: 16, textAlign: 'center', letterSpacing: 1 }}>
              1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                • Rate updated {lastUpdated}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Live Exchange Rates */}
        <Card sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              Live Exchange Rates
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Real-time currency pair rates
            </Typography>
            <Grid container spacing={2}>
              {currencyPairs.map(({ pair, base, quote }) => {
                const rate = getPairRate(base, quote);
                const change = getPairChange(base, quote);
                const isUp = change >= 0;
                return (
                  <Grid item xs={12} sm={6} md={4} key={pair}>
                    <Box sx={{
                      bgcolor: 'background.default',
                      borderRadius: 2,
                      p: 2,
                      boxShadow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      minHeight: 100
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{pair}</Typography>
                        <Chip
                          label={isUp ? `+${change.toFixed(4)}` : change.toFixed(4)}
                          color={isUp ? 'success' : 'error'}
                          size="small"
                          icon={isUp ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: isUp ? 'success.main' : 'error.main' }}>
                        {rate ? rate.toFixed(4) : '--'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {base} to {quote}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Currency;
