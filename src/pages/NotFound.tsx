import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Box, Typography, Button, Container } from '@mui/material';
import { Home } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h1" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            404
          </Typography>
          <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4 }}>
            Oops! Page not found
          </Typography>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="contained" startIcon={<Home />}>
              Return to Home
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
