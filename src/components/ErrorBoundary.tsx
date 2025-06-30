import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Container, Typography, Button, Alert } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
          <Container maxWidth="md">
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Something went wrong
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                An unexpected error occurred. Please try refreshing the page.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleRetry}
                sx={{ mt: 1 }}
              >
                Try Again
              </Button>
            </Alert>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 