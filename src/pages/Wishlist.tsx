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
  InputAdornment
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
  BarChart 
} from '@mui/icons-material';
import Navigation from "@/components/Navigation";
import { useWishlist } from "@/contexts/WishlistContext";

const Wishlist = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const stockWishlist = wishlistItems.filter(item => item.type === 'stock').map(item => ({
    symbol: item.data.symbol,
    name: item.data.name,
    price: item.data.price,
    change: item.data.change,
    changePercent: item.data.changePercent,
    targetPrice: item.data.price * 1.05, // Mock target price
    addedDate: new Date(item.addedAt).toLocaleDateString()
  }));

  const newsWishlist = wishlistItems.filter(item => item.type === 'news').map(item => ({
    id: item.data.id,
    title: item.data.title,
    source: item.data.source || 'Unknown',
    category: item.data.category || 'General',
    addedDate: new Date(item.addedAt).toLocaleDateString(),
    summary: item.data.summary || 'No summary available'
  }));

  const currencyWishlist = wishlistItems.filter(item => item.type === 'currency').map(item => ({
    pair: item.data.pair,
    name: item.data.name,
    rate: item.data.rate,
    change: item.data.change,
    changePercent: item.data.changePercent,
    targetRate: item.data.rate * 1.02, // Mock target rate
    addedDate: new Date(item.addedAt).toLocaleDateString()
  }));

  const filteredStocks = stockWishlist.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNews = newsWishlist.filter(news => 
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCurrency = currencyWishlist.filter(currency => 
    currency.pair.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
            <TableRow key={stock.symbol}>
              <TableCell sx={{ fontWeight: 'bold' }}>{stock.symbol}</TableCell>
              <TableCell sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {stock.name}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>${stock.price}</TableCell>
              <TableCell>
                <Chip
                  icon={stock.change >= 0 ? <TrendingUp /> : <TrendingDown />}
                  label={`${stock.changePercent > 0 ? '+' : ''}${stock.changePercent}%`}
                  color={stock.change >= 0 ? "success" : "error"}
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">${stock.targetPrice.toFixed(2)}</Typography>
                  {stock.price >= stock.targetPrice && (
                    <Chip
                      icon={<Notifications />}
                      label="Hit"
                      color="success"
                      size="small"
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{stock.addedDate}</TableCell>
              <TableCell>
                <IconButton 
                  size="small"
                  onClick={() => removeFromWishlist(stock.symbol)}
                  color="error"
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
            <TableRow key={news.id}>
              <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {news.title}
              </TableCell>
              <TableCell>{news.source}</TableCell>
              <TableCell>
                <Chip label={news.category} size="small" variant="outlined" />
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{news.addedDate}</TableCell>
              <TableCell>
                <IconButton 
                  size="small"
                  onClick={() => removeFromWishlist(news.id.toString())}
                  color="error"
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
            <TableRow key={currency.pair}>
              <TableCell sx={{ fontWeight: 'bold' }}>{currency.pair}</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>{currency.rate}</TableCell>
              <TableCell>
                <Chip
                  icon={currency.change >= 0 ? <TrendingUp /> : <TrendingDown />}
                  label={`${currency.changePercent > 0 ? '+' : ''}${currency.changePercent}%`}
                  color={currency.change >= 0 ? "success" : "error"}
                  size="small"
                />
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">{currency.targetRate.toFixed(4)}</Typography>
                  {currency.rate >= currency.targetRate && (
                    <Chip
                      icon={<Notifications />}
                      label="Hit"
                      color="success"
                      size="small"
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{currency.addedDate}</TableCell>
              <TableCell>
                <IconButton 
                  size="small"
                  onClick={() => removeFromWishlist(currency.pair)}
                  color="error"
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

  const renderEmptyState = (type, icon) => (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      {icon}
      <Typography variant="h6" component="h3" sx={{ mb: 1, mt: 2 }}>
        No {type} found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {searchTerm ? `No ${type} match your search criteria.` : `Your ${type} watchlist is empty.`}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navigation />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            My Watchlist
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your favorite stocks, news, and currency exchanges
          </Typography>
        </Box>

        {/* Search */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ pt: 3 }}>
            <TextField
              fullWidth
              placeholder="Search your watchlist..."
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
          </CardContent>
        </Card>

        {/* Categorized Watchlist Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab 
              label={`Stocks (${stockWishlist.length})`}
              icon={<BarChart />}
              iconPosition="start"
            />
            <Tab 
              label={`News (${newsWishlist.length})`}
              icon={<Article />}
              iconPosition="start"
            />
            <Tab 
              label={`Currency (${currencyWishlist.length})`}
              icon={<AttachMoney />}
              iconPosition="start"
            />
          </Tabs>

          {/* Stocks Tab */}
          {tabValue === 0 && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Star sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Stock Watchlist
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Your favorite stocks with price alerts
                </Typography>
                {filteredStocks.length === 0 ? (
                  renderEmptyState('stocks', <BarChart sx={{ fontSize: 48, color: 'text.disabled' }} />)
                ) : (
                  renderStockTable()
                )}
              </CardContent>
            </Card>
          )}

          {/* News Tab */}
          {tabValue === 1 && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Article sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    News Watchlist
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Your saved news articles
                </Typography>
                {filteredNews.length === 0 ? (
                  renderEmptyState('news', <Article sx={{ fontSize: 48, color: 'text.disabled' }} />)
                ) : (
                  renderNewsTable()
                )}
              </CardContent>
            </Card>
          )}

          {/* Currency Tab */}
          {tabValue === 2 && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney sx={{ color: 'success.main', mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Currency Watchlist
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Your favorite currency pairs
                </Typography>
                {filteredCurrency.length === 0 ? (
                  renderEmptyState('currency', <AttachMoney sx={{ fontSize: 48, color: 'text.disabled' }} />)
                ) : (
                  renderCurrencyTable()
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Wishlist;
