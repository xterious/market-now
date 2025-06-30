import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  TextField, 
  Box, 
  Container, 
  Grid, 
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
  CircularProgress,
  Alert,
  Avatar,
  Link
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Delete, 
  Add, 
  Search, 
  Notifications, 
  Article, 
  AttachMoney, 
  BarChart,
  OpenInNew,
  AccessTime
} from '@mui/icons-material';
import Navigation from "@/components/Navigation";
import { 
  useStockWishlist, 
  useNewsWishlist, 
  useCurrencyWishlist,
  useRemoveFromStockWishlist,
  useRemoveFromNewsWishlist,
  useRemoveFromCurrencyWishlist,
  useTopHeadlines,
  useNewsByCategory
} from '@/hooks/useApi';
import { useAuth } from '@/contexts/AuthContext';
import type { News } from '@/config/types';

const Wishlist = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [newsData, setNewsData] = useState<News[]>([]);
  const { user } = useAuth();

  // API calls
  const { data: stockWishlist, isLoading: stockLoading, error: stockError } = useStockWishlist(user?.username || '');
  const { data: newsWishlist, isLoading: newsLoading, error: newsError } = useNewsWishlist(user?.username || '');
  const { data: currencyWishlist, isLoading: currencyLoading, error: currencyError } = useCurrencyWishlist(user?.username || '');
  
  // Fetch all news data to match with wishlist
  const { data: headlines } = useTopHeadlines();
  const { data: generalNews } = useNewsByCategory('general');
  const { data: mergerNews } = useNewsByCategory('merger');
  const { data: currencyNews } = useNewsByCategory('currency');
  const { data: forexNews } = useNewsByCategory('forex');

  // Mutations
  const removeFromStockWishlist = useRemoveFromStockWishlist();
  const removeFromNewsWishlist = useRemoveFromNewsWishlist();
  const removeFromCurrencyWishlist = useRemoveFromCurrencyWishlist();

  // Combine all news data and find wishlist items
  useEffect(() => {
    const allNews = [
      ...(headlines || []),
      ...(generalNews || []),
      ...(mergerNews || []),
      ...(currencyNews || []),
      ...(forexNews || [])
    ];

    if (newsWishlist?.favoriteNews && allNews.length > 0) {
      const wishlistNews = allNews.filter(news => 
        newsWishlist.favoriteNews.includes(news.newsId)
      );
      setNewsData(wishlistNews);
    }
  }, [newsWishlist, headlines, generalNews, mergerNews, currencyNews, forexNews]);

  // Filter wishlist items by search term
  const filteredStocks = stockWishlist?.favoriteStocks?.filter(stock => 
    stock.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredNews = newsData.filter(news => 
    news.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.source?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCurrency = currencyWishlist?.favoriteCurrencies?.filter(currency => 
    currency.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRemoveFromStockWishlist = async (stockSymbol: string) => {
    if (!user?.username) return;

    try {
      await removeFromStockWishlist.mutateAsync({ stockSymbol });
    } catch (error) {
      console.error('Failed to remove from stock wishlist:', error);
    }
  };

  const handleRemoveFromNewsWishlist = async (newsItem: string) => {
    if (!user?.username) return;

    try {
      await removeFromNewsWishlist.mutateAsync({ newsItem });
    } catch (error) {
      console.error('Failed to remove from news wishlist:', error);
    }
  };

  const handleRemoveFromCurrencyWishlist = async (currencyCode: string) => {
    if (!user?.username) return;

    try {
      await removeFromCurrencyWishlist.mutateAsync({ currencyCode });
    } catch (error) {
      console.error('Failed to remove from currency wishlist:', error);
    }
  };

  const timeAgo = (unix: number) => {
    const now = Date.now() / 1000;
    const diff = Math.floor((now - unix) / 60);
    if (diff < 1) return 'just now';
    if (diff < 60) return `${diff} minutes ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const renderStockTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Change</TableCell>
            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Target</TableCell>
            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Added</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredStocks.map((stock) => (
            <TableRow key={stock}>
              <TableCell sx={{ fontWeight: 'bold' }}>{stock}</TableCell>
              <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {stock} Inc.
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>$0.00</TableCell>
              <TableCell>
                <Chip
                  icon={<TrendingUp />}
                  label="+0.00%"
                  color="success"
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">$0.00</Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Today</TableCell>
              <TableCell>
                <IconButton 
                  size="small"
                  onClick={() => handleRemoveFromStockWishlist(stock)}
                  color="error"
                  disabled={removeFromStockWishlist.isPending}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderNewsTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Category</TableCell>
            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Added</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredNews.map((news) => (
            <TableRow key={news.newsId}>
              <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {news.headline}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {news.summary}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                    {news.source?.charAt(0) || 'N'}
                  </Avatar>
                  <Link href={news.url} target="_blank" rel="noopener" sx={{ textDecoration: 'none' }}>
                    {news.source}
                  </Link>
                </Box>
              </TableCell>
              <TableCell>
                <Chip 
                  label={news.category?.replace(/\b\w/g, l => l.toUpperCase()) || 'General'} 
                  size="small" 
                  variant="outlined" 
                />
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime sx={{ fontSize: 14 }} />
                  {timeAgo(news.datetime)}
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton 
                    size="small"
                    onClick={() => window.open(news.url, '_blank')}
                    sx={{ color: 'primary.main' }}
                  >
                    <OpenInNew />
                  </IconButton>
                  <IconButton 
                    size="small"
                    onClick={() => handleRemoveFromNewsWishlist(news.newsId)}
                    color="error"
                    disabled={removeFromNewsWishlist.isPending}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderCurrencyTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Pair</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell>Change</TableCell>
            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Target</TableCell>
            <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Added</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredCurrency.map((currency) => (
            <TableRow key={currency}>
              <TableCell sx={{ fontWeight: 'bold' }}>{currency}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>0.0000</TableCell>
              <TableCell>
                <Chip
                  icon={<TrendingUp />}
                  label="+0.00%"
                  color="success"
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">0.0000</Typography>
                </Box>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Today</TableCell>
              <TableCell>
                <IconButton 
                  size="small"
                  onClick={() => handleRemoveFromCurrencyWishlist(currency)}
                  color="error"
                  disabled={removeFromCurrencyWishlist.isPending}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderEmptyState = (type: string, icon: React.ReactNode) => (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Box sx={{ mb: 2 }}>
      {icon}
      </Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        No {type} in your wishlist
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Start adding {type} to your wishlist to track them here
      </Typography>
      <Button variant="contained" startIcon={<Add />}>
        Browse {type}
      </Button>
    </Box>
  );

  if (stockError || newsError || currencyError) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navigation />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load wishlist data. Please try again later.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navigation />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            My Wishlist
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your favorite stocks, news, and currencies
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
            placeholder="Search your wishlist..."
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
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`Stocks (${filteredStocks.length})`} />
            <Tab label={`News (${filteredNews.length})`} />
            <Tab label={`Currencies (${filteredCurrency.length})`} />
          </Tabs>
        </Box>

        {/* Loading State */}
        {(stockLoading || newsLoading || currencyLoading) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Tab Content */}
        {!stockLoading && !newsLoading && !currencyLoading && (
          <>
          {tabValue === 0 && (
              <Box>
                {filteredStocks.length === 0 ? (
                  renderEmptyState('stocks', <BarChart sx={{ fontSize: 64, color: 'grey.400' }} />)
                ) : (
                  renderStockTable()
                )}
              </Box>
          )}

          {tabValue === 1 && (
              <Box>
                {filteredNews.length === 0 ? (
                  renderEmptyState('news', <Article sx={{ fontSize: 64, color: 'grey.400' }} />)
                ) : (
                  renderNewsTable()
                )}
              </Box>
          )}

          {tabValue === 2 && (
              <Box>
                {filteredCurrency.length === 0 ? (
                  renderEmptyState('currencies', <AttachMoney sx={{ fontSize: 64, color: 'grey.400' }} />)
                ) : (
                  renderCurrencyTable()
                )}
              </Box>
            )}
          </>
          )}
      </Container>
    </Box>
  );
};

export default Wishlist;
