import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  TextField, 
  Grid,
  Alert,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider
} from '@mui/material';
import { ExpandMore, CheckCircle, Error, Warning } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { 
  stocksAPI, 
  newsAPI, 
  currencyAPI, 
  authAPI, 
  wishlistAPI, 
  adminAPI,
  aiAPI 
} from '@/config/apiService';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  data?: any;
  error?: any;
}

const ApiIntegrationTest: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    username: 'testuser',
    password: 'testpass'
  });

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    clearResults();
    
    try {
      // Test 1: Authentication
      addTestResult({ name: 'Starting API Integration Tests', status: 'success', message: 'Tests initialized' });
      
      // Test 2: Stock API
      try {
        const stockQuote = await stocksAPI.getStockQuote('AAPL');
        addTestResult({
          name: 'Stock Quote API',
          status: 'success',
          message: `Successfully fetched ${stockQuote.symbol} quote`,
          data: stockQuote
        });
      } catch (error: any) {
        addTestResult({
          name: 'Stock Quote API',
          status: 'error',
          message: `Failed to fetch stock quote: ${error.message}`,
          error
        });
      }

      // Test 3: News API
      try {
        const news = await newsAPI.getTopHeadlines();
        addTestResult({
          name: 'News Headlines API',
          status: 'success',
          message: 'Successfully fetched news headlines',
          data: news
        });
      } catch (error: any) {
        addTestResult({
          name: 'News Headlines API',
          status: 'error',
          message: `Failed to fetch news: ${error.message}`,
          error
        });
      }

      // Test 4: Currency API
      try {
        const exchangeRate = await currencyAPI.getExchangeRate('USD', 'EUR', 'normal');
        addTestResult({
          name: 'Currency Exchange API',
          status: 'success',
          message: `Successfully fetched ${exchangeRate.base}/${exchangeRate.target} rate`,
          data: exchangeRate
        });
      } catch (error: any) {
        addTestResult({
          name: 'Currency Exchange API',
          status: 'error',
          message: `Failed to fetch exchange rate: ${error.message}`,
          error
        });
      }

      // Test 5: AI API
      try {
        const summary = await aiAPI.summarizeNews('This is a test news article for AI summarization.');
        addTestResult({
          name: 'AI Summarize API',
          status: 'success',
          message: 'Successfully tested AI summarization',
          data: summary
        });
      } catch (error: any) {
        addTestResult({
          name: 'AI Summarize API',
          status: 'error',
          message: `Failed to test AI summarization: ${error.message}`,
          error
        });
      }

      // Test 6: Authentication (if credentials provided)
      if (testCredentials.username && testCredentials.password) {
        try {
          const authResponse = await authAPI.login(testCredentials);
          addTestResult({
            name: 'Authentication API',
            status: 'success',
            message: `Successfully authenticated as ${authResponse.username}`,
            data: { username: authResponse.username, roles: authResponse.roles }
          });
        } catch (error: any) {
          addTestResult({
            name: 'Authentication API',
            status: 'warning',
            message: `Authentication failed (expected if user doesn't exist): ${error.message}`,
            error
          });
        }
      }

      // Test 7: Wishlist API (if authenticated)
      if (isAuthenticated && user?.username) {
        try {
          const wishlist = await wishlistAPI.getStockWishlist(user.username);
          addTestResult({
            name: 'Stock Wishlist API',
            status: 'success',
            message: `Successfully fetched wishlist for ${user.username}`,
            data: wishlist
          });
        } catch (error: any) {
          addTestResult({
            name: 'Stock Wishlist API',
            status: 'error',
            message: `Failed to fetch wishlist: ${error.message}`,
            error
          });
        }
      }

      // Test 8: Admin API (if user has admin role)
      if (isAuthenticated && user?.roles?.some(role => role.name === 'ROLE_ADMIN')) {
        try {
          const allUsers = await adminAPI.getAllUsers();
          addTestResult({
            name: 'Admin Users API',
            status: 'success',
            message: `Successfully fetched ${allUsers.length} users`,
            data: { userCount: allUsers.length }
          });
        } catch (error: any) {
          addTestResult({
            name: 'Admin Users API',
            status: 'error',
            message: `Failed to fetch users: ${error.message}`,
            error
          });
        }
      }

    } catch (error: any) {
      addTestResult({
        name: 'Test Suite',
        status: 'error',
        message: `Test suite failed: ${error.message}`,
        error
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success.main';
      case 'error':
        return 'error.main';
      case 'warning':
        return 'warning.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        API Integration Test Suite
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Test all backend API endpoints to ensure proper integration
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Test Configuration
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Test Username"
                value={testCredentials.username}
                onChange={(e) => setTestCredentials(prev => ({ ...prev, username: e.target.value }))}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Test Password"
                type="password"
                value={testCredentials.password}
                onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={runAllTests}
                disabled={isRunning}
                startIcon={isRunning ? <CircularProgress size={20} /> : null}
              >
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Test Results ({testResults.length})
              </Typography>
              <Button onClick={clearResults} size="small">
                Clear Results
              </Button>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {testResults.map((result, index) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getStatusIcon(result.status)}
                    <Typography 
                      variant="subtitle1" 
                      color={getStatusColor(result.status)}
                      sx={{ fontWeight: 'bold' }}
                    >
                      {result.name}
                    </Typography>
                    <Chip 
                      label={result.status.toUpperCase()} 
                      size="small" 
                      color={result.status === 'success' ? 'success' : result.status === 'error' ? 'error' : 'warning'}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" gutterBottom>
                    {result.message}
                  </Typography>
                  {result.data && (
                    <Box mt={1}>
                      <Typography variant="caption" color="text.secondary">
                        Response Data:
                      </Typography>
                      <pre style={{ 
                        backgroundColor: '#f5f5f5', 
                        padding: '8px', 
                        borderRadius: '4px',
                        fontSize: '12px',
                        overflow: 'auto'
                      }}>
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </Box>
                  )}
                  {result.error && (
                    <Box mt={1}>
                      <Typography variant="caption" color="error">
                        Error Details:
                      </Typography>
                      <pre style={{ 
                        backgroundColor: '#ffebee', 
                        padding: '8px', 
                        borderRadius: '4px',
                        fontSize: '12px',
                        overflow: 'auto'
                      }}>
                        {JSON.stringify(result.error, null, 2)}
                      </pre>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      )}

      {!isAuthenticated && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Some tests require authentication. Log in to test authenticated endpoints.
        </Alert>
      )}
    </Box>
  );
};

export default ApiIntegrationTest; 