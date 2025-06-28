import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  Box, 
  Container, 
  Grid,
  AppBar, 
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  AttachMoney, 
  Public, 
  Notifications, 
  Star, 
  BarChart, 
  Visibility,
  Home,
  TrendingUp as TrendingUpIcon,
  Newspaper,
  AttachMoney as AttachMoneyIcon,
  Star as StarIcon,
  Settings
} from '@mui/icons-material';
import { Link } from "react-router-dom";
import Navigation from '../components/Navigation';
import CustomerTypeIndicator from '@/components/CustomerTypeIndicator';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  // Mock data for demonstration
  const marketData = [
    { symbol: "AAPL", name: "Apple Inc.", price: 175.43, change: +2.34, changePercent: +1.35 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 2834.52, change: -15.23, changePercent: -0.53 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 378.85, change: +5.67, changePercent: +1.52 },
    { symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: +12.45, changePercent: +5.28 },
  ];

  const quickActions = [
    { title: "View Stocks", icon: TrendingUpIcon, path: "/stocks", color: "primary" },
    { title: "Latest News", icon: Newspaper, path: "/news", color: "secondary" },
    { title: "Currency Rates", icon: AttachMoneyIcon, path: "/currency", color: "success" },
    { title: "My Watchlist", icon: StarIcon, path: "/wishlist", color: "warning" },
  ];

  const recentNews = [
    { title: "Federal Reserve announces interest rate decision", source: "Reuters", time: "2 hours ago" },
    { title: "Tech stocks rally on strong earnings reports", source: "Bloomberg", time: "4 hours ago" },
    { title: "Global markets respond to economic data", source: "CNBC", time: "6 hours ago" },
    { title: "Oil prices surge on supply concerns", source: "MarketWatch", time: "8 hours ago" },
    { title: "Cryptocurrency market shows strong recovery", source: "CoinDesk", time: "10 hours ago" },
  ];

  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navigation />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }} className="fade-in">
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CustomerTypeIndicator size="large" showLabel={true} />
          </Box>
          <Typography variant="h1" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
            MarketNow
          </Typography>
          <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Your comprehensive financial dashboard for real-time market data, news, and currency tracking
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <>
                <Button variant="contained" size="large" startIcon={<BarChart />}>
                  Explore Markets
                </Button>
                <Button variant="outlined" size="large" startIcon={<Star />}>
                  Start Watchlist
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="contained" 
                  size="large" 
                  component={Link}
                  to="/signup"
                  sx={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8, #6a4190)'
                    }
                  }}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  component={Link}
                  to="/login"
                >
                  Sign In
                </Button>
              </>
            )}
          </Box>
        </Box>

        {/* Market Overview */}
        <Box sx={{ mb: 6 }} className="fade-in">
          <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
            Market Overview
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3 
          }}>
            {marketData.map((stock) => (
              <Card key={stock.symbol} className="card-elevated" sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                        {stock.symbol}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stock.name}
                      </Typography>
                    </Box>
                    <IconButton size="small" color="primary">
                      <Star />
                    </IconButton>
                  </Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    ${stock.price}
                  </Typography>
                  <Chip
                    icon={stock.change >= 0 ? <TrendingUp /> : <TrendingDown />}
                    label={`${stock.changePercent > 0 ? '+' : ''}${stock.changePercent}%`}
                    color={stock.change >= 0 ? "success" : "error"}
                    size="small"
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: 6 }} className="fade-in">
          <Typography variant="h4" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
            Quick Actions
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3 
          }}>
            {quickActions.map((action) => (
              <Link key={action.title} to={action.path} style={{ textDecoration: 'none' }}>
                <Card className="card-elevated" sx={{ height: '100%', cursor: 'pointer' }}>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <Box sx={{ mb: 2 }}>
                      <action.icon sx={{ fontSize: 48, color: `${action.color}.main` }} />
                    </Box>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                      {action.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Box>
        </Box>

        {/* Recent News & Market Stats */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
          gap: 4 
        }}>
          <Card className="card-elevated">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Newspaper sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                  Latest News
                </Typography>
              </Box>
              
              {/* Horizontal Scrolling News */}
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                overflowX: 'auto', 
                pb: 2,
                '&::-webkit-scrollbar': { height: 6 },
                '&::-webkit-scrollbar-track': { bgcolor: 'grey.100', borderRadius: 3 },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.400', borderRadius: 3 },
                '&::-webkit-scrollbar-thumb:hover': { bgcolor: 'grey.500' }
              }}>
                {recentNews.map((news, index) => (
                  <Card key={index} sx={{ 
                    minWidth: 280, 
                    flexShrink: 0,
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {news.source} • {news.time}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                        {news.title}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Button size="small" variant="outlined">
                          Read More
                        </Button>
                        <IconButton size="small" color="primary">
                          <Star />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button variant="outlined" component={Link} to="/news">
                  View All News
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BarChart sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                  Market Stats
                </Typography>
              </Box>
              <Box sx={{ space: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1">S&P 500</Typography>
                  <Chip label="+1.2%" color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1">NASDAQ</Typography>
                  <Chip label="+0.8%" color="success" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1">DOW</Typography>
                  <Chip label="-0.3%" color="error" size="small" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1">VIX</Typography>
                  <Chip label="15.2" color="default" size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Index;
