import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  IconButton,
  InputAdornment,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Star,
  StarBorder,
  Filter,
  BarChart,
  Favorite,
  FavoriteBorder,
  Close,
} from "@mui/icons-material";
import Navigation from "@/components/Navigation";
import StockChart from "@/components/StockChart";
import CustomerTypeIndicator from "@/components/CustomerTypeIndicator";
import {
  useStockSymbols,
  useAddToStockWishlist,
  useRemoveFromStockWishlist,
  useStockWishlist,
} from "@/hooks/useApi";
import { useAuth } from "@/contexts/AuthContext";

const Stocks = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0); // API uses 0-based pagination
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuth();

  // API calls
  const {
    data: stockSymbolsData,
    isLoading: symbolsLoading,
    error: symbolsError,
  } = useStockSymbols("USD", page, searchTerm, 20);

  // Wishlist data and mutations
  const { data: stockWishlist } = useStockWishlist(user?.username || "");
  const addToWishlist = useAddToStockWishlist();
  const removeFromWishlist = useRemoveFromStockWishlist();

  const stocksPerPage = 20;

  const filteredStocks = stockSymbolsData
    ? (Array.isArray(stockSymbolsData)
        ? stockSymbolsData
        : [stockSymbolsData]
      ).filter((stock) => {
        if (!stock || !stock.symbol) return false;

        return (
          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (stock.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ??
            false)
        );
      })
    : [];

  const totalPages = 1; // Since we're getting single objects, pagination is simplified

  // Check if a stock is in wishlist
  const isInWishlist = (symbol: string) => {
    return stockWishlist?.favoriteStocks?.includes(symbol) || false;
  };

  const handleStockClick = async (stock: any) => {
    setSelectedStock(stock);
    setOpenDialog(true);
  };

  const handleAddToWishlist = async (stock: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.username) return;

    try {
      if (isInWishlist(stock.symbol)) {
        await removeFromWishlist.mutateAsync({ stockSymbol: stock.symbol });
      } else {
        await addToWishlist.mutateAsync({ stockSymbol: stock.symbol });
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(0);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value - 1); // Convert to 0-based
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStock(null);
  };

  const renderStockCards = (stocks: any[]) => (
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
      {stocks.map((stock) => (
        <Card
          key={stock.symbol}
          sx={{
            cursor: "pointer",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6,
              transition: "all 0.3s ease",
            },
            transition: "all 0.3s ease",
          }}
          onClick={() => handleStockClick(stock)}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{ fontWeight: "bold" }}
                >
                  {stock.symbol}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 150,
                  }}
                >
                  {stock.description || "N/A"}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={(e) => handleAddToWishlist(stock, e)}
                sx={{
                  color: isInWishlist(stock.symbol) ? "error.main" : "grey.400",
                  "&:hover": { color: "error.main" },
                  "&.Mui-disabled": {
                    color: isInWishlist(stock.symbol)
                      ? "error.main"
                      : "grey.400",
                  },
                }}
              >
                {isInWishlist(stock.symbol) ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Box>
            <Typography
              variant="h5"
              component="p"
              sx={{ fontWeight: "bold", mb: 1 }}
            >
              ${stock.currentPrice?.toFixed(2) || "N/A"}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Chip
                icon={stock.change >= 0 ? <TrendingUp /> : <TrendingDown />}
                label={`${stock.percentChange > 0 ? "+" : ""}${
                  stock.percentChange?.toFixed(2) || 0
                }%`}
                color={stock.change >= 0 ? "success" : "error"}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                {stock.exchange}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: stock.change >= 0 ? "success.main" : "error.main" }}
            >
              {stock.change >= 0 ? "+" : ""}${stock.change?.toFixed(2) || 0}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  if (symbolsError) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Navigation />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load stock data. Please try again later.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navigation />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                Stock Market
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Real-time stock quotes and market data
              </Typography>
            </Box>
            <CustomerTypeIndicator />
          </Box>

          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search stocks by symbol or company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 600 }}
            />
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="All Stocks" />
              <Tab label="Top Gainers" />
              <Tab label="Top Losers" />
            </Tabs>
          </Box>
        </Box>

        {/* Loading State */}
        {symbolsLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Stock Grid */}
        {!symbolsLoading && (
          <>
            {filteredStocks.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No stocks found matching your search.
                </Typography>
              </Box>
            ) : (
              renderStockCards(filteredStocks)
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}

        {/* Stock Detail Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">
                {selectedStock?.symbol} - {selectedStock?.description}
              </Typography>
              <IconButton onClick={handleCloseDialog}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Stocks;
