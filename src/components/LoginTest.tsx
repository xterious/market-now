import React, { useState } from 'react';
import { Button, Box, Typography, Alert, TextField, Card, CardContent } from '@mui/material';
import { authAPI, userAPI } from '@/config/apiService';
import { useAuth } from '@/contexts/AuthContext';

const LoginTest = () => {
  const [username, setUsername] = useState('testuser');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const testAuthContextLogin = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      console.log('=== AUTH CONTEXT LOGIN TEST START ===');
      console.log('Testing AuthContext.login with credentials:', { username, password });
      
      const success = await login(username, password);
      
      if (success) {
        console.log('AuthContext login SUCCESS');
        setResult('✅ AUTH CONTEXT LOGIN SUCCESSFUL!\n\nThe user should now be authenticated and redirected.');
      } else {
        console.log('AuthContext login FAILED');
        setResult('❌ AUTH CONTEXT LOGIN FAILED!\n\nThe login function returned false.');
      }
      
    } catch (error: any) {
      console.error('=== AUTH CONTEXT LOGIN TEST FAILED ===');
      console.error('Error details:', error);
      
      setResult(`❌ AUTH CONTEXT LOGIN FAILED!\n\nError: ${error.message}`);
    } finally {
      setIsLoading(false);
      console.log('=== AUTH CONTEXT LOGIN TEST END ===');
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      console.log('=== LOGIN TEST START ===');
      console.log('Testing with credentials:', { username, password });
      
      // Test 0: Check API connectivity
      console.log('Step 0: Checking API connectivity...');
      try {
        const testResponse = await fetch('http://localhost:8080/test', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Step 0 - API connectivity test status:', testResponse.status);
      } catch (connectError) {
        console.log('Step 0 - API connectivity test failed (expected for /test endpoint):', connectError.message);
      }
      
      // Test 1: Direct API call
      console.log('Step 1: Calling authAPI.login...');
      const authResponse = await authAPI.login({ username, password });
      console.log('Step 1 SUCCESS - Auth response:', authResponse);
      
      // Test 2: Store token
      console.log('Step 2: Storing token...');
      localStorage.setItem('accessToken', authResponse.accessToken);
      console.log('Step 2 SUCCESS - Token stored');
      
      // Test 3: Get user details
      console.log('Step 3: Getting user details...');
      const userData = await userAPI.getCurrentUser();
      console.log('Step 3 SUCCESS - User data:', userData);
      
      setResult(`✅ LOGIN SUCCESSFUL!\n\nAuth Response: ${JSON.stringify(authResponse, null, 2)}\n\nUser Data: ${JSON.stringify(userData, null, 2)}`);
      
    } catch (error: any) {
      console.error('=== LOGIN TEST FAILED ===');
      console.error('Error details:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error config:', error.config);
      
      setResult(`❌ LOGIN FAILED!\n\nError: ${error.message}\nStatus: ${error.response?.status}\nData: ${JSON.stringify(error.response?.data, null, 2)}\nConfig: ${JSON.stringify(error.config, null, 2)}`);
    } finally {
      setIsLoading(false);
      console.log('=== LOGIN TEST END ===');
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Login API Test
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        
        <Button 
          variant="contained" 
          onClick={testAuthContextLogin}
          disabled={isLoading}
          fullWidth
          sx={{ mb: 2 }}
        >
          {isLoading ? 'Testing...' : 'Test AuthContext Login'}
        </Button>
        
        <Button 
          variant="contained" 
          onClick={testLogin}
          disabled={isLoading}
          fullWidth
          sx={{ mb: 2 }}
        >
          {isLoading ? 'Testing...' : 'Test Login API'}
        </Button>
        
        {result && (
          <Alert severity={result.includes('SUCCESS') ? 'success' : 'error'}>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
              {result}
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginTest; 