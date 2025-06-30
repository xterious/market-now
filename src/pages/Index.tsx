import React from "react";
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
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
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
  Settings,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import CustomerTypeIndicator from "@/components/CustomerTypeIndicator";
import { useAuth } from "@/contexts/AuthContext";
import { useStockSymbols, useTopHeadlines } from "@/hooks/useApi";
import LoginTest from "@/components/LoginTest";

const Index = () => {
  const { isAuthenticated } = useAuth();

  // API calls
  const {
    data: headlines,
    isLoading: newsLoading,
    error: newsError,
  } = useTopHeadlines();
  const {
    data: stockSymbolsData,
    isLoading: stocksLoading,
    error: stocksError,
  } = useStockSymbols("USD", 0, "", 4);

  // Get top 4 stocks for market overview
  const marketData = stockSymbolsData?.content ?? [];

  // Get recent news (top 5)
  const recentNews = headlines?.slice(0, 5) || [];

  const quickActions = [
    {
      title: "View Stocks",
      icon: TrendingUpIcon,
      path: "/stocks",
      color: "primary",
    },
    {
      title: "Latest News",
      icon: Newspaper,
      path: "/news",
      color: "secondary",
    },
    {
      title: "Currency Rates",
      icon: AttachMoneyIcon,
      path: "/currency",
      color: "success",
    },
    {
      title: "My Watchlist",
      icon: StarIcon,
      path: "/wishlist",
      color: "warning",
    },
  ];

  if (stocksError || newsError) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Navigation />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load market data. Please try again later.
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navigation />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box sx={{ mb: 6, textAlign: "center" }} className="fade-in">
          <Typography
            variant="h1"
            component="h1"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            MarketNow
          </Typography>
          <Typography
            variant="h5"
            component="p"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 600, mx: "auto" }}
          >
            Your comprehensive financial dashboard for real-time market data,
            news, and currency tracking
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {isAuthenticated ? (
              <>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<BarChart />}
                >
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
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #5a6fd8, #6a4190)",
                    },
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
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 3, fontWeight: "bold" }}
          >
            Market Overview
          </Typography>
          {stocksLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: 3,
              }}
            >
              {marketData?.isLoading ? (
                <Typography>Loading...</Typography>
              ) : marketData?.error ? (
                <Typography color="error">Failed to load stock data</Typography>
              ) : marketData.length === 0 ? (
                <Typography>No stocks found</Typography>
              ) : (
                marketData.map((stock) => (
                  <Card
                    key={stock.stockSymbol}
                    className="card-elevated"
                    sx={{ height: "100%" }}
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
                            {stock.stockSymbol}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {stock.stockName || "N/A"}
                          </Typography>
                        </Box>
                        <IconButton size="small" color="primary">
                          <Star />
                        </IconButton>
                      </Box>
                      {/* You don't have pricing yet, so leave this placeholder */}
                      <Typography
                        variant="h5"
                        component="div"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        N/A
                      </Typography>
                      <Chip
                        icon={<TrendingUp />}
                        label="0%"
                        color="success"
                        size="small"
                      />
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          )}
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: 6 }} className="fade-in">
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 3, fontWeight: "bold" }}
          >
            Quick Actions
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.path}
                style={{ textDecoration: "none" }}
              >
                <Card
                  className="card-elevated"
                  sx={{ height: "100%", cursor: "pointer" }}
                >
                  <CardContent sx={{ textAlign: "center", py: 4 }}>
                    <Box sx={{ mb: 2 }}>
                      <action.icon
                        sx={{ fontSize: 48, color: `${action.color}.main` }}
                      />
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ fontWeight: "bold" }}
                    >
                      {action.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </Box>
        </Box>

        {/* Recent News & Market Stats */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
            gap: 4,
          }}
        >
          <Card className="card-elevated">
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Newspaper sx={{ mr: 1, color: "primary.main" }} />
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ fontWeight: "bold" }}
                >
                  Recent News
                </Typography>
              </Box>
              {newsLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <List>
                  {recentNews.map((news, index) => (
                    <React.Fragment key={news.newsId}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold", mb: 0.5 }}
                            >
                              {news.headline}
                            </Typography>
                          }
                          secondary={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {news.source}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                •
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(
                                  news.datetime * 1000
                                ).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentNews.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/news"
                  startIcon={<Visibility />}
                >
                  View All News
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <BarChart sx={{ mr: 1, color: "primary.main" }} />
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ fontWeight: "bold" }}
                >
                  Market Stats
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Active Stocks
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {stockSymbolsData?.totalElements || 0}
                  </Typography>
                </Box>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    News Articles
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {headlines?.length || 0}
                  </Typography>
                </Box>
                <Divider />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Market Status
                  </Typography>
                  <Chip label="Open" color="success" size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Login Test Component - For debugging */}
        {!isAuthenticated && <LoginTest />}
      </Container>
    </Box>
  );
};

export default Index;
