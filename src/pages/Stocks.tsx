import React, { useState } from 'react';
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
  Grid
} from '@mui/material';
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
  Close
} from '@mui/icons-material';
import Navigation from "@/components/Navigation";
import StockChart from "@/components/StockChart";
import { useWishlist } from "@/contexts/WishlistContext";
import CustomerTypeIndicator from "@/components/CustomerTypeIndicator";

const Stocks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const stocksPerPage = 10;

  const stockData = [
    { symbol: "AAPL", name: "Apple Inc.", price: 175.43, change: +2.34, changePercent: +1.35, volume: "52.4M", marketCap: "2.8T", high: 176.20, low: 173.80, open: 174.00, previousClose: 173.09, timestamp: "2024-01-15 15:30:00" },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 2834.52, change: -15.67, changePercent: -0.55, volume: "28.1M", marketCap: "1.8T", high: 2850.00, low: 2820.00, open: 2840.00, previousClose: 2830.19, timestamp: "2024-01-15 15:30:00" },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 378.91, change: +8.23, changePercent: +2.22, volume: "41.2M", marketCap: "2.9T", high: 380.50, low: 375.20, open: 376.00, previousClose: 374.12, timestamp: "2024-01-15 15:30:00" },
    { symbol: "TSLA", name: "Tesla Inc.", price: 245.67, change: +12.45, changePercent: +5.34, volume: "89.7M", marketCap: "780B", high: 248.90, low: 240.10, open: 241.00, previousClose: 233.22, timestamp: "2024-01-15 15:30:00" },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 3401.80, change: -8.45, changePercent: -0.25, volume: "35.6M", marketCap: "1.7T", high: 3420.00, low: 3380.00, open: 3395.00, previousClose: 3400.25, timestamp: "2024-01-15 15:30:00" },
    { symbol: "META", name: "Meta Platforms Inc.", price: 478.42, change: +15.23, changePercent: +3.28, volume: "42.8M", marketCap: "1.2T", high: 480.00, low: 470.50, open: 472.00, previousClose: 463.19, timestamp: "2024-01-15 15:30:00" },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 485.09, change: +22.15, changePercent: +4.79, volume: "65.3M", marketCap: "1.2T", high: 488.00, low: 475.20, open: 476.00, previousClose: 462.94, timestamp: "2024-01-15 15:30:00" },
    { symbol: "NFLX", name: "Netflix Inc.", price: 492.42, change: -5.67, changePercent: -1.14, volume: "18.9M", marketCap: "215B", high: 495.00, low: 488.50, open: 490.00, previousClose: 491.10, timestamp: "2024-01-15 15:30:00" },
    { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 172.28, change: +1.45, changePercent: +0.85, volume: "12.7M", marketCap: "495B", high: 173.00, low: 171.20, open: 171.50, previousClose: 170.83, timestamp: "2024-01-15 15:30:00" },
    { symbol: "JNJ", name: "Johnson & Johnson", price: 162.84, change: -0.92, changePercent: -0.56, volume: "8.4M", marketCap: "393B", high: 163.50, low: 162.00, open: 162.50, previousClose: 163.76, timestamp: "2024-01-15 15:30:00" },
    { symbol: "V", name: "Visa Inc.", price: 271.56, change: +3.21, changePercent: +1.20, volume: "15.2M", marketCap: "558B", high: 272.80, low: 269.40, open: 270.00, previousClose: 268.35, timestamp: "2024-01-15 15:30:00" },
    { symbol: "WMT", name: "Walmart Inc.", price: 162.35, change: +0.78, changePercent: +0.48, volume: "9.8M", marketCap: "408B", high: 163.00, low: 161.80, open: 162.00, previousClose: 161.57, timestamp: "2024-01-15 15:30:00" },
  ];

  const topGainers = stockData.filter(stock => stock.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
  const topLosers = stockData.filter(stock => stock.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);

  const filteredStocks = stockData.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedStocks = filteredStocks.slice(
    (page - 1) * stocksPerPage,
    page * stocksPerPage
  );

  const totalPages = Math.ceil(filteredStocks.length / stocksPerPage);

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    setOpenDialog(true);
  };

  const handleAddToWishlist = (stock, e) => {
    e.stopPropagation();
    if (isInWishlist(stock.symbol)) {
      removeFromWishlist(stock.symbol);
    } else {
      addToWishlist('stock', stock);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStock(null);
  };

  const renderStockCards = (stocks) => (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
      gap: 3 
    }}>
      {stocks.map((stock) => (
        <Card 
          key={stock.symbol}
          sx={{ 
            cursor: 'pointer', 
            '&:hover': { 
              transform: 'translateY(-4px)', 
              boxShadow: 6,
              transition: 'all 0.3s ease'
            },
            transition: 'all 0.3s ease'
          }}
          onClick={() => handleStockClick(stock)}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                  {stock.symbol}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 150
                }}>
                  {stock.name}
                </Typography>
              </Box>
              <IconButton 
                size="small"
                onClick={(e) => handleAddToWishlist(stock, e)}
                color={isInWishlist(stock.symbol) ? "error" : "default"}
                sx={{ 
                  '&:hover': { 
                    transform: 'scale(1.1)',
                    transition: 'transform 0.2s ease'
                  }
                }}
              >
                {isInWishlist(stock.symbol) ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Box>
            <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', mb: 1 }}>
              ${stock.price}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Chip
                icon={stock.change >= 0 ? <TrendingUp /> : <TrendingDown />}
                label={`${stock.changePercent > 0 ? '+' : ''}${stock.changePercent}%`}
                color={stock.change >= 0 ? "success" : "error"}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                Vol: {stock.volume}
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ color: stock.change >= 0 ? 'success.main' : 'error.main' }}
            >
              {stock.change >= 0 ? '+' : ''}${stock.change}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navigation />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Stock Market
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Real-time stock prices and market data
              </Typography>
            </Box>
            <CustomerTypeIndicator size="medium" showLabel={true} />
          </Box>
        </Box>

        {/* Search and Filter */}
        <Card sx={{ mb: 4 }} className="card-elevated">
          <CardContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Search stocks by symbol or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="outlined" startIcon={<Filter />}>
                Filter
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              '& .MuiTab-root': { 
                fontWeight: 'bold',
                textTransform: 'none'
              }
            }}
          >
            <Tab label="All Stocks" />
            <Tab label="Top Gainers" />
            <Tab label="Top Losers" />
          </Tabs>
        </Box>

        {/* Stock Cards */}
        <Box sx={{ mb: 4 }}>
          {tabValue === 0 && renderStockCards(paginatedStocks)}
          {tabValue === 1 && renderStockCards(topGainers.slice(0, stocksPerPage))}
          {tabValue === 2 && renderStockCards(topLosers.slice(0, stocksPerPage))}
        </Box>

        {/* Pagination */}
        {tabValue === 0 && totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}

        {/* Stock Details Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          {selectedStock && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {selectedStock.symbol} - {selectedStock.name}
                  </Typography>
                  <IconButton onClick={handleCloseDialog}>
                    <Close />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      ${selectedStock.price}
                    </Typography>
                    <IconButton 
                      onClick={(e) => handleAddToWishlist(selectedStock, e)}
                      color={isInWishlist(selectedStock.symbol) ? "error" : "default"}
                      size="large"
                    >
                      {isInWishlist(selectedStock.symbol) ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>
                  <Chip
                    icon={selectedStock.change >= 0 ? <TrendingUp /> : <TrendingDown />}
                    label={`${selectedStock.changePercent > 0 ? '+' : ''}${selectedStock.changePercent}% (${selectedStock.change >= 0 ? '+' : ''}$${selectedStock.change})`}
                    color={selectedStock.change >= 0 ? "success" : "error"}
                    size="medium"
                  />
                </Box>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Current Price</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>${selectedStock.price}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Change</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: selectedStock.change >= 0 ? 'success.main' : 'error.main' }}>{selectedStock.change >= 0 ? '+' : ''}${selectedStock.change}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Percent Change</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: selectedStock.changePercent >= 0 ? 'success.main' : 'error.main' }}>{selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent}%</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">High (Day)</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>${selectedStock.high}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Low (Day)</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>${selectedStock.low}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Open (Day)</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>${selectedStock.open}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">Previous Close</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>${selectedStock.previousClose}</Typography>
                  </Grid>
                </Grid>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Last updated: {selectedStock.timestamp}
                </Typography>
                <Box sx={{ height: 300, mt: 2 }}>
                  <StockChart symbol={selectedStock.symbol} />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Close</Button>
                <Button variant="contained" onClick={() => handleAddToWishlist(selectedStock, { stopPropagation: () => {} })}>
                  {isInWishlist(selectedStock.symbol) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default Stocks;
