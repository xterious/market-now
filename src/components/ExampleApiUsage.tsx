import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { stocksAPI, newsAPI, currencyAPI, authAPI } from '@/config/apiService';
import { Stock, News, CurrencyExchangeRate } from '@/config/types';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField, 
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';

const ExampleApiUsage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [stockQuote, setStockQuote] = useState<Stock | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [exchangeRate, setExchangeRate] = useState<CurrencyExchangeRate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockSymbol, setStockSymbol] = useState('AAPL');
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Example: Fetch stock quote
  const fetchStockQuote = async () => {
    if (!stockSymbol.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const quote = await stocksAPI.getStockQuote(stockSymbol);
      setStockQuote(quote);
    } catch (err) {
      setError('Failed to fetch stock quote');
      console.error('Stock quote error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Example: Fetch news headlines
  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const headlines = await newsAPI.getTopHeadlines();
      setNews(headlines.slice(0, 5)); // Show first 5 headlines
    } catch (err) {
      setError('Failed to fetch news');
      console.error('News error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Example: Fetch currency exchange rate
  const fetchExchangeRate = async () => {
    setLoading(true);
    setError(null);
    try {
      const rate = await currencyAPI.getExchangeRate('USD', 'EUR', 'normal');
      setExchangeRate(rate);
    } catch (err) {
      setError('Failed to fetch exchange rate');
      console.error('Exchange rate error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    setTestResult('');
    
    try {
      console.log('Testing login API...');
      const response = await authAPI.login({
        username: 'testuser',
        password: 'testpass'
      });
      setTestResult(`Login API test successful: ${JSON.stringify(response, null, 2)}`);
    } catch (error: any) {
      console.error('Login API test failed:', error);
      setTestResult(`Login API test failed: ${error.message} - Status: ${error.response?.status} - Data: ${JSON.stringify(error.response?.data)}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      fetchNews();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Box p={3}>
        <Alert severity="info">
          Please log in to see API examples
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        API Usage Examples
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Welcome, {user?.firstName}! Here are examples of how to use the API.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Stock Quote Example */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Quote API
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
                  onClick={fetchStockQuote}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} /> : 'Fetch'}
                </Button>
              </Box>
              
              {stockQuote && (
                <Box>
                  <Typography variant="h6">{stockQuote.symbol}</Typography>
                  <Typography variant="h4" color="primary">
                    ${stockQuote.currentPrice?.toFixed(2)}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color={stockQuote.change >= 0 ? 'success.main' : 'error.main'}
                  >
                    {stockQuote.change >= 0 ? '+' : ''}{stockQuote.change?.toFixed(2)} 
                    ({stockQuote.percentChange?.toFixed(2)}%)
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Currency Exchange Example */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Currency Exchange API
              </Typography>
              <Button 
                variant="contained" 
                onClick={fetchExchangeRate}
                disabled={loading}
                sx={{ mb: 2 }}
              >
                {loading ? <CircularProgress size={20} /> : 'Get USD/EUR Rate'}
              </Button>
              
              {exchangeRate && (
                <Box>
                  <Typography variant="h6">
                    {exchangeRate.base}/{exchangeRate.target}
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {exchangeRate.finalRate?.toFixed(4)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customer Type: {exchangeRate.customerType}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* News Example */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  News Headlines API
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={fetchNews}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={20} /> : 'Refresh News'}
                </Button>
              </Box>
              
              {news.length > 0 && (
                <Box>
                  {news.map((item, index) => (
                    <Box key={index} mb={2} p={2} border={1} borderColor="divider" borderRadius={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.headline}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.summary}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Source: {item.source} | Category: {item.category}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                API Test Component
              </Typography>
              
              <Button 
                variant="contained" 
                onClick={testLogin}
                disabled={isLoading}
                sx={{ mb: 2 }}
              >
                {isLoading ? <CircularProgress size={20} /> : 'Test Login API'}
              </Button>
              
              {testResult && (
                <Alert severity={testResult.includes('failed') ? 'error' : 'success'} sx={{ mt: 2 }}>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                    {testResult}
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExampleApiUsage; 