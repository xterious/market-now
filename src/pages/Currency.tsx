import React, { useState, useEffect } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { SwapHoriz } from "@mui/icons-material";
import Navigation from "@/components/Navigation";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useCurrencySymbols, useExchangeRate } from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { CurrencySymbolsResponse, ExchangeRate, User } from "@/config/types";
import { usePopularExchangeRates } from "@/components/usePopularExchangeRates";

const Currency = () => {
  const { user } = useAuth() as { user: User | null };
  const { symbols, setSelectedToCurrency, selectedToCurrency } = useCurrency();

  const [fromAmount, setFromAmount] = useState(1000);
  const [fromCurrency] = useState("EUR");

  // Fetch currency symbols
  const {
    data: apiSymbols,
    isLoading: symbolsLoading,
    error: symbolsError,
  } = useCurrencySymbols();

  // Customer type based on user role
  const customerType =
    Array.isArray(user?.roles) &&
    user.roles.some((role) => role.name === "ROLE_PREMIUM")
      ? "special"
      : "normal";

  // Fetch exchange rate for selected currency pair
  const {
    data: exchangeRate,
    isLoading: rateLoading,
    error: rateError,
  } = useExchangeRate(fromCurrency, selectedToCurrency, customerType);

  // Fallback symbols
  const fallbackSymbols: CurrencySymbolsResponse = {
    USD: "US Dollar",
    GBP: "British Pound",
    JPY: "Japanese Yen",
    CHF: "Swiss Franc",
    AUD: "Australian Dollar",
    CAD: "Canadian Dollar",
    CNY: "Chinese Yuan",
    INR: "Indian Rupee",
  };

  const availableSymbols = apiSymbols || fallbackSymbols;

  // Fallback exchange rate
  const fallbackRate: ExchangeRate = {
    id: `fallback-EUR-${selectedToCurrency}`,
    base: "EUR",
    target: selectedToCurrency,
    rate: 1.085,
    finalRate: 1.1067,
    customerType,
    lastUpdated: Date.now(),
  };

  const currentRate: ExchangeRate = exchangeRate
    ? {
        ...exchangeRate,
        rate: parseFloat(exchangeRate.rate),
        finalRate: parseFloat(exchangeRate.finalRate),
      }
    : fallbackRate;

  const localConvertedAmount = currentRate?.finalRate
    ? fromAmount * currentRate.finalRate
    : null;

  if (symbolsLoading && !symbols) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Navigation />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress size={60} />
          </Box>
        </Container>
      </Box>
    );
  }

  if (rateError && symbolsError && !symbols) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Navigation />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Using fallback data
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Unable to connect to currency services. Using fallback data for
              demonstration.
            </Typography>
          </Alert>
        </Container>
      </Box>
    );
  }

  /**
   * Prepare Popular Currency Pairs
   *
   * Move hooks out of loops!
   */
  const popularCurrencies = Object.keys(availableSymbols)
    .filter((code) => code !== "EUR")
    .slice(0, 8);

  const popularRates = usePopularExchangeRates(
    "EUR",
    popularCurrencies,
    customerType,
    fallbackRate
  );

  return (
    <ErrorBoundary>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Navigation />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 6, textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
            >
              Currency Exchange
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, color: "text.secondary", fontWeight: 400 }}
            >
              Convert EUR to other currencies with role-based rates
            </Typography>

            {user && (
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Chip
                  label={`Welcome, ${user.firstName || user.username}!`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`Account Type: ${
                    customerType === "special"
                      ? "Premium (Special Rates)"
                      : "Standard (Normal Rates)"
                  }`}
                  color={customerType === "special" ? "success" : "default"}
                  variant="outlined"
                />
              </Box>
            )}
          </Box>

          {/* Currency Converter */}
          <Card
            sx={{
              mb: 6,
              borderRadius: 2,
              boxShadow: 2,
              maxWidth: 800,
              mx: "auto",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  mb: 4,
                  color: "text.primary",
                  textAlign: "center",
                }}
              >
                Currency Converter
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 3,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {/* Left Side */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: 240,
                  }}
                >
                  <TextField
                    label="Amount"
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(Number(e.target.value) || 0)}
                    placeholder="1000"
                    size="small"
                    fullWidth
                  />
                  <FormControl fullWidth size="small">
                    <InputLabel>From</InputLabel>
                    <Select value={fromCurrency} label="From" disabled>
                      <MenuItem value="EUR">EUR</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Middle Swap Button */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconButton
                    size="large"
                    disabled
                    sx={{
                      bgcolor: "grey.400",
                      color: "white",
                      "&.Mui-disabled": {
                        bgcolor: "grey.400",
                        color: "white",
                      },
                    }}
                  >
                    <SwapHoriz />
                  </IconButton>
                </Box>

                {/* Right Side */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    width: 240,
                  }}
                >
                  <TextField
                    label="Result"
                    type="number"
                    value={
                      rateLoading ? "" : localConvertedAmount?.toFixed(4) || ""
                    }
                    disabled={rateLoading}
                    placeholder="1000"
                    size="small"
                    fullWidth
                  />
                  <FormControl fullWidth size="small">
                    <InputLabel>To</InputLabel>
                    <Select
                      value={selectedToCurrency}
                      onChange={(e) => setSelectedToCurrency(e.target.value)}
                      label="To"
                      disabled={symbolsLoading}
                    >
                      {Object.entries(availableSymbols).map(([code, name]) => (
                        <MenuItem key={code} value={code}>
                          {code} - {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {rateLoading ? (
                <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    bgcolor: "grey.50",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}
                  >
                    1 {fromCurrency} ={" "}
                    {typeof currentRate.finalRate === "number"
                      ? currentRate.finalRate.toFixed(4)
                      : "-"}{" "}
                    {selectedToCurrency}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Base Rate:{" "}
                    {typeof currentRate.rate === "number"
                      ? currentRate.rate.toFixed(4)
                      : "-"}{" "}
                    • Final Rate:{" "}
                    {typeof currentRate.finalRate === "number"
                      ? currentRate.finalRate.toFixed(4)
                      : "-"}{" "}
                    • Customer Type: {currentRate.customerType}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Popular Currency Pairs */}
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                mb: 4,
                textAlign: "center",
                color: "text.primary",
              }}
            >
              Popular Currency Pairs
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 3,
              }}
            >
              {popularCurrencies.map((code) => {
                const pair = `EUR/${code}`;
                const name = availableSymbols[code];
                const rate = popularRates[code];

                return (
                  <Card
                    key={code}
                    sx={{
                      borderRadius: 2,
                      boxShadow: 1,
                      "&:hover": { boxShadow: 3 },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "text.primary" }}
                      >
                        {pair}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {name}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                          color: "text.primary",
                        }}
                      >
                        {typeof rate?.finalRate === "number"
                          ? rate.finalRate.toFixed(4)
                          : "N/A"}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Chip
                          label={
                            customerType === "special"
                              ? "Premium Rate"
                              : "Standard Rate"
                          }
                          color={
                            customerType === "special" ? "success" : "default"
                          }
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
