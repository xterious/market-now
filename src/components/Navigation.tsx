import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  useTheme, 
  useMediaQuery,
  Typography,
  Container,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import { 
  Home, 
  TrendingUp, 
  Newspaper, 
  AttachMoney, 
  Star, 
  Settings,
  AccountCircle,
  Logout
} from '@mui/icons-material';
import CustomerTypeIndicator from "@/components/CustomerTypeIndicator";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/stocks', label: 'Stocks', icon: TrendingUp },
    { path: '/news', label: 'News', icon: Newspaper },
    { path: '/currency', label: 'Currency', icon: AttachMoney },
    { path: '/wishlist', label: 'Watchlist', icon: Star },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ backdropFilter: 'blur(10px)' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 0 } }}>
          {/* Logo */}
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', mr: 4, textDecoration: 'none' }}>
            <img src="/logo.png" alt="MarketNow Logo" style={{ height: 48, width: 'auto', marginRight: 8 }} />
          </Box>

          {/* Navigation Items */}
          <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              
              return (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={<Icon />}
                  sx={{
                    color: isActive ? 'primary.main' : 'text.primary',
                    backgroundColor: isActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: isActive ? 600 : 400,
                    '&:hover': {
                      backgroundColor: isActive 
                        ? 'rgba(25, 118, 210, 0.12)' 
                        : 'rgba(0, 0, 0, 0.04)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                    ...(isMobile && {
                      minWidth: 'auto',
                      px: 1,
                      '& .MuiButton-startIcon': {
                        margin: 0,
                      },
                      '& .MuiButton-label': {
                        display: 'none',
                      }
                    })
                  }}
                >
                  {!isMobile && item.label}
                </Button>
              );
            })}
          </Box>

          {/* Customer Type Indicator */}
          <Box sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>
            <CustomerTypeIndicator size="small" showLabel={false} />
          </Box>


          {/* Authentication Section */}
          <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            {isAuthenticated ? (
              <>
                <IconButton
                  onClick={handleMenu}
                >
                    <AccountCircle fontSize='large' />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem disabled>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {user?.username[0].toUpperCase() + user?.username.slice(1)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem component={Link} to="/settings" onClick={handleClose}>
                    Settings
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="small"
                  sx={{ 
                    textTransform: 'none',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="contained"
                  size="small"
                  sx={{ 
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8, #6a4190)'
                    }
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
